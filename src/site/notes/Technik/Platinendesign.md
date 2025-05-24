---
{"dg-publish":true,"dg-path":"Tech/Platinendesign.md","permalink":"/tech/platinendesign/","tags":["experience","german"],"created":"2025-01-23T21:11:49.942+01:00","updated":"2025-05-24T12:56:00.745+02:00"}
---

## Lessons Learned
- Kleine blanke Fläche der Ground Plane am Rand für GND-Klammer des Oszilloskops
- Probe Points vorsehen
	- Blanke punkte and allen wichtigen Signalen und Spannungsleveln
	- besser (wenn platz): Pin-Header, damit man einfach festes Kabel anschließen kann
- Glättungskondensatoren vorsehen
	- an allen wichtigen Spannungsleveln (extern wie intern), insbesondere Quellspannung für CPU/MC
	- man kennt nie die Qualität des einkommenden Spannungslevels und muss ggf. Schwankungen ausgleichen, um Brownouts zu verhindern.
	- Meist reichen 10µF aus, ggf. zusätzlich 100nF für sehr kleine Schwankungen
	- https://arduino.stackexchange.com/a/76692
	- ggf. auch hinter MOSFET, um Ripple zur Schaltvorgang auszugleichen (hier eher 100nF, damit nicht zu viel geglättet wird)
	- Zumindest auf Platine vorsehen, könnten dann auch nur optional bestückt werden
- SD-Karte: Spannungsversorgung über GPIO schaltbar machen
	- Karte kann crashen und nur durch Power-Cycle rebootet werden