---
{"dg-publish":true,"permalink":"/code/stack-vs-heap/","tags":["knowledge-base"],"created":"2024-04-09T16:21:09.321+02:00","updated":"2025-05-24T12:52:56.435+02:00"}
---

## Fazit
Pass by Value ist bei kleinen Objekten zu bevorzugen. Es kann besser optimiert werden, da es für den Compiler transparent ist.

Bei größeren Objekten ist ein gewisser overhead zur Vorbereitung des Funktionsaufrufs verbunden. Allerdings kann der Compiler mathematische Operation ggf. vorberechnen und loops unrollen. Dies gilt solange das Objekt auf dem Stack liegt, falls nicht muss es dorthin kopiert werden, das ist dann deutlich aufwendiger!
Es müssen also die Kosten für copy auf den stack vs. Pointer indirection (und damit einhergehende Intransparenz) abgewogen werden.
https://godbolt.org/z/7jPYhn9TP

CPUs laden Daten in Chunks (Cache line). Bei modernen Desktop-CPUs ist diese 64 Byte groß - bei vielen embedded Systemen (ESP32, ARM Cortex >M4) 32 Bytes. Maximalgröße für Pass-by-value sollte kleiner als eine Cache Line sein. Wenn das Object kleiner als 1-2 Words (also 8-16 Byte bei 64-bit Systemen) ist, kann es sogar direkt in einen/mehreren Registern geladen werden (und muss auch kein pointer offset berechnet werden).
[Gallery of Processor Cache Effects (igoro.com)](https://igoro.com/archive/gallery-of-processor-cache-effects/)
siehe auch: [[Technik/CPU#Cache\|CPU#Cache]]

Auf 8bit/16bit-Systemen mit wenigen Registern immer pass-by-reference!
https://stackoverflow.com/a/30987540
## Grundlagen
- stack wird pro thread bei start des Programms allokiert. Größe wird von Compiler oder OS bestimmt.
	- Für C siehe: [[Code/Langauges/C#Stack space\|C#Stack space]]
- Funktionsaufrufe, return Adresse und lokale variablen liegen im stack. Größe für lokale variablen wird beim Kompilieren bestimmt.
- globale und static variablen liegen im "code" (const) oder "data" segment (in C/C++)
- Allokationen von Pointern reservieren platz auf dem heap
- Allokationen auf dem stack verschieben nur stack pointer (schnell)
- Allokationen auf dem heap sind deutlich aufwendiger (virtual alloc)
- Anonyme Funktionen (in C# oder Java) haben Zugriff auf variablen aus dem aufrufenden Kontext. Diese müssen temporär auf dem heap gespeichert werden! 
- Speicheradresse von Variablen auf dem Stack: 0x7f.... (x86_64)
https://endjin.com/blog/2022/07/understanding-the-stack-and-heap-in-csharp-dotnet?utm_source=csharpdigest&utm_medium&utm_campaign=1386
## Beispiel 
Ohne compiler Optimierung:
```C
Point p = {.x=5,.y=3};
int len = length(p);
```
- stack pointer wird verringert
- werte werden in den stack geschrieben 
- Adresse von struct wird in register geschrieben 
- Funktion wird aufgerufen 
	- lädt werte aus stack in register
	- multipliziert register
- Ergebnis wird aus register in stack geschrieben 
```C
Point *p = malloc(sizeof(Point));
p->x = 5;
P->y = 3;
int len = length(p);
```
- stack pointer wird verringert 
- malloc wird aufgerufen 
- Adressen von membern werden einzeln in register geladen
- werte werden an Adresse in Registern geschrieben 
- Adresse von struct wird in Register geschrieben 
- Funktion wird aufgerufen 
	- lädt Adresse von membern in register
	- lädt wert an Adresse in anderen Register 
	- multipliziert werte 
- Ergebnis wird aus register in stack geschrieben 
https://godbolt.org/z/h9v8PhEce

Mit zusätzlicher globaler count variable, um zu verhindern, dass compiler alles statisch berechnet und weg optimiert:
Fall1 mit übergebenem struct wird immer noch vom compiler weg optimiert und statisch berechnet, fall2 mit malloc und Referenz nicht!
Aber funktion mit Berechnung mit pointer wird zu Fall1 ohne pointer optimiert (aka laden der member Adressen in Register wird übersprungen). Funktion für Fall1 ohne pointer ist nun shift Operation (?).
-> optimierung von pointer fall laggt einen zyklus hinterher 
https://godbolt.org/z/Efdhaj65o
## Pass-by-reference
C hat kein pass-by-reference! Alles wird als value übergeben.
Pass-by-reference und pass-by-pointer in C++ produzieren denselben Assembler Code!
https://godbolt.org/z/zc3asWoWc

Weiteres Beispiel mit einem Parameter, welcher verändert werden soll (pointer) und einem zusätzlichen wert (einmal value, einmal pointer). Assembly ist sehr ähnlich, pass by pointer hat im Grunde nur einen mov und eine dereferenzierung mehr. Dies bleibt auch über unterschiedliche -Ox settings ähnlich. Bei -O wird immer nur der erste call zu addScaled weg optimiert.
https://godbolt.org/z/4PW31a66o

Praktische Betrachtung im Playdate collision code: Kein messbarer Unterschied zwischen pass-by-value und pass-by-reference für Vector2D Klasse. Auch bei 20 zusätzlichen floats nicht. Erst bei 200 sinkt die Performance von pass-by-value merklich (5-10%).
