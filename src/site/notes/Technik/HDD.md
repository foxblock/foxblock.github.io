---
{"dg-publish":true,"dg-path":"Tech/HDD.md","permalink":"/tech/hdd/","tags":["knowledge-base","german"],"created":"2025-01-31T17:05:20.558+01:00","updated":"2025-05-24T12:54:44.262+02:00"}
---

## SMR vs CMR/PMR
Bei SMR werden die Daten leicht überlappend geschrieben. Dadurch wird eine höhere Speicherdichte erreicht, aber die Schreibraten leiden bei langen Schreibprozessen. Außerdem gibt es Erfahrungsberichte, wo SMR Platten nicht so lange halten und Datenverlust auftritt. 
SMR ist stromsparender und oft günstiger (bei gleicher Speichergröße).
NAS Laufwerke sind meist CMR/PMR. Günstige Consumer Laufwerke oft SMR. Aber Achtung: WD hat zwischen 2 Modellgenerationen von CMR zu SMR gewechselt (WD Red). Das Datenblatt gibt hier meist mehr Auskunft (entweder direkt oder über eine Speicherdichte >1000GB/in²).
Generell sollte man zu CMR/PMR greifen, da die Vorteile überwiegen.
- [SMR? CMR? Welche Festplatte eignet sich am besten für welchen Zweck? - reichelt Magazin](https://www.reichelt.de/magazin/ratgeber/smr-cmr-welche-festplatte-eignet-sich-am-besten-fuer-welchen-zweck/)
- [CMR/SMR: Der HDD-Guide zu den verschiedenen Aufnahmemethoden - Hardwareluxx](https://www.hardwareluxx.de/index.php/artikel/hardware/storage/51244-cmr-smr-der-hdd-guide-zu-den-verschiedenen-aufnahmemethoden.html)
## U/min
- Mehr = schneller (lesen/schreiben), aber lauter und stromhungriger
- Gaming/Performance: 7200+
- NAS/Archiv: 5400
## Cache
- Generell: Mehr = besser
- Cache ist meist SSD-Technik und deutlich schneller als Platten
- je größer, desto eher passen ganze Dateien in Cache, was kleine Lese- oder Schreibvorgänge beschleunigt
## Festplatten Arten
- z.B. WD Black/Blue/Red
- Am besten auf der Hersteller-Webseite gucken, für welchen Anwendungsfall die Bauart gedacht ist und sich an diese Angabe halten.
- Unterschiede sind Bauart (Anzahl Platten), U/min, SMR vs. CMR, Firmware, etc.
- NAS Festplatten sind bspw. darauf ausgelegt dauerhaft zu laufen und verkraften evtl. nicht so viele Spindowns und -ups