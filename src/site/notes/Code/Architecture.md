---
{"dg-publish":true,"permalink":"/code/architecture/","tags":["experience","opinion","german","knowledge-base"],"created":"2024-12-20T19:13:29.618+01:00","updated":"2025-05-24T12:38:24.441+02:00"}
---

## Golden Rules
- Fight abstractions
- Understand the domain
- Follow Standards
- Know your Tech
- Refactor with caution
Quelle: https://youtu.be/NiljDyzAOcI?feature=shared&t=773

Eigener Ansatz:
1. Prototyp bauen (max. 1-3 Monate) mit Fokus auf bekannte Anforderungen und Funktionen (nicht zu weit in die Zukunft schauen, zu viele Dinge annehmen. Abstraktionen minimal halten!)
2. Währenddessen: Requirements und Annahmen prüfen und anpassen
3. Prototyp wegwerfen
4. Software komplett neu schreiben (mit Learnings aus Prototyp)
5. Alle 2-3 Jahre (sofern aktiv an Software gearbeitet wird und sich Anforderungen ändern/hinzukommen): Technisches Brainstorming mit Senior Ingenieuren "Greenfield Ansatz: Wie würden wir die Software nach heutigem Stand bauen" -> Mit Realität abgleichen und ggf. Refactoring einleiten
## Separation of Concerns VS Locality of Behavior
- SoC: Trennung von Styling/Modell und Logik/Controller
- LoB: alle Teile von einem Element/Feature an einem Platz
- pro SoC: kein Mix von Arbeit aus unterschiedlichen Domänen (zb Backend und Frontend)
- pro LoB: alle Infos an einem Platz, einfacher in Gänze zu verstehen und zu debuggen
- ich bin pro LoB in vielen Fällen 
- ich hasse code (meist oop im Endstadium) der eigentlich nichts macht, aber auf 100 dateien verteilt ist (Beispiel th-drivers-sdk, [Clean-Code](https://qntm.org/clean), [Video](https://www.youtube.com/watch?v=IqHaGd9J42s))
- https://youtu.be/LriHRa9t1fQ?feature=shared&t=2803
- https://htmx.org/essays/locality-of-behaviour/
## Globaler State / Nebeneffekte
- Funktionen mit Nebeneffekten sind oft eine Quelle von Bugs und Komplexität
	- state changes werden dadurch verdeckt und lassen sich schlecht nachvollziehen (wann wird welche variable verändert? Welche Funktionen lesen nur, welche schreiben?)
	- Zustand der Applikation zu einem bestimmten Zeitpunkt wird unklarer (man muss sich mehr darum kümmern, dass ein sauberer init und cleanup des shared state passiert)
- State eines Programms zu verstehen, ist essentiell um das Programm an sich zu verstehen -> Zentraler Punkt in Architektur
	- Veränderungen des States müssen sichtbar und vorhersehbar sein
	- State in einem struct bündeln hilft
	- Globaler State und Nebeneffekte sind problematisch
- Küchen Analogie: mehl bleibt an messbecher hängen und fällt einem entgegen wenn man Messbecher aus dem Schrank nimmt. Abhängigkeiten müssen immer im kopf behalten werden. Erzeugen Overhead oder probleme wenn man sie nicht bedenkt. Besser: Mehl und Messbecher können unabhängig voneinander entnommen werden.
## Duplikation von Funktionalität
- Duplikation von Funktionalität (bspw. In backend und Frontend) ist quelle für bugs
	- alle solche Quellen müssen synhron gehalten werden
	- bei einer Änderung des Datenformats müssen alle quellen verändert werden 
	- kein single source of truth
## KISS / Abstraktionen
> All Problems in computer science can be solved by another level of indirection, except for the problem of too many layers of indirection.
> - David Wheeler

https://nitter.net/transmutrix/status/1750563200708309466#m
- Nicht mit Abstraktionen starten
- Wenn man nicht die einfachste single-file-procedural Lösung schreiben kann, wird man auch an der abstrahierten, generischen Lösung scheitern.
- Mit der konkreten Lösung des Problems anfangen und von dort aus weiter arbeiten.
- Die Ideen, welche Systeme man überhaupt braucht und welche Probleme man lösen will, kommen erst mit der Zeit, die man sich praktisch damit beschäftigt und Sachen umsetzt (nicht alleine mit dem theoretischen Gedanken darüber). Also einfach loslegen!
- "Some people are paralyzed by fear of being "wrong"—which is poison if you want to do anything creative which requires iterative refinement"
- "Abstraction has value after you have a strong hold on what you need and want to do, not before. Students would often fall into this trap, trying to solve "I don't know how to make noodles" by attempting to build a noodle factory. It doesn't work that way"
- "Understanding why you might want some abstraction is required to reap its benefits"
- "Structure comes from doing the concrete, then noticing patterns and generalizing. Only w/ exp can you jump right to abstractions"
- MVP!
- Code, den man wie eine Zeitung lesen kann, ist viel einfacher zu verstehen, als Code der über mehrere Dateien wild umher springt
- nur so viele abstraktionslayer wie notwenig, so wenig wie möglich 
	- jeder layer ermöglicht ggf eine effizientere arbeit
	- gleichzeitig ist jeder layer Quelle für bugs
	- jeder layer verschlechtert Performance 
	- closed source layer (oder generell code den man nicht kennt) muss blind vertraut werden. Bugs in diesem layer zu debuggen wird nahezu unmöglich und extrem viel zeit in Anspruch nehmen. Die Quelle eines neuen Bugs ist immer unklar! Sie könnte in einem dieser layer sein!
- "Expect the unexpected" -> Abstraktionen eigenen sich nur begrenzt dafür, den Code agil zu halten. Per Definition wird man immer mal wieder falsch liegen und hat dann die falsche Abstraktion gebaut, da die gewünschte Änderung unerwartet war. Dann ist "einfacher", linearer Code schneller geändert, als eine Abstraktionsebene umgeschrieben.
	- Lieber mit den Domäne-Experten reden und das Problem richtig verstehen. Dann PoC bauen, Feedback einholen.
	- https://youtu.be/NiljDyzAOcI?feature=shared&t=766
https://grugbrain.dev/
- "grug know cut point when grug see cut point, just take time to build skill in seeing, patience"
- Splitten von Code in mehrere Strukturen produziert in den meisten Fällen (Ausnahme: SOA vs AOS) keinen besseren Code für den Computer. Es ist eine Methode, um Bugs wie "Zugriff auf die falschen Daten" zur Compile-Time abzufangen. Wenn man nicht um diese Bugs besorgt ist und man im Anwendungscode diszipliniert ist diese zu verhindern, sollte man keine Abstraktionen einbauen. Jede Abstraktion, jedes Splitten erzeugt zusätzlichen Overhead, da die Schnittstellen synchron gehalten werden müssen, man zum Verständnis des Codes zwischen mehr Stellen springen muss, etc. 
	- Man sollte einen guten Grund für jede Abstraktion/Separation von Code oder Daten haben (z.B. um mentalen Overhead reduzieren, wenn gut gekapselte Systeme wie Datenbank, Webserver-Requests, etc. abgespalten werden - oder um typische Bugs zu verhindern). Immer hinterfragen: Warum brauche ich die Abstraktion? Am besten sollte dieser Grund dann auch dokumentiert werden. 
	- Man kann nur selbst bewerten, ob sich der zeitliche Aufwand für eine Abstraktion durch Einsparungen an anderer Stelle auszahlt.
	- https://youtu.be/drCnFueS4og?feature=shared&t=3012 (bis ca. 1:00:00)
- Immer mit möglichst wenig Abstraktion und Separation starten und Grenzen später einziehen. Es ist immer einfacher eine Abstraktion aufzubauen, als eine bereits genutzte wieder abzubauen. Dies betrifft insbesondere unerforschte Bereiche des Problems. Annahmen müssen erst validiert und Entscheidungen gff. revidiert werden. Daher nicht zu viel am Anfang starr designen (außer man weiß, was man tut und hat es schon 100x gemacht).
	- PoC Phase zum Lernen des Problems und dann rückwärts überlegen, welche Struktur angemessen ist, ist besser als anders herum.
	- PoC muss so einfach und schnell wie möglich iteriert werden können.
	- zu viel Struktur am Anfang schränkt Lösungsraum unnötig ein
	- Go saying: dont opt into an interface, refactor to an interface 
- Küchen Analogie: gestapelte Töpfe. Man muss immer alle Töpfe entnehmen, um an den untersten zu kommen. Zusätzlicher Aufwand für Kapselung.

## DRY vs inline code
- Don't DRY: Zu kurze Funktionen, die nur andere Funktionen aufrufen, die nur wieder eine andere Funktion aufrufen sind so schwierig nachzuvollziehen, weil man Kontext im Kopf aufbauen muss und viel hin- und herspringt. Eine größere Funktion, die die gesamte Arbeit erledigt, ist auf einen Blick zu erfassen oder lässt sich zumindest wie eine Zeitung von oben nach unten lesen.
- Martin Fowler: Refactor wenn man sich 3x wiederholt
- Small Focused Functions that don't do anything meaningful -> man muss zu viel im Code springen, um zu verstehen, was er macht. Context fehlt.
- Every function should do something **meaningful**
- Idee: Code sollte im Stile einer StackOverflow Antwort geschrieben sein. Macht etwas sinnvolles und beinhaltet allen notwendigen Kontext. (https://youtu.be/NiljDyzAOcI?feature=shared&t=1150)
https://sandimetz.com/blog/2016/1/20/the-wrong-abstraction
1. Abstraktion wird eingeführt, um gleiche Funktion perfekt zu bündeln 
2. Neue Anforderung passt nur zu 90% in dieses Konzept 
3. Falsch: Anpassen der Abstraktion (mit zusätzlichen Parametern, if/else, etc.). -> wird noch mehrere Male wiederholt und führt zu versteckter Komplexität und unklarem Code mit Überraschungen 
4. Besser: Abstraktion rückgängig machen (code inline kopieren), notwendige Änderungen für neue Funktion durchführen, anschließend schauen, ob neue Abstraktion abgeleitet werden kann. -> sauber und nachhaltig

[John Carmack on Inlined Code](https://web.archive.org/web/20241125111520/https://number-none.com/blow/blog/programming/2014/09/26/carmack-on-inlined-code.html):
> If a function is only called from a single place, consider inlining it.
> 
> If a function is called from multiple places, see if it is possible to arrange for the work to be done in a single place, perhaps with flags, and inline that.
> 
> If there are multiple versions of a function, consider making a single function with more, possibly defaulted, parameters.
> 
> If the work is close to purely functional, with few references to global state, try to make it completely functional.
> 
> Try to use const on both parameters and functions when the function really must be used in multiple places.
> 
> Minimize control flow complexity and “area under ifs”, favoring consistent execution paths and times over “optimally” avoiding unnecessary work.

## API Design
Immer den Anwendungscode zuerst schreiben oder zumindest ein Mock-Up davon. Dies offenbart die notwendigen API Funktionen, ihre Parameter, Call-Order, etc.
Erst anschließend die Implementierung dieser Funktionen schreiben.
-> Empfehlung von Casey Muratori
https://caseymuratori.com/blog_0024

Keine globalen Variablen in Library (mutable global state) -> nicht thread-safe und re-entrant.
Besser: Kontext struct anlegen, welcher der API mitgegeben wird und von ihr mit dem aktuellen Zustand beschrieben wird.
Bei Callbacks: Thread Local Storage benutzen
[Global State: a Tale of Two Bad C APIs (nullprogram.com)](https://nullprogram.com/blog/2014/10/12/)
siehe auch (als ein Ansatz in C): [[Code/Langauges/C#Opaque struct\|C#Opaque struct]]

Konstanten immer public definieren (entweder als enum oder define). -> Keine magic values im user-code. Macht Code deutlich lesbarer und durchsuchbarer (Konstanten findet man einfach, eine "1" ist nicht eindeutig identifizierbar). Kann einfach geändert und erweitert werden ohne, dass user-code vorm nächsten Kompilieren geändert werden muss.
https://caseymuratori.com/blog_0025

(CLI) Tools sollten mit Input aus Datei oder stdin gleich funktionieren. So kann man sie einfacher in eine Pipeline integrieren. Auch das Testen wird einfacher.
https://youtu.be/isI1c0eGSZ0?feature=shared&t=300

malloc()-Calls in Library vermeiden. Besser: Memory-Allokation vom Benutzer erledigen lassen. Dann kann der Anwender auswählen, ob er auf dem Stack oder Heap allokieren will oder sogar einen eigenen Allocator benutzen.
```C
prepped_alloc PrepThingeeForAlloc(parameters)
{
    prepped_alloc Prep = BeginAllocPrep();
    //... bunch of macro calls here that describe all the allocations
    //... and their internal pointers to itself
    EndAllocPrep(Prep);
}

size_t GetSizeForThingee(parameters)
{
    prepped_alloc Prep = PrepThingeeForAlloc(parameters);
    size_t Result = GetSize(Prep);
    return(Result);
}

thingee *CreateThingee(void *Memory, parameters)
{
    prepped_alloc Prep = PrepThingeeForAlloc(parameters);
    thingee *Result = (thingee *)PlaceAlloc(Prep, Memory);
    return(Result);
}
```
https://hero.handmade.network/forums/code-discussion/t/763-stack_persistence_vs._api_simplicity#4335
https://stackoverflow.com/questions/59547761/should-functions-that-create-structs-return-the-struct-or-a-pointer
Kleine Strukturen können auch direkt auf dem Stack erzeugt werden und als struct (nicht als Pointer) zurückgegeben werden.
siehe auch: [[Code/Stack vs. Heap\|Stack vs. Heap]]
## Premature Optimization
> The full version of the quote is "We should forget about small efficiencies, say about 97% of the time: premature optimization is the root of all evil." and I agree with this. Its usually not worth spending a lot of time micro-optimizing code \[i.e. counting cycles] before its obvious where the performance bottlenecks are. But, conversely, when designing software at a system level, performance issues should always be considered from the beginning. A good software developer will do this automatically, having developed a feel for where performance issues will cause problems. An inexperienced developer will not bother, misguidedly believing that a bit of fine tuning at a later stage will fix any problems.
> -- Charles Cook

> Observation #6: Software engineers have been led to believe that their time is more valuable than CPU time; therefore, wasting CPU cycles in order to reduce development time is always a win. They've forgotten, however, that the application users' time is more valuable than their time.

Quelle: [The Fallacy of Premature Optimization (acm.org)](https://ubiquity.acm.org/article.cfm?id=1513451)

Performance lässt sich nicht magisch am Ende der Entwicklung herbeiführen. Insbesondere bei komplexen Systemen sind die Bottlenecks über das System verteilt, voneinander abhängig und bedingen Änderungen an der Architektur, welche am Ende sehr kostspielig und aufwendig sind.
Cmuratori zu diesem Thema: https://youtu.be/drCnFueS4og?feature=shared&t=5359
## Parallelisierung
Mutex / Semaphore vermeiden! Insbesondere bei steigender Komplexität (und vielen Locks) kann nicht mehr gut abgeschätzt werden, wie häufig Threads in Mutex-locks laufen und wie viel wirklich parallel gearbeitet wird.
Besser: API Design, welche unabhängig von Parallelität ist. Beispiel: Schreiben einer Datei in parallelen chunks: Anstatt fertige Chunks in Array zu pushen oder in Datei zu schreiben (POSIX write(), Reihenfolge abhängig von Parallelität) -> Thread mit offset Parameter starten und fertige Chunks mit Offset in bereits allokierten Speicher oder Datei schreiben (POSIX pwrite(), Reihenfolge unabhängig von Zeitpunkt der Fertigstellung)

Quelle: [OpenMP and pwrite() (nullprogram.com)](https://nullprogram.com/blog/2017/03/01/)
## Protobufs: Daten zwischen Services mit Typeninformationen teilen
-> Protobufs [Protocol Buffers Documentation (protobuf.dev)](https://protobuf.dev/)
## Binärdaten
Step 1: Platz für Versionsfeld reservieren
Dies gilt für alle Binärdaten, eigene Datenformate oder Protokolle (Learning von: Savegame in diversen Spielen, Goodnightlamp Update Protokoll)
## Funktionen
- wenn user input verwertet wird: so permissive wie möglich/notwendig. Zudem alles auf Plausibilität prüfen 
	- ist integer im erlaubten bereich?
	- ist integer überhaupt ein integer (wenn String konvertieren wird)
	- hat pfad ein trailing /
	- hat Dateiname eine typendung
	- etc.
- ansonsten: so annehmen wie übergeben (möglichst wenig error handling)
	- caller ist für Input verantwortlich, Funktion für Output 
## OOP vs Data-Oriented
- v-tables und dynamic memory allocation machen das Programm langsamer, weil Objekte im Speicher verteilt liegen und viele cache misses erzeugen: [Ryan Fleury auf X: „This illustrates why it has been helpful to me to eliminate v-tables and sum-types almost everywhere. It isn’t just about performance—it’s about strong predictive power over code, staying organized, non-pessimization, and architecture which is ready to optimize later if needed.“ / X](https://x.com/ryanjfleury/status/1672722010399703041)
- ![[attachments/memory-layout.mp4]]
- V-Tables sind "[indirected function pointers](https://en.wikipedia.org/wiki/Function_pointer)" und stellen eine harte Grenze für den Compiler dar. Switch statements können hingegen deutlich besser optimiert werden -> [[Code/Stack vs. Heap\|Stack vs. Heap]]

[cmuratori-discussion/cleancodeqa.md at main · unclebob/cmuratori-discussion](https://github.com/unclebob/cmuratori-discussion/blob/main/cleancodeqa.md)
[cmuratori-discussion/cleancodeqa-2.md at main · unclebob/cmuratori-discussion](https://github.com/unclebob/cmuratori-discussion/blob/main/cleancodeqa-2.md)
https://www.rfleury.com/p/programmers-are-users-bad-performance
OOP Ansatz:
```C
#include "raw_device.h"
class new_device : public raw_device {
public: 
	virtual file* open(char* name);
	virtual void close(file* f);
	virtual void read(file* f, size_t n, char* buf);
	virtual void write(file* f, size_t n, char* buf);
	virtual void seek(file* f, int n);
	virtual void get_name();
}
```
Data-oriented Ansatz (Typenimplementierung siehe 2. Link oben):
```C
void raw_device::Handler(raw_device_request *Packet, raw_device_result *Result)
{
	switch(Packet->Op)
	{
		case RIO_read:
		// etc.
		
		case RIO_write:
		// etc.
		
		case RIO_get_name:
		// etc.
		
		default:
		// write error Result
	}
}
```
Vorteile des "Data-oriented Ansatzes":
- Requests/Calls/Aufgaben können gepuffert werden (einfach Packet in einen Array packen und später abarbeiten). Dies erlaubt auch einfacheres Multi-threading -> Soll dies für den OOP-Ansatz implementiert werden, schreibt man meist den Data-oriented Code um den OOP-Code (implementiert letztendlich beide Lösungen)
- Rückwärts-Kompatibilität: Wenn eine neue Funktion eingeführt wird, können alte Treiber einfach weiter funktionieren. Sie ignorieren den Op-Code (default im switch), während neue Geräte diesen implementieren. -> beim OOP-Code muss die Parent-Class und damit alle Children angepasst werden
- Private Op-Codes, die nur von einzelnen Geräten implementiert werden sind trivial möglich.
- Keine V-Tables notwendig (schnellere Funktionsaufrufe, bessere Optimierbarkeit)
- Interne Struktur der structs und Funktionen kann sich komplett ändern. Solange die API gleich bleibt, ist user-code davon nicht betroffen. Noch besser (in C): wenn man pointer zu [[Code/Langauges/C#Opaque struct\|C#Opaque struct]] an Funktion übergibt könnte man dies später sogar soweit ändern, dass pointer eigentlich ein index in einen internen cache ist.
- Ziel: den Pfad der Implementierung klein halten (Anzahl an Funktionen / Interfaces), bis man zur eigentlichen Implementierung kommt. Insbesondere wenn Daten/Funktionsaufrufe durch mehrere Stellen gehen und weitergegeben werden.
```
OOP
f1 call ------ f1 handler ------ f1 code
f2      ------ f2         ------ f2
f3      ------ f3         ------ f3
Data oriented
f1 call \                       / f1 code
f2      ------ fx handler ------- f2 code
f3      /                       \ f3 code
-> the more handler/passthrough layers you have, the more code you have to write/maintin in the OOP case
```
DO NOT DO:
```C
#include "devids.h"
#include "console.h"
#include "paper_tape.h"
#include "..."
#include "..."
void read(file* f, char* buf, int n) {
	switch(f->id) {
		case CONSOLE: read_console(f, buf, n); break;
		case PAPER_TAPE_READER: read_paper_tape(f, buf n);
			break;
		case...
		case...
	}
}
```
## Good code / bad code
- bad code can't handle small changes in requirements
## Cost of Dependencies
https://nitter.tiekoetter.com/cmuratori/status/1426299131270615040#m

https://nitter.tiekoetter.com/Jonathan_Blow/status/1923414922484232404#m