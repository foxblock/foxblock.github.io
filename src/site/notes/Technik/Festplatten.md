---
{"dg-publish":true,"dg-path":"Tech/Festplatten.md","permalink":"/tech/festplatten/","tags":["knowledge-base","german"],"created":"2025-12-04T19:17:13.864+01:00","updated":"2025-12-04T09:13:41.301+01:00"}
---

## HDD
### SMR vs CMR/PMR
Bei SMR werden die Daten leicht überlappend geschrieben. Dadurch wird eine höhere Speicherdichte erreicht, aber die Schreibraten leiden bei langen Schreibprozessen. Außerdem gibt es Erfahrungsberichte, wo SMR Platten nicht so lange halten und Datenverlust auftritt. 
SMR ist stromsparender und oft günstiger (bei gleicher Speichergröße).
NAS Laufwerke sind meist CMR/PMR. Günstige Consumer Laufwerke oft SMR. Aber Achtung: WD hat zwischen 2 Modellgenerationen von CMR zu SMR gewechselt (WD Red). Das Datenblatt gibt hier meist mehr Auskunft (entweder direkt oder über eine Speicherdichte >1000GB/in²).
Generell sollte man zu CMR/PMR greifen, da die Vorteile überwiegen.
- [SMR? CMR? Welche Festplatte eignet sich am besten für welchen Zweck? - reichelt Magazin](https://www.reichelt.de/magazin/ratgeber/smr-cmr-welche-festplatte-eignet-sich-am-besten-fuer-welchen-zweck/)
- [CMR/SMR: Der HDD-Guide zu den verschiedenen Aufnahmemethoden - Hardwareluxx](https://www.hardwareluxx.de/index.php/artikel/hardware/storage/51244-cmr-smr-der-hdd-guide-zu-den-verschiedenen-aufnahmemethoden.html)
### U/min
- Mehr = schneller (lesen/schreiben), aber lauter und stromhungriger
- Gaming/Performance: 7200+
- NAS/Archiv: 5400
### Cache
- Generell: Mehr = besser
- Cache ist meist Flashspeicher und deutlich schneller als Platten
- je größer, desto eher passen ganze Dateien in Cache, was kleine Lese- oder Schreibvorgänge beschleunigt
### Festplatten Arten
- z.B. WD Black/Blue/Red
- Am besten auf der Hersteller-Webseite gucken, für welchen Anwendungsfall die Bauart gedacht ist und sich an diese Angabe halten.
- Unterschiede sind Bauart (Anzahl Platten, Lagerung), U/min, SMR vs. CMR, Firmware, etc.
- NAS Festplatten sind bspw. darauf ausgelegt dauerhaft zu laufen und verkraften evtl. nicht so viele Spindowns und -ups
## SSD
- mit DRAM Cache zu bevorzugen (gleiche Funktion wie Flash-Cache auf HDD, enthält die Mappingtabelle für Dateien und freien Speicher). Ohne Cache bricht beim Speichern die Geschwindigkeit irgendwann ein und Dateizugriffe dauern bei voller Platte länger.
	- Crucial: MX500 (mit Cache) > BX500 (ohne Cache)
	- Samsung 860 / 870 Evo
	- WD Red
- Anders als bei HDDs kündigt sich ein Ausfall einer SSD nicht durch defekte Sektoren oder Zugriffsfehler vorher an. SSDs fallen üblicherweise plötzlich und komplett aus.
- Auf TBW-Wert achten (wie viel TB auf die Platte insgesamt geschrieben werden können).
	- Bei Erreichen dieses Wertes sollte die Platte spätestens ausgetauscht werden, wenn kein Ausfall riskiert werden soll
- Meist haben Hersteller 2 Modelle: Eins mit DRAM-Cache und höherem TBW (z.B. 1300 TB) und eins ohne Cache und mit niedrigerem TBW (z.B. 700 TB)
	- Preisunterschied ist oft 10-20€ / TB und es lohnt sich das höherwertige Modell zu holen
- Hersteller von Speichermodule sind: Samsung, Micron/Crucial, SK Hynix und Intel (alle anderen kaufen hier nur ein)