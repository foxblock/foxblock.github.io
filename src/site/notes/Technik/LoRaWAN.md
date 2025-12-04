---
{"dg-publish":true,"dg-path":"Tech/LoRaWAN.md","permalink":"/tech/lo-ra-wan/","tags":["experience","knowledge-base"],"created":"2025-12-04T19:17:13.863+01:00","updated":"2025-12-04T14:51:58.940+01:00"}
---

## SF12 the sweet poison
- you should not use SF11 or SF12 usually
- SF9 with nbTrans = 3 can yield better results
	- 3 total transmissions of the same packet, server will do de-duplication
	- similar energy usage as one SF11 message
	- similar time on air as one SF11 message
- SF12 is on the air for much longer (depending on data, 1s or longer), so much higher chance for collisions or interferance
- higher SF gives you more range and penetration in theory. In practice it's usually not the range that kills you but external disruptions
- in my testing, we reduced loss from 10% to <2% by switching from SF10+ to SF7..9 with nbTrans=3
	- use case was parking sensors within 1-2km of the next gateway
- you would be surprised how far you can get with SF7

Talk from Semtech about nbTrans: [LoRaWAN and the IoT - Olivier Seller (Semtech)](https://www.youtube.com/watch?v=VmYuItA6q4I&list=RDCMUCv85CXnZUXEKnlZpQapTAwQ&start_radio=1&t=450s) (7:20 to 22:00)
## ADR
- leave ADR on device side on (never fix datarate/SF in the device config)
- modern network servers will let you adjust SF for individual devices over the network, which allows remote configuration (not via device driver downlinks but standard LoRa `LinkADRReq` MAC commands, so compatible with all devices)
## Confirmed uplinks
- don't use these, unless you really have to and understand the implications
	- they use a downlink
	- lora gateways are only half-duplex, so they cannot receive while transmitting and vice versa
	- professional gateways have 16 uplink channels (consumer grade hardware: 8 or less), but only 1 channel for downlinks
	- that means the downlink for a confirmed uplink blocks the whole gateway for a period of time, essentially slashing the throughput by up to 1/16x
		- though the downlink blocks only one gateway, while any uplink might block one channel of any gateway in range
- in my testing, confirmed uplinks may be lost still, so you cannot even rely on this for 100% coverage
- it's a better idea to use `nbTrans`, if you just want to reduce loss (see [[#SF12 the sweet poison]])
- can use confirmed uplinks to test network access, record (approx.) time of dropped connection (to retransmit dater later), and start join process again
	- transmit every 10th or 20th uplink as confirmed (ideally make this available as a setting based on uplink count OR time - count works well with periodic uplinks, time works well with sporadic events)
	- can also use [LinkCheckReq](https://learn.semtech.com/mod/book/view.php?id=172&chapterid=108) network messages for this purpose, which are more lightweight (but they also incur a downlink!)
- especially do not send *every* uplink as confirmed or send `LinkCheckReq` after every uplink!
	- if you really need to make sure every message is received, LoRaWAN is the wrong technology to use!

Meta study about confirmed traffic: [A Survey on the Viability of Confirmed Traffic in a LoRaWAN | IEEE Journals & Magazine | IEEE Xplore](https://ieeexplore.ieee.org/document/8952708)
## Devices / Sensors
- choose devices which let you configure everything via downlinks. It will make your life much easier, because you can configure them remotely. Getting every parameter right a-priori is hard. You will learn a lot while doing a use-case and will want to adjust on the fly
- Chose a manufacturer that supplies their full payload description and ideally a TTN driver. Look at the documentation carefully. Often it is not complete
	- avoid companies that make you pay for this
	- Sensoterra is really bad (uplinks are encrypted forcing you to use their cloud services)
- Having a way to locally configure the sensor is a big plus. Speeds up rollouts and early iterations (since you do not have to wait for the downlink response and downlinks might get lost). I like the NFC-based approaches (see Milesight and Elsys devices). USB is fine too, but usually more cumbersome.
- I can generally recommend devices by Milesight and Abeeway
- did not have good luck with RAK devices (hardware was unreliable)
- Kerlink Wanesy Wave was also a failure. The device would often forget it's configuration parameters and only send one join request per startup, so it would get stuck offline if that one join request was lost.
## Decoders and Firmware
My wishlist for a device firmware:
- add a downlink that makes the device send its config in an uplink
	- if your LNS or application server does not track the current config, it is helpful to quickly get the state of a sensor
- make everything configurable via downlink
	- especially the periodic update interval
	- no need for SF settings though, Lora can handle that with MAC commands ([[#ADR]])
- make the sensor confirm each configuration by sending the new values back
- keep the configuration simple. It will make the operators and decoder developers job much easier.
	- again Milesight is doing a good job in this regard
	- Watteco ino devices are particularly bad example. Their configuration is ridiculously complex for no reason inherit whatsoever.
- Ideally make it possible to configure individual values without having to send the current values of parameters you don't want to change
- keep packages as small as possible
	- only transmit necessary information
	- use sensible data types (e.g. ambient temperature can be compressed down to an int8 with 0,2 precision and limited range)
	- work with standard data types (int8/uint16/etc.). Most of the time, using special types to reduce size by a few bits (or splitting them over parts of a byte to fill unused bits of other fields) is not worth the cost of added complexity
	- use the port! It is transmitted every time, so you essentially get one uint8 for free (or rather pay the cost anyway if you don't use it)
- properly implement all the system messages (MAC commands): [3 - Receiving Messages: Handling MAC Commands | Semtech Learning Center](https://learn.semtech.com/mod/book/view.php?id=173&chapterid=138)
	- there is a quite a bit important functionality there, that you will not have to implement in custom parameters
	- `LinkADRReq`: change ADR and nbTrans as requested by the server. Makes it possible to set SF/DR values from the server. nbTrans is also very useful to decrease loss (see [[#SF12 the sweet poison]])
	- `DeviceTimeAns`: Get UTC time from the server
	- `DevStatusReq`: Transmit battery and network info, so it can be displayed on the server (countless devices implement this wrong, leading to all kinds of horrible workarounds)
	- `LinkCheckAns`: Get link margin and number of gateways in reach from server. Useful to adjust SF/DR when ADR is on.
- for parking devices in particular (or any device recording a binary change):
	- include a timestamp of the last change in the periodic uplink. This enables you to reconstruct some data, if the uplink at the time of change was lost
- generally keep in mind that packages will get lost, so provide means to mitigate this
	- record data locally and send them again if requested by a downlink
	- send change event uplinks, but also periodic uplinks with all of the current values
- provide documentation with examples! Examples help understanding and can serve as a first test case for your own implementation.

My plea to vendors for driver code:
- for the love of god, just write simple driver code
- switch on type bytes, then convert the data (Milesight drivers are a good reference here)
- don't do overly complicated map reduce shit, it will bite you in the ass later and make the driver much less readable, more complicated and way slower than it needs to
- don't convert uplink data to a hex or binary string, just work with the raw bytes
- don't use .slice, just index into the byte array
- yes, JavaScript handles numbers in a weird way, but the rules are consistent. Just learn them.
### Wall of shame
Seriously, don't do this (actual code from an actual professional "production-ready" driver):
```JavaScript
var i = bytesToInt(byte);
var bm = ('00000000' + Number(i).toString(2)).substr(-8).split('').map(Number).map(Boolean);
return ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
	.reduce(function (obj, pos, index) {
		obj[pos] = bm[index];
		return obj;
	}, {});
```
Just do this:
```JavaScript
return {
	"a": (byte & 0x80) > 0,
	"b": (byte & 0x40) > 0,
	"c": (byte & 0x20) > 0,
	"d": (byte & 0x10) > 0,
	"e": (byte & 0x08) > 0,
	"f": (byte & 0x04) > 0,
	"g": (byte & 0x02) > 0,
	"h": (byte & 0x01) > 0,
};
// you can even use binary literals (i.e. 0b01000000 insead of 0x40, etc.)
// if your environment supports ES6
```

The following is also pretty bad (I have removed some parts for brevity):
```JavaScript
var sensorEuiLowBytes
var sensorEuiHighBytes
var realDataValue = isSpecialDataId(dataID) ? ttnDataSpecialFormat(dataID, dataValue) : ttnDataFormat(dataValue)

...
      switch (dataID) {
...
        case 2:
          // sensor eui, low bytes
          sensorEuiLowBytes = realDataValue
          break
        case 3:
          // sensor eui, high bytes
          sensorEuiHighBytes = realDataValue
          break
...
      }
...

  // if the complete id received, as "upload_sensor_id"
  if (sensorEuiHighBytes && sensorEuiLowBytes) {
    decoded.messages.unshift({
      type: 'upload_sensor_id', channel: 1, sensorId: (sensorEuiHighBytes + sensorEuiLowBytes).toUpperCase()
    })
  }

...

function ttnDataFormat (str) {
  var strReverse = littleEndianTransform(str)
  var str2 = toBinary(strReverse)
  if (str2.substring(0, 1) === '1') {
    var arr = str2.split('')
    var reverseArr = []
    for (var forArr = 0; forArr < arr.length; forArr++) {
      var item = arr[forArr]
      if (parseInt(item) === 1) {
        reverseArr.push(0)
      } else {
        reverseArr.push(1)
      }
    }
    var num = parseInt(reverseArr.join(''), 2) + 1
    return parseFloat('-' + num / 1000)
  }
  return parseInt(str2, 2) / 1000
}

// configurable
function ttnDataSpecialFormat (dataId, str) {
  var strReverse = littleEndianTransform(str)
  if (dataId === 2 || dataId === 3) {
    return strReverse.join('')
  }

  // handle unsigned number
  var str2 = toBinary(strReverse)
  var dataArray = []
  switch (dataId) {
...
    case 7:
      // battery && interval
      return {
        interval: parseInt(str2.substr(0, 16), 2), power: parseInt(str2.substr(-16, 16), 2)
      }
    case 9:
      let dataValue = {
        detectionType: parseInt(str2.substring(0, 8), 2),
        modelId: parseInt(str2.substring(8, 16), 2),
        modelVer: parseInt(str2.substring(16, 24), 2)
      }
      // 01010000
      return dataValue
  }
}
```
You have `realDataValue`, which can either be a Number, a string or two different types of structs! `realDataValue` is then copied to two other variables. So everywhere you want to work with any of these 3 vars, you would have to check which type you are working with! Which the code does not do: `(sensorEuiHighBytes + sensorEuiLowBytes).toUpperCase()`. At the moment this might be okay, since this codepath is only called with strings. But that is dangerous implicit knowledge with a high potential to explode at some point. 
Don't merge codepaths that do different things! Instead of working with a mystery object, explicitly parse the data at the point where you know which data to expect (switch on type bytes, then do the conversion from bytes to whatever data you need).
Then there is also this gem:
```JavaScript
var num = parseInt(reverseArr.join(''), 2) + 1
return parseFloat('-' + num / 1000)
```
Converting a string to an int, to convert it back to a string to negate it, to be converted into a float (which ironically can become NaN if num is already negative). A better solution is left as an exercise to the reader.

## Installing The Things Stack on an RaspberryPi in 2025
This basically is an updated version of this "official" guide: [Deploy The Things Stack  in your local network](https://www.thethingsnetwork.org/article/deploy-the-things-stack-in-your-local-network)
### What do you need?
- Raspberry Pi with MicroSD card
    - I used a RaspberryPi 4 with 8GB of RAM (though looking at `top` with tts running, 4GB are more than enough for a small/test setup)
- A Local Network (WiFi, but Ethernet can also be used)  
    - DHCP Server (that assigns a static IP address to your Raspeberry Pi)  
    - DNS Records or DNS Server in your local network (optional)
### End result
In the end you will get a working open source installation of The Things Stack on your Raspberry Pi with a gateway connected to it for sending and receiving data. Everything is connected locally through WiFi or Ethernet and without TLS (so http only). You can use this as a private LoRaWAN setup (e.g. for testing).
This guide will focus on the open-source version.
### Setting up the Pi
**Install the Raspberry Pi Operating System:** https://www.raspberrypi.org/software
- Download the Raspberry Pi Imager.
- Start the Raspberry Pi Imager, select Raspberry Pi OS (Other) > Raspberry Pi OS Lite (64-bit)
- Select the SD card.
- Click Write (you may have to enter your password)
- When promted if you want to apply or change settings, click "Change settings"
- Here you can set the mDNS address (I chose `thingsstack.local`), configure your username and password, configure WiFi and enable SSH. You should do all of these steps, since it saves you from connecting a monitor and keyboard to the Pi. You then can do the rest of the installation via SSH.
- When it's finished, take the SD card and slide it into your Raspberry Pi. The first time you power on your Raspberry Pi it may restart a couple of times, but eventually you'll see the login prompt or are able connect via SSH.

**If you missed setting up WiFi or SSH in the imager:**
- Connect a monitor and keyboard to the Pi
- Login with your username and password (default is `pi` and `raspberry`)
- Run `sudo raspi-config` from the shell for the general configuration tool
- More info here: [Configuration - Raspberry Pi Documentation](https://www.raspberrypi.com/documentation/computers/configuration.html)

**Find out the IP of your Pi and connect to it via SSH**
- If a monitor is connected, you can find it in the login promt or during boot ("My IP address is:")
- Else check the DHCP leases in your router or do an IP scan
- On your PC run `ssh username@ip` with the username you setup for the pi (default `pi`) and the IP you just looked up
### Installation
**Update packages**
- Run `sudo apt-get update` and afterwards `apt-get upgrade`, which will update all packages to their latest versions

**Install docker**
- download Docker's GPG key 
```
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
```
- add their apt repository
```
echo \ "deb [arch=armhf signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```
- Run `sudo apt-get update` again and then install docker and its tools using the following
```
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin
```
If anything fails during this step, check the official guide: [Debian | Docker Docs](https://docs.docker.com/engine/install/debian)

**Setup docker**
- Add a docker group: `sudo groupadd docker`
- Add the current user: `sudo usermod -aG docker $USER`
- Load the group: `newgrp docker`
- Now docker should work without errors. To try run `docker ps`
If anything fails during this step, check the official guide: [Post-installation steps | Docker Docs](https://docs.docker.com/engine/install/linux-postinstall)

**Next, we'll install The Things Stack**
- Setup a folder for the installation and assign it to your user (which you chose when setting up the image, default is `pi`). The folder can be something different, if you like:
```
sudo mkdir -p /app/the-things-stack

sudo chown username:username /app/the-things-stack 

cd /app/the-things-stack
```
- Download the example docker-compose file from the TTI website
```
curl -sSL -o docker-compose.yml https://www.thethingsindustries.com/docs/enterprise/docker/configuration/docker-compose-open-source.yml
```
- There is no need to change the versions in the docker-compose.yml. As of 07/25 everything works well with the latest versions (version 3.7, postgreSQL latest, things-stack latest, etc.)
- At the time of writing it is using the following versions (you may fix these, if it stops working any time in the future)
	- postgres: 17.5-1.pgdg120+1
	- redis: 8.0.3
	- stack: 3.34.1.e22b9512d
- Install everything by running `docker compose pull`

**Time to configure The Things Stack**
- At this point you have to chose, whether to address the Pi via IP or a domain (if you did setup DNS previously). IP will always work without further setup, but comes with some [[#Changing the IP|caveats]] (i.e. I strongly recommend setting a static IP for the Raspberry Pi). If you have a domain to use, that is probably preferrable. 
- NOTE: The mDNS address (xyz.local) will not work here! Logging in would result in OAuth errors for me.
- Enter one of the following to set an environment variable, we are going to use later:
```
HOSTNAME=192.168.178.43

HOSTNAME=demo.thethingsconference.com
```
- Set up some random secrets for the Console
```
CONSOLE_SECRET=$(openssl rand -hex 16)
```

- [ ] TODO: Check ttn-lw-stack-docker.yml file

- We'll first have The Things Stack write a full list of environment variables to a file, and then I'll create an empty file so that we can cherry-pick the environment variables we want to override.
```
docker compose run --rm stack config --env > stack.default.env

touch stack.env
```
- Disable TLS listeners (since we will not be using https)
```
grep LISTEN_TLS stack.default.env | sed -e "s/:888[0-9]//" >> stack.env

grep PUBLIC_TLS_ADDRESS stack.default.env | sed -e "s/localhost:888[0-9]//" >> stack.env
```
- Change every instance of `localhost` to the hostname we set earlier (this includes MQTT ports 1881..1883)
```
grep localhost:188[123] stack.default.env | sed -e "s/localhost/$HOSTNAME/" >> stack.env
```
- Remove port 1885 (not needed for http only)
```
grep localhost:1885 stack.default.env | sed -e "s/localhost:1885/$HOSTNAME/" >> stack.env
```
- Change every instance of https, wss, mqtts to their insecure variants
```
grep 's://localhost:888' stack.default.env | sed -e "s|s://localhost:888|://$HOSTNAME:188|" >> stack.env
```
- Write secret to file
```
echo TTN_LW_CONSOLE_OAUTH_CLIENT_SECRET=$CONSOLE_SECRET >> stack.env
```
- For HTTP cookie secrets, just write some random values
```
echo TTN_LW_HTTP_COOKIE_BLOCK_KEY=$(openssl rand -hex 32) >> stack.env

echo TTN_LW_HTTP_COOKIE_HASH_KEY=$(openssl rand -hex 64) >> stack.env
```
- Remove quotes (docker compose does not like these)
```
sed -i'' -e 's/"//g' stack.env
```
- Check if the file looks good: `cat stack.env`
- To set the environment file, edit `docker-compose.yml` and add `env_file: stack.env` to the `stack` block at the bottom.
	- see https://docs.docker.com/compose/how-tos/environment-variables/set-environment-variables/#use-the-env_file-attribute for more info

**Now let's initialize The Things Stack**
- Initialize the database
```
docker compose run --rm stack is-db migrate
```
- Create the admin user (change e-mail). Enter the password fairly quickly, else you will get a "context deadline exceeded" error and need to try again
```
docker compose run --rm stack is-db create-admin-user --id admin --email your@email.com
```
- Setup OAuth
```
docker compose run --rm stack is-db create-oauth-client --id cli --name "Command Line Interface" --owner admin --no-secret --redirect-uri "local-callback" --redirect-uri "code"

docker compose run --rm stack is-db create-oauth-client --id console --name "Console" --owner admin --secret "${CONSOLE_SECRET}" --redirect-uri "/console/oauth/callback" --logout-redirect-uri "/console"
```

**Time to start The Things Stack**
- Start everything up
```
docker compose up -d stack
```
- Watch the logs
```
docker compose logs -f stack
```
- If you setup mDNS during Raspberry Pi image creation you can go to that domain in your browser (xyz.local), else enter the IP address of the PI to open up the GUI
- Login using the admin credentials you just created
- Enable automatic startup of the thingsstack at boot
	- services in the docker compose file are set to `restart: unless-stopped`, so they will automatically boot-up when not manually shut down. i.e. if you just disconnected the power, they will boot up again. If you shut them down properly (`docker compose down -d stack`), they will not come back.
	- Change the setting to `restart: always`, if you want them to always come back.
```
sudo systemctl enable docker
```
**Setup the CLI**
- Install the CLI tool on your laptop (not the raspberryPi): [Installing the CLI | The Things Stack for LoRaWAN](https://www.thethingsindustries.com/docs/concepts/features/cli/installing-cli/)
-  Here replace `YOUR_DOMAIN_OR_IP` with the address you use to access the Raspberry Pi
```
ttn-lw-cli use YOUR_DOMAIN_OR_IP --grpc-port 1884
```
- A config file should be created next to the cli tool called `.ttn-lw-cli.yml`, open it for editing
- Change every instance of HTTPS to HTTP
- Set `insecure` to true
- You should be able to login using `tti-lw-cli login` (or `.\tti-lw-cli.exe login` on Windows). It will open your web browser to get an access token, login there if you are not already.
### Gateway Installation
see [Adding Gateways | The Things Stack for LoRaWAN](https://www.thethingsindustries.com/docs/hardware/gateways/concepts/adding-gateways/) and [LoRa Basics™ Station | The Things Stack for LoRaWAN](https://www.thethingsindustries.com/docs/hardware/gateways/concepts/lora-basics-station/) for adding Gateways.

Using [Basic Station](https://www.thethingsindustries.com/docs/hardware/gateways/concepts/lora-basics-station/) did not work with [Tektelik Micro Gateways](https://knowledgehub.tektelic.com/basic-station-interface-for-ttnv3). There were TLS errors (probably because the connection to the PI is not secured) - even though TLS was disabled in the configuration on the gateway (maybe it's a gateway bug?).

Installation of the [UDP Package Forwarders](https://knowledgehub.tektelic.com/connecting-kona-gateways-to-3rd-party-network-servers) worked instead (Tektelik calls is "Kona Package Forwarder", installation instructions for TTN further down the page linked above). To setup you will need the KonaFT tool. Chose the "SNMP V2c" protocol. Username and password can be found on the "KONA Test Summary Certificate" which comes with the gateway.
### Troubleshooting
If you are getting "OAuth" errors when trying to login to the ThingsStack GUI, there probably is a mismatch between the IP you are accessing the GUI on and the one setup for the auth-service in the `stack.env` file. 
Solution: Confirm the IP of the Raspberry Pi is the same as the one in `stack.env`, change it if necessary and restart the docker container. See [[#Changing the IP|below]] for caveats.
### Changing the IP
If the IP of the RaspberryPi ever changes, you need to change the IPs in the `stack.env` file, close the application with `docker compose down` (if it is running) and restart it with `docker compose up -d stack` (`docker compose restart` did not work for me). 

> [!WARNING] IP changes
> You should only do this while you have not registered any device yet. This is also why using a domain is preferred.

Applications and Devices are registered on a "cluster", which is determined by the IP of the Server (i.e. the RaspberryPi) at the time of creation. If the IP changes, you will need to change the "cluster" of the application using the CLI:
```
ttn-lw-cli applications set APP_ID --network-server-address NEW_IP --application-server-address NEW_IP --join-server-address NEW_IP
```
see for more info: [ttn-lw-cli applications set | The Things Stack for LoRaWAN](https://www.thethingsindustries.com/docs/ttn-lw-cli/ttn-lw-cli_applications_set/)

> [!FAIL] Updating device cluster
> Devices will also need to be updated. However I have not found a way to do this. Running equivalent commands only results in errors like `Registered Network Server address of end device "xyz" does not match CLI configuration`. I was also unable to delete the device. So beware!
