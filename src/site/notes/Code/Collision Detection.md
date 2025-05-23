---
{"dg-publish":true,"permalink":"/code/collision-detection/","tags":["knowledge-base","german"],"created":"2024-02-19T18:53:39.817+01:00","updated":"2025-05-23T15:06:13.098+02:00"}
---

Bestes Buch zum Thema: Real Time Collision Detection von Christer Ericson
## Broad-Phase vs. Narrow-Phase
- Ersteres für grobe Paarbildung von kollidierenden Objekten. Schnell, aber ungenau.
- Letzteres für genaue Berechnung der Kollision und notwendigen Daten zur Auflösung/Vermeidung der Kollision
- Zuerst wird Broad-Phase durchgeführt, um die Anzahl an Paaren zu reduzieren, dann Narrow-Phase auf die verbleibenden Paare
- Algorithmen
	- Broad-Phase
		- Sweep and Prune
	- Narrow Phase
		- AABB
		- Separating Axis Theorem
		- GJK
## Sweep and Prune
- Sortieren der Objekte auf einer (oder mehreren) Achsen
- Wenn eine Achse: Ermöglicht frühen Abbruch des n × m Loops zum Testen auf Kollision, da A < C wenn A < B und B < C
- Bei mehreren Achsen: Ermöglicht groben boolschen Test auf Kollision: https://www.youtube.com/watch?v=E-cQaDnapjo
- Es wird ausgenutzt, dass sich die Objekte pro Zeitstep kaum bewegen, daher behält man die sortierten Listen bei und nutzt bspw. Insertion Sort (sehr effizient bei bereits fast sortierten Listen), anstatt die Liste immer neu zu erstellen
- Meist wird (implizit) die AABB-Hülle eines komplexeren Körpers für das Sortieren genutzt
- Buch: Kapitel 7.5, S. 329
- https://leanrada.com/notes/sweep-and-prune/
- [Wikipedia](https://en.wikipedia.org/wiki/Sweep_and_prune) (nicht wirklich verständlich imo)
## Separating Axis Theorem (SAT)
- Guter Algorithmus für 2D
- Funktioniert mit Kreisen und konvexen Polygonen
	- konkave Polygone müssen in mehrere konvexe geteilt werden
- Liefert boolsches Ergebnis oder (mit etwas mehr Aufwand) Vektor und Schnitttiefe zurück
- Prüft, ob es auf einer Achse der Körper einen Spalt gibt
- [Separating Axis Theorem (SAT) - Let's Make a Physics Engine 05 - YouTube](https://www.youtube.com/watch?v=Zgf1DYrmSnk&list=PLSlpr6o9vURwq3oxVZSimY8iC-cdd3kIs&index=6)
## Gilbert–Johnson–Keerthi (GJK)
- Schneller als SAT
- Funktioniert im n-dimensionalen Raum mit konvexen Objekten jeder Art
- Liefert nur boolsches Ergebnis
- Lässt sich gut für unterschiedliche Typen von Körpern abstrahieren, da die Form nur einen Schritt des Algorithmus beeinflusst
- Prüft ob die Differenz der Körper den Nullpunkt einschließt
- https://caseymuratori.com/blog_0003