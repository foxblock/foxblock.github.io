---
{"dg-publish":true,"dg-path":"Tech/CPU.md","permalink":"/tech/cpu/","tags":["knowledge-base","german"],"created":"2025-03-14T14:31:36.653+01:00","updated":"2025-05-24T12:52:08.147+02:00"}
---

## Cache
- Register <-> L1-Cache <-> L2(L3/L4)-Cache <-> Main memory (RAM)<->HDD (Swap)
	- L1-Cache oftmals unterteilt in "data" und "instruction cache"
	- L1 oftmals pro Core
	- L1: Größe bei aktuellen Prozessoren <100kB (pro Kern)
		- 5700X: 32KB, 9950X3D: 80KB
	- L2-Cache wird unter Windows "unified cache" genannt
	- L2 oftmals pro Core, manchmal geteilt mit mehreren Cores oder gesamter CPU
	- L2: Größe bei aktuellen Prozessoren < 1MB (pro Kern)
		- 5700X: 512KB, 9950X3D: 1MB
	- L3/L4 cache meist für gesamte CPU, Größe < 100MB
		- 5700X: 32MB, 9950X3D: 128MB
- Cache Line: Die CPU lädt immer 64 Bytes auf einmal in den L1 Cache
	- ESP32: 32 Bytes
	- ARM Cortex M0..4: kein Cache
	- ARM Cortex M7+: 32 Bytes
- Cache Miss: Programm fordert Daten an, welche nicht im L1+L2-Cache sind und daher aus dem RAM geladen werden müssen
- Viele Operationen sind schneller, als das Laden aus dem RAM -> Performance wird von Nutzung des Caches dominiert
	- [Gallery of Processor Cache Effects (igoro.com)](https://igoro.com/archive/gallery-of-processor-cache-effects/)
	- [Zen 1 timings](https://www.7-cpu.com/cpu/Zen.html)
		- L1 Cache: 4-5 cycles (1ns)
		- L2 Cache: 17 cycles (4-5ns)
		- L3 Cache: ~40 cycles (10ns)
		- RAM: 40 cycles + 90ns (100ns)
		- 1 Cycle ~ 0.25ns (@4GHz)
- (L1) Cache Aufbau 
	- https://youtu.be/rLWeHpzAYhg?feature=shared&t=1855
	- Cache funktioniert grundsätzlich wie hash table, wobei als key ein Teil der Speicheradresse genutzt wird
	- Cache Line ist 64 Bytes
	- Pointer-Adresse sind 64bit, von denen meist 48bit für Speicheradresse genutzt werden 
	- Speicheradressen sind virtuell und müssen übersetzt werden. Virtuell, damit bspw swap funktioniert.
	- Übersetzung läuft über anderen cache den Translation Lookaside Buffer. Dieser Cache mappt bei x64 12bit große "pages" (4096 Bytes) zwischen physischem und virtuellem Speicher.
	- 6 LSB eines pointers sind offset in cache line
	- 12 LSB sind offset in page
	- wir wollen nicht auf Übersetzung der Adresse warten. Daher läuft beides parallel. Cache access ist sehr schnell (<5 cycles)
	- zur Adressierung in Cache muss also Teil des pointers genutzt werden, welcher von Übersetzung nicht verändert wird = 12 LSB. 
	- unteren 6 bits davon helfen nicht, da sie nur offset in cache line sind und nicht zur Unterscheidung von cache lines helfen können.
	- Bleiben 6 bits übrig, was maximal 64 sets im Cache ergibt
	- Daten im cache sind entweder mit virtueller oder physischer Adresse getaggt.
	- nach Zugriff und paralleler Übersetzung wird überprüft, ob daten zu gewünschter Adresse gehören, da viele Speicherbereiche dieselben 12 LSB haben könnten 
	- Somit sind alle Adressen mit einem ähnlichen Bit-Aufbau immer im selben Set zu finden.
- Typischer Aufbau: N-way Associative Cache
	- es werden N cache lines pro cache set gespeichert, gleichzeitig abgerufen und dann verglichen (mit getaggter Adresse), ob richtige Daten dabei sind
	- größere Anzahl cache lines pro set bedeutet, dass mehr unterschiedliche Speicherbereiche mit gleicher bit Struktur im Cache Platz finden und Kollisionen verringert werden 
	- Beispiel Zen 4: 8-way Set, 64 sets, je line 64 Bytes also 8\*64\*64 Bytes = 32KByte (Architektur Limit)
	- Zen 5: 12-way = 48KByte
	- Beispiel Apple M1/M2: 12-way Set, jedes Set hat also 12 Plätze je 128 Bytes (eine L2-Cache Line) = 1,5KB pro Set = ~10.900 Sets bei 16MB Cache
	- Apple M-chips haben größere pages (64K)
## Pointers
- mindestens top 8 bits bei Intel und ARM Prozessoren sind nicht Teil der Speicheradresse (da unrealistisch großer Speicher benötigt werden würde), sondern können für andere Zwecke wie GC-flags genutzt werden. Meist werden nur 48bit für Speicheradresse genutzt 
	- https://youtu.be/uZEBkOrfUzM?feature=shared&t=908
## Assembly
https://uops.info/table.html
- Liste von Assembly Instructions für verschiedene CPU-Typen und ihre Eigenschaften (entnommen aus den ISA-Dokumenten der CPUs)
- Latency = Anzahl Clock Cycles für Operation
- TP (Throughput) = Anzahl Clock Cycles Wartezeit zwischen 2 Operationen (Wert < 1 = Mehrere Operationen pro Clock Cycle, bspw. 0.5 = 2 OPs/Cycle)
- Ports = Verfügbare Ports für Micro-OPs, Stern = Mehrere Micro-OPs auf denselben Ports, Plus = Mehrere Micro-OPs auf unterschiedlichen Ports (Bsp.: 3*p015+1*p23 = 3 µOps auf Port 0, 1 oder 5 und 1 µOp auf Port 2 oder 3)
https://godbolt.org/
- Zeigt Assembly für eingegebenen Programmcode und für verschiedene Architekturen und Compiler an
- Kann auch ESP32 und Co.
- Vergleich zwischen zwei Assembly möglich
- Mouse-Over erklärt Assembly Instruktionen
## Modulus (%)
[Language Performance Comparisons Are Junk](https://www.youtube.com/watch?v=RrHGX1wwSYM)
- Moderne CPUs haben keine schnelle Instruktion für Modulus-Operation (und keine SIMD-Instruktion)
- Modulus wird in äquivalente Instruktionen umgewandelt (z.B. Berechnung über Floats), welche ggf. mit SIMD beschleunigt werden können
-> Modulus mit zur Compile-Zeit unbekanntem Divisor ist für CPU sehr aufwändig, da diese Operation nicht umgewandelt werden kann