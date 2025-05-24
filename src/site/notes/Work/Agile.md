---
{"dg-publish":true,"permalink":"/work/agile/","tags":["experience","opinion"],"created":"2024-01-18T20:16:28.049+01:00","updated":"2025-05-24T13:00:45.090+02:00"}
---

## Eigene Erfahrung
- **Alle** Scrum Meetings müssen von **allen** Teilnehmern gut vorbereitet sein, sonst werden sie nahezu wertlos
	- Dies bedeutet einen nicht unerheblichen Aufwand für diese Vorbereitung
	- Ziel sollte es also nicht sein, die Zeit für das Meeting auszulasten, sondern das Ziel des Meetings so schnell wie möglich zu erreichen 
	- Bei langen Meetings: Materialien vorher rumschicken 
- Es dürfen nur die vorgegebenen Features entwickelt werden!
	- Unnötige Features sind wie Lagerhaltung im Lean, sie erzeugen Probleme in jedem Schritt des weiteren Prozesses: mehr Aufwand für Testing, mehr Quellen für Bugs, mehr Aufwand für Dokumentation, ein komplexeres System mit mehr Abhängigkeiten
	- Unnötige Features können Stück für Stück das Projekt lahm legen
	- Beispiel: ralf bei ioelemets
- Regelmäßige Testzyklen (mit echten Usern!) sind wichtig zum Nachsteuern
	- dementsprechend müssen Features Bug frei sein. Ansonsten: kein review und technical debt für nächsten Sprint
	- Tests mit echten Usern sind nicht zu ersetzen. Oftmals trifft man falsche Annahmen, was User wollen/brauchen und nur so findet man das heraus.
- je unklarer die Anforderungen zu Beginn des Projektes, desto schwieriger wird die Entwicklung und desto wichtiger sind PoCs. Lieber einen schnellen Test wegwerfen, als Jahre auf die falsche Technologie setzen.
- generell wird die zweite Version eines Produktes oft besser: also schnell PoC bauen, wegwerfen und dann Gelerntes bei richtigem Produkt anwenden 
- niemals für die Probleme von morgen entwickeln, denn diese kennst du nicht (siehe unnötige Features oben)!
- Wichtige Säule von Scrum: Transparenz. Gilt für alle Bereiche eines Unternehmens 
- scrum funktioniert am besten mit sehr selbständigen Entwicklern, die fokussiert arbeiten und notwendige aufgaben eigenständig entdecken, sich aber an die Regeln (feature liste) halten. Je mehr micro Management notwendig ist, desto schlechter funktioniert scrum.

TODO: insert vorgehen walk the board

## Literatur
https://www.craiglarman.com/wiki/downloads/misc/history-of-iterative-larman-and-basili-ieee-computer.pdf
- agile/iterative Entwicklung (IID) gibt es schon seit den 70ern und länger 
- wasserfall war ursprünglich auch agile gedacht ("do the process twice")
- agile ist nur Wasserfall in wiederkehrenden, kleinen inkrementen
- jeder Schritt enthält auch wieder eine Design, Test und Dokumentation phase
- wichtig sind releaseable increments (bei Software)
- Timeboxen reichen von 6m bis 0,5d
- inspiration für scrum: japanischer IID Ansatz für Hardware bei Honda, Canon, Fujitsu: "shashimi" (slices)
> “Evolution” is a technique for producing the appearance of stability. A complex system will be most successful if it is implemented in small steps and if each step has a clear measure of successful achievement as well as a “retreat” possibility to a previous successful step upon failure. You have the opportunity of receiving some feedback from the real world before throwing in all resources intended for a system, and you can correct possible design errors…
> -- Tom Gilb

> Management does not require firm estimates of completion, time, and money for the entire project. Each (small iterative) step must meet one of the following criteria (priority order): either (a) give planned return on investment payback, or, if impossible, then (b) give breakeven (no loss); or, at least, (c) some positive user benefit measurably; or, at least (d) some user environment feedback and learning.
> -- Tom Gilb

> The danger in the sequence (waterfall approach) is that the project moves from being grand to being grandiose, and exceeds our human intellectual capabilities for management and control.
> -- Harlan Mills

## Probleme
Probleme mit Wasserfall nach David Parnas und Paul Clements:
- A system’s users seldom know exactly what they want and cannot articulate all they know.
- Even if we could state all requirements, there are many details that we can only discover once we are well into implementation.
- Even if we knew all these details, as humans, we can master only so much complexity.
- Even if we could master all this complexity, external forces lead to changes in requirements, some of which may invalidate earlier decisions

Probleme mit Scrum:
https://www.youtube.com/watch?v=Q25lwSfVwF8


