---
{"dg-publish":true,"dg-path":"Tech/LoRaWAN.md","permalink":"/tech/lo-ra-wan/","tags":["experience","knowledge-base"],"created":"2025-08-22T22:09:49.885+02:00","updated":"2025-08-22T15:16:49.734+02:00"}
---

## SF12 the sweet poison
- should not use SF11 or SF12 usually
- SF9 with nbTrans = 3 can yield better results
	- 3 total transmissions of the same packet, server will do de-duplication
	- similar energy usage as one SF11 message
	- similar time on air as one SF11 message
- SF12 is on the air for much longer (depending on data, 1s or longer), so much higher chance for collisions or interferance
- higher SF gives you more range and penetration in theory. In practice it's usually not the range that kills you but external disruptions
- in my testing, we reduced loss from 10% to <2% by switching from SF10+ to SF7..9 with nbTrans=3
	- use case was parking sensors within 1km of the next gateway
- you would be surprised how far you can get with SF7

Talk from Semtech about nbTrans: [LoRaWAN and the IoT - Olivier Seller (Semtech)](https://www.youtube.com/watch?v=VmYuItA6q4I&list=RDCMUCv85CXnZUXEKnlZpQapTAwQ&start_radio=1&t=450s) (7:20 to 22:00)
## ADR
- leave ADR on device side (never fix datarate/SF on the device)
- modern network servers will let you adjust SF for individual devices over the network, so configuration becomes much easier (not via device driver downlinks but standard LoRa *LinkADRReq* packages, so compatible with all devices)
## Confirmed uplinks
- don't use these, unless you really have to and understand the implications
- they use a downlink
- lora gateways are only half-duplex, so they cannot receive while transmitting and vice versa
- professional gateways have 16 uplink channels (consumer grade hardware: 8 or less), but only 1 channel for downlinks
- that means the downlink for a confirmed uplink blocks the whole gateway for a period of time, essentially slashing the throughput by up to 1/16x
	- though the downlink blocks only one gateway, while any uplink might block one channel of any gateway in range
- also in my testing confirmed uplinks may be lost still, so you cannot even rely on this for 100% coverage
- it's a better idea to use nbTrans, if you just want to get as many messages as possible (see [[#SF12 the sweet poison]])
- can use confirmed uplinks to test network access, record (approx) time of dropped connection (to retransmit dater later), and start join process again
	- transmit every 10th or 20th uplink as confirmed (ideally make this a setting based on count OR time)
	- can also use *LinkCheckReq* network messages for this purpose

Meta study about confirmed traffic: [A Survey on the Viability of Confirmed Traffic in a LoRaWAN | IEEE Journals & Magazine | IEEE Xplore](https://ieeexplore.ieee.org/document/8952708)
## Devices / Sensors
- choose devices which let you configure everything via downlinks. It will make your life much easier, because you can configure them remotely. Getting every parameter right a-priori is hard. You will learn a lot while doing a use-case and will want to adjust.
- Chose a manufacturer that supplies their full payload description and ideally TTN driver. Look at the documentation carefully. Often it is not complete
	- avoid companies that make you pay for this
	- Sensoterra is really bad (uplinks are encrypted forcing you to use their cloud services)
- Having a way to locally configure the sensor is a big plus. Speeds up rollouts and early iterations (since you do not have to wait for the downlink response and downlinks might get lost). I like the NFC-based approaches (see Milesight and Elsys devices). USB is fine too, but usually more cumbersome.
- I can generally recommend devices by Milesight and Abeeway
- did not have good luck with RAK devices (hardware was unreliable)
## Drivers / Firmware
- my plea to vendors: for the love of god, just write simple driver code
- switch on type bytes and convert the data (Milesight drivers are a good reference here)
- don't do overly complicated map reduce shit, it will bite you in the ass later and make the driver much less readable, more complicated and way slower than it needs to
- don't convert anything to a hex string, just work with the raw bytes
- don't use .slice, just index into the byte array
- yes, JavaScript handles numbers in a weird way, but the rules are consistent. Just learn them.
Seriously, don't do this (actual code from an actual "production-ready" driver):
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
```
- add a downlink that makes the device send its config in an uplink
	- if your LNS or application server does not track the current config, it is helpful to quickly get the state of a sensor
- make everything configurable via downlink
	- no need for SF settings though, Lora can handle that by default ([[#ADR]])
## Installing The Things Stack on an RaspberryPi in 2025
Follow this guide:
https://www.thethingsnetwork.org/article/deploy-the-things-stack-in-your-local-network
I also used a RaspberryPi 4 with 8GB of RAM (though looking at `top` 4GB are more than enough for a small/test setup)

We install the open-source version of TTS and skip all steps that say so (which it usually says after the step, so beware!).

NOTE: Make the following changes (roughly in order as they appear in the guide)

To add the docker apt repository run this instead (backslash removed):
```
echo \ "deb [arch=armhf signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

From the "Next we'll install The Things Stack:" chapter onwards they put multiple commands on one line separated by $ (likely just a HTML/layout error).
These will not work when just copy and pasted.
You will have to copy the commands one-by-one and run them individually (without the $).

The URL to the docker-compose.yml has moved to:
https://www.thethingsindustries.com/docs/enterprise/docker/configuration/docker-compose-open-source.yml

You do not need to change the docker-compose.yml. It seems to work fine with the default values (version 3.7, postgreSQL latest, etc.) as of 07/25.

Don't forget to run `docker-compose pull` at the end of the install chapter (it is not marked as a command).

Use the IP as HOSTNAME, "thingsstack.local" did not work and would result in OAuth errors after trying to log in (though you can still use it to open the webpage as a user).

To use the stack.env file in docker compose, add `env_file: stack.env` to the stack block in docker-compose.yml
see https://docs.docker.com/compose/how-tos/environment-variables/set-environment-variables/#use-the-env_file-attribute for more info

Skip the packet broker steps.

Use `migrate` instead of `init` when initializing the database.

For most of the commands in the "initialize" chapter, you will need to remove the backslashes \ from the commands. 
They are to escape line breaks, but the commands render without line breaks, probably because someone fucked up the rendering of the page.

```
docker-compose run --rm stack is-db create-admin-user --id admin --email your@email.com
docker-compose run --rm stack is-db create-oauth-client --id cli --name "Command Line Interface" --owner admin --no-secret --redirect-uri "local-callback" --redirect-uri "code"
docker-compose run --rm stack is-db create-oauth-client --id console --name "Console" --owner admin --secret "${CONSOLE_SECRET}" --redirect-uri "/console/oauth/callback" --logout-redirect-uri "/console"
```

When creating the admin user, it seems like the password has to be entered rather quickly. Else you get a "context deadline exceeded" error and need to try again.

To enable automatic startup of the stack at boot:
```
sudo systemctl enable docker
```
The services in the docker compose file are set to `restart: unless-stopped`, so they will automatically boot-up when not manually shut down. i.e. if you just disconnected the power, they will boot up again. If you shut them down properly (`docker compose down -d stack`), they will not come back.
Change the setting to `restart: always`, if you want them to always come back.

Use `docker compose up -d stack` instead of "docker-compose up -d stack". The latter only worked like 3 times then spat out weird errors about "ContainerConfig".
see: https://askubuntu.com/questions/1508129/docker-compose-giving-containerconfig-errors-after-update-today
(have not tried to use it before this, but might be worth a try if previous docker-compose commands throw errors as well).

I have skipped the CLI setup at the end for now.

see [Adding Gateways | The Things Stack for LoRaWAN](https://www.thethingsindustries.com/docs/hardware/gateways/concepts/adding-gateways/) and [LoRa Basics™ Station | The Things Stack for LoRaWAN](https://www.thethingsindustries.com/docs/hardware/gateways/concepts/lora-basics-station/) for adding Gateways.