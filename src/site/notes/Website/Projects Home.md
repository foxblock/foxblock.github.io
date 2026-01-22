---
{"dg-publish":true,"dg-path":"Projects Home.md","dg-permalink":"projects","permalink":"/projects/","title":"janek.ing - Project Showcase","hide":true,"dgShowInlineTitle":"false","dgShowFileTree":"false","dgShowToc":true,"created":"2026-01-22T18:47:11.842+01:00","updated":"2026-01-22T20:17:29.228+01:00"}
---

<div>
  <style>
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; width: 100%; padding: 20px; }
    .grid-item { border-radius: var(--radius-m); overflow: hidden; height: 100%; transition: all 0.15s ease-out}
    .grid-item:hover { background-color: var(--link-color-hover); transform: scale(1.05); }
    .grid-item img { width: 100%; height: 150px; object-fit: cover; }
    .grid-item-content { padding: 6px 12px 12px; }
    .grid-item h3 { margin: 0 0 8px 0; font-size: 18px; }
    .grid-item p { margin: 0; font-size: 14px; }
  </style>
  <!-- NOTE (JS, 19.01.2026): inline style is necessary on the main a elements, because a class based style was always overwritten by some "@media (hover:hover) a:hover" style defined in obsidian-base.scss. So this is to prevent text inside the a element behaving like all other links. -->
  <div class="grid" id="projects-grid">
    <a href="#network-visualizer" style="text-decoration:none;color:inherit">
      <div class="grid-item">
        <img src="/img/user/_attachments/2025-05-23 12_21_03-Network Visualizer (v0.3.1-dev).png" alt="Network Visualizer screenshot">
        <div class="grid-item-content">
          <h3>Network Visualizer</h3>
          <p>Visualize and analyze large sets of geospatial data</p>
        </div>
      </div>
    </a>
    <a href="#crank-it" style="text-decoration:none;color:inherit">
      <div class="grid-item">
        <img src="/img/user/_attachments/playdate-20240329-235626.gif" alt="Crank-it! game gif">
        <div class="grid-item-content">
          <h3>Crank-it!</h3>
          <p>Bop-it!-style game for the Playdate</p>
        </div>
      </div>
    </a>
    <a href="#soundbox" style="text-decoration:none;color:inherit">
      <div class="grid-item">
        <img src="/img/user/_attachments/DSC_2698.jpg" alt="Soundbox">
        <div class="grid-item-content">
          <h3>Soundbox</h3>
          <p>Meme sounds at the push of a physical or digital button</p>
        </div>
      </div>
    </a>
    <a href="#wooden-cube-shelf" style="text-decoration:none;color:inherit">
      <div class="grid-item">
        <img src="/img/user/_attachments/DSC_2922.jpg" alt="Wooden cube shelf">
        <div class="grid-item-content">
          <h3>Wooden Cube Shelf</h3>
          <p>Shelf built from bamboo planks with indirect LED lighting</p>
        </div>
      </div>
    </a>
    <a href="#home-lamp" style="text-decoration:none;color:inherit">
      <div class="grid-item">
        <img src="/img/user/_attachments/DSC_2353.jpg" alt="Home Lamp">
        <div class="grid-item-content">
          <h3>Home Lamp</h3>
          <p>WiFi-connected wooden LED-lamp to send a small light to someone you love</p>
        </div>
      </div>
    </a>
    <a href="#terrace-bench" style="text-decoration:none;color:inherit">
      <div class="grid-item">
        <img src="/img/user/_attachments/DSC_0443.jpg" alt="Terrace Bench">
        <div class="grid-item-content">
          <h3>Terrace Bench</h3>
          <p>Comfortable sitting and extendible as 2 person bed</p>
        </div>
      </div>
    </a>
    <a href="#ca-bi-s" style="text-decoration:none;color:inherit">
      <div class="grid-item">
        <img src="/img/user/_attachments/IMG_20170809_151849548.jpg" alt="CaBiS setup">
        <div class="grid-item-content">
          <h3>CaBiS</h3>
          <p>Use your personal transponder and touchscreen to buy snacks</p>
        </div>
      </div>
    </a>
    <a href="#greyout" style="text-decoration:none;color:inherit">
      <div class="grid-item">
        <img src="/img/user/_attachments/shot_20151103_213858.png" alt="Greyout screenshot">
        <div class="grid-item-content">
          <h3>Greyout</h3>
          <p>2D puzzle platformer about perspective and negative space</p>
        </div>
      </div>
    </a>
    <a href="#schizophrenia" style="text-decoration:none;color:inherit">
      <div class="grid-item">
        <img src="/img/user/_attachments/shot03.png" alt="Schizophrenia screenshot">
        <div class="grid-item-content">
          <h3>Schizophrenia</h3>
          <p>Another 2D puzzle platformer about copying stuff</p>
        </div>
      </div>
    </a>
    <a href="#pnd-tools" style="text-decoration:none;color:inherit">
      <div class="grid-item">
        <img src="/img/user/_attachments/PNDTools 2025-05-23 12_27_17-.png" alt="PND Tools screenshot">
        <div class="grid-item-content">
          <h3>PND Tools</h3>
          <p>The most popular package creation tool for the OpenPandora</p>
        </div>
      </div>
    </a>
    <a href="#wandor-world-editor" style="text-decoration:none;color:inherit">
      <div class="grid-item">
        <img src="/img/user/_attachments/mapEditorScreen06.jpg" alt="World editor screenshot">
        <div class="grid-item-content">
          <h3>Wandor World Editor</h3>
          <p>Level creation tool for an unreleased platformer game</p>
        </div>
      </div>
    </a>
    <!--<a href="#various-jewelry" style="text-decoration:none;color:inherit">
      <div class="grid-item">
        <img src="/img/user/_attachments/IMG-20150601-WA0017.jpg" alt="Various Jewelry">
        <div class="grid-item-content">
          <h3>Various Jewelry</h3>
          <p>Mostly wooden jewelry I made</p>
        </div>
      </div>
    </a>-->
  </div>
</div>

## Programming

### Network Visualizer
![2025-05-23 12_21_03-Network Visualizer (v0.3.1-dev).png](/img/user/_attachments/2025-05-23%2012_21_03-Network%20Visualizer%20(v0.3.1-dev).png)
*2024-2025 • C*
Software for working with large clouds of geospatial data. Developed for visualizing and analyzing the performance of a city-wide LoRaWAN network. The main goal was to handle 1M+ datapoints in real-time. Loads 1M datapoints (a 200MB csv file) in less than a second and displays them on top of a fully-featured OpenStreetMap renderer. Is able to load 10M and 100M datapoints as well. Analytic tools like aggregations, displaying connections to gateway stations and more. All in real-time 60+ fps. Minimal dependencies (only curl and raylib).
Currently available upon request.
### Crank-it!
![playdate-20240329-235626.gif](/img/user/_attachments/playdate-20240329-235626.gif)
*2023-2024 • Lua*
Bop-it inspired game developed for the Playdate.
[Available on itch.io](https://foxblock.itch.io/crank-it)
[Code on GitHub](https://github.com/foxblock/playdate-crank-it)
### CaBiS
![IMG_20170809_151849548.jpg](/img/user/_attachments/IMG_20170809_151849548.jpg)
*2017 • Typescript, HTML*
Candy Billing System for my work at the time. Using the general transponder used for building access as authentication and a RaspberryPi with Touchscreen for the interface. Ionic for the frontend, SQLite and node.js microservices for the backend. First time working with node, made a huge mess, but it worked at the end (so a typical Typescript project after all...?).
### Greyout
![shot_20151103_213858.png](/img/user/_attachments/shot_20151103_213858.png)
*2011-2017 • C++*
2D side-scrolling puzzle game developed for the OpenPandora. Realizes the concept of "negative space". You control 2 characters walking in the same world, but one experiencing it in a black-on-white and one in white-on-black way. Physics-based and logic puzzles with a custom engine based on SDL. Soundtrack by Nick May.
[Code on GitHub](https://github.com/foxblock/greyout)
[Video on YouTube](https://www.youtube.com/watch?v=wiD3GaFthdo)
### Schizophrenia
![shot03.png](/img/user/_attachments/shot03.png)
*2012-2013*
2D puzzle platformer where I did the art, most of the game and level design and [theZiz](https://github.com/theZiz) did the code and built a whole 2D software renderer from scratch. Made for a GP2X game jam. 
You control a scientist that can make copies of certain entities in the world to solve puzzles. Kinda like [Snapshot](https://www.pcgamingwiki.com/wiki/Snapshot), although our first designs predates it.
[Code on GitHub](https://github.com/foxblock/schizophrenia)
### PND Tools
![PNDTools 2025-05-23 12_27_17-.png](/img/user/_attachments/PNDTools%202025-05-23%2012_27_17-.png)
*2011-2015 • Delphi*
The most popular tool for creating pnd files on Windows. pnd is the container format used by the open-source handheld [OpenPandora](https://en.wikipedia.org/wiki/Pandora_(computer)).
Multi-windowed GUI with drag-and-grop support for generating a file tree, editing the xml description data and bundling it together. Easy-configuration wizard with a step-by-step guide for beginners.
[Code on GitHub](https://github.com/foxblock/PNDTools)
### Wandor World Editor
![mapEditorScreen06.jpg](/img/user/_attachments/mapEditorScreen06.jpg)
*2009-2011 • Delphi*
Level editor for a never released tile-based 2D side-scrolling game. Multi-Window UI with docking. Support for multiple layers, parallax scrolling background, placing entities from a database, navigating via minimap. Export to a custom file-format which uses Unicode characters and indices into the tilemap.
### Open Source Tools
- A very simple, yet powerful JavaScript library for manual localization in browser UIs (used in projects like Soundbox and Goodnightlamp): [GitHub](https://github.com/foxblock/SimpleHTMLLocalizer)
- Separating Axis Theorem collision checking library for the Playdate: [GitHub](https://github.com/foxblock/pd-sat-collision)
- Several libraries for the ESP32: [Captive Portal](https://github.com/foxblock/esp-captive-portal), [wifiman](https://github.com/foxblock/wifiman)
## Electronics
### Home Lamp
![DSC_2353.jpg](/img/user/_attachments/DSC_2353.jpg)
*2022 • C++, ESP32*
Re-creation of the wonderful [Good Night Lamp](https://www.designswarm.com/good-night-lamp/) by Alexandra Deschamps-Sonsino. Multiple lamps are connected via the internet. When one is turned on, all turn on. Send a warm light meaning "good night", "I just came home safe" or "hey, I am available to call" with the press of a button. Wood and acrylic housing, custom PCB, communication via MQTT, simple web-interface for configuration. My brother an I built this as a Christmas present for our mom. It is still working great after 2+ years.
[Video on YouTube](https://youtu.be/uzuDoKGgP_o)
### Soundbox
![DSC_2698.jpg](/img/user/_attachments/DSC_2698.jpg)
2023 • C++, ESP32
Play popular meme sounds at the press of the button. Annoy or delight your co-workers. Let them join in on the fun via the built-in web-interface.

## Woodworking and Jewlery
### Wooden Cube Shelf
![DSC_2492.jpg|355](/img/user/_attachments/DSC_2492.jpg) ![DSC_2922.jpg|200](/img/user/_attachments/DSC_2922.jpg)
*2023 • Bamboo*
LED-Strips for indirect lighting. Some cubes are compatible to IKEA Expedit accessories for additional storage options.
### Terrace Bench
![DSC_0443.jpg](/img/user/_attachments/DSC_0443.jpg)
*2021 • OSB wood panels, douglas fir 2-by-4s*
Our Corona project. Fits up to 6 people or 2 people lying down. Can fold out one of the side panels to create an area for a mattress.

