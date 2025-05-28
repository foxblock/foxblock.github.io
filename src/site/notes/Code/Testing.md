---
{"dg-publish":true,"permalink":"/code/testing/","tags":["experience","opinion","german"],"created":"2024-08-16T15:14:54.945+02:00","updated":"2025-05-26T19:30:38.114+02:00"}
---

https://youtu.be/IqHaGd9J42s?feature=shared&t=1511
https://www.youtube.com/watch?v=isI1c0eGSZ0
https://youtu.be/kJWsFWY25GA?feature=shared
https://grugbrain.dev/
https://lightbrd.com/SebAaltonen/status/1924075241413705914#m
## Generell
- 100% Coverage ist Quatsch (trivialer Code muss nicht getestet werden und erzeugt nur Rattenschwanz an Mehraufwand). 100% sagt auch nichts darüber aus, ob wirklich alle Edge-Cases getroffen wurden (sondern nur, dass jede Zeile Code mindestens 1x von einem Test aufgerufen wird) - ist also kein Garant für Bug-freien Code.
- Tests sind Code und können auch Bugs enthalten (Wer testet die Tests?)
- Tests sollten so deklarativ wie möglich sein (doX; doY; doZ)
- Tests müssen ordentlich funktionieren. Wenn Tests zu viele false-positives liefern werden sie irgendwann ignoriert.
	- Ein fehlender Test ist besser als ein falscher Test!
- Test-Code muss von mindestens so erfahrenem Entwickler geschrieben werden, wie der zu testende Application Code
	- Es ist sehr schwierig alle Edge-Cases auf dem Schirm zu haben und zu testen. Aber hier liegt der wahre Wert von Tests.
	- Tests finden nur "bekannte" Bugs, die man vorher erwartet hat
- Generell gute Idee: Wenn man einen neuen Bug findet, einen Test für den Fix schreiben (welcher ohne Fix anschlägt), um Regressionen zu vermeiden. Insbesondere bei komplexen Bugs sehr zu empfehlen.
- Testcode sollten Bereiche testen, wo der Output relativ stabil ist. Wenn sich bei Änderung der Implementierung auch der Output ändert, müssen meist die Test-Cases angepasst werden und sind damit wertlos (bzw. erzeugen nur Mehraufwand). Den Scope des Tests (Unit vs. Integration vs. E2E vs. ...) richtig zu wählen, kann hier Arbeit ersparen (bspw. keine Unit Tests für eine Implementierung schreiben, welche sich täglich ändert, sondern lieber einen E2E Test wenn das Ergebnis immer gleich ist)
## Test Driven Development (TDD)
- Kann sinnvoll sein, muss aber zielgerichtet eingesetzt werden
- Kann dazu führen, dass man Code schreibt, welcher sich zu sehr auf die vorher definierten Tests fokussiert und nicht auf den eigentlichen "Job-to-be-done" (also z.B. eine API welche die Tests super abdeckt, aber in der Praxis schwer zu benutzen ist)
- Test im vorhinein zu schreiben ist sehr schwierig, da das System oder die Aufgabe meist nicht klar definiert ist. Kann dazu führen, dass man während der Entwicklung viel Arbeit doppelt macht. Oftmals ist es einfacher ein System zu testen, sobald es sich stabilisiert hat.
- TDD scores können als Gamification-Element zur Erhöhung der Motivation beitragen (man will seinen Test-Score erhöhen und quält sich deswegen durch ein langweiliges Problem)
## Unit Tests
*Testen von einzelnen Code "Units", also z.B. Funktionen, Datentypen, Modulen etc.*
- Keine Logik in Unit-Tests! (if..else) -> macht debugging deutlich schwieriger und man kann sich nicht darauf verlassen, dass alle Pfade richtig getestet wurden
- Bei einem Refactoring müssen auch die meisten Unit Tests umgeschrieben werden
	- Zu umfangreiche Tests vermeiden
	- Unit Tests für trivialen Code vermeiden
	- Ggf. besser: Integrations-Tests in CI/CD-Pipeline
	- Zu viele Tests erhöhen die Reibung bei einem notwendigen Rewrite und halten ggf. davon ab (man will keinen fertigen Code wegschmeißen)
- Empfohlen bei komplexen Code (wo man Code nicht auf Anhieb richtig hinbekommen hat)
- Bei Libraries empfohlen, sobald API einigermaßen fest ist
	- Tests können als eine Art Dokumentation einer API dienen, da man sieht wie Funktionen aufgerufen und welche Ergebnisse erwartet werden.
	- Casey empfiehlt (->[[Code/Architecture#API Design\|Architecture#API Design]]) den Anwendungscode zuerst zu schreiben. Dies kann auch in Form von Tests passieren, wenn diese nah an der realen Anwendung orientiert sind.
- Herausforderung: Testen von Verbindungen zu externen Quellen (Lesen/Schreiben von Dateien, Zugriff auf Datenbanken, HTTP, etc.)
	- Mocking: Simulation externer Abhängigkeiten (z.B. Datei oder Datenbank) durch eigene "Fake"-Implementation. (z.B. indem Zugriff in abstrakten "provider" gewrappt ist). Achtung: Hierbei werden ggf. nicht die Fehlerfälle getestet, welche bei echtem Zugriff entstehen können. Erfolg hängt von Qualität des Mocks ab und ist ggf. mit hohem Aufwand verbunden.
	- Besser: Split von Zugriff und Verarbeitung der Daten (zweite Funktion welche z.B. byte-Array als Input nimmt). Können separat getestet werden.
	- https://youtu.be/isI1c0eGSZ0?feature=shared&t=540
- Die Unit Tests sollten niemals die Programm Architektur bestimmen: Gefahr, dass Code geschrieben wird, der zwar sehr "testbar" ist, aber die eigentliche Aufgabe nur schlecht erfüllt (zu langsam ist, schlechte API, zu viele Abstraktionen, etc.). Wird durch TDD zusätzlich erhöht, wenn Tests zuerst geschrieben werden und der Code danach nur auf die Tests ausgerichtet ist.
- Tests müssen schnell sein! Iterationsgeschwindigkeit ist key und Tests dürfen dem nicht im Wege stehen
	- Zugriff auf externe Systeme (Datenbanken, Dateisystem, Web!) vermeiden und lieber "golden master" Testdaten im Code ablegen.
- Programmiersprachen mit striktem Typensystem haben gewisse Tests eingebaut (Test auf Kompatibilität der Datentypen, Test auf Verlust bei Konvertierung, Test auf Mutability, etc.). Wenn dies genutzt werden kann, ist dies immer besser als ein vergleichbarer Unit-Test (kein zusätzlicher Code, mit größerer Sicherheit Bug-frei, schneller/effizienter).
## Integration Tests
*Test des Zusammenspiels mehrerer Module (Klassen, Services, Funktionen, etc.)*
- Gute Möglichkeit Wechselwirkung und Kommunikation zwischen mehreren Bereichen des Codes zu testen (z.B. Zugriff auf Datenbank + Verarbeitung der Daten oder Authentifizierung + Login)
- Umfang und Aufwand liegt zwischen Unit- und E2E-Tests. Oftmals guter Mittelweg.
- Sollten erst geschrieben werden, wenn der Systemaufbau einigermaßen stabil ist. Ansonsten zu viel Arbeit zum Maintainen
## End-To-End Tests
*Testen des gesamten Produktes anhand der Systemgrenzen (z.B. von User-Input bis GUI oder Eintreffen eines Datenpakets, über die Verarbeitung bis zum Versand einer Alert-E-Mail)*
- Idealerweise in CI/CD-Pipeline integriert
- Testen das gesamte System mit seinen Abhängigkeiten in einer "realen" Umgebung
- Sehr aufwändig zu implementieren und zu maintainen (müssen auch aktiv maintained werden, sonst versagen sie irgendwann und liefern false-positives)
- Müssen reproduzierbar sein, ansonsten wird debugging unmöglich
- Sehr wertvoll, aber auch aufwendig, daher: Fokus auf die wichtigsten (am häufigsten genutzten) Funktionen
- Aufpassen, dass Tests nicht zu sehr den internen State beschreiben/festlegen und dadurch notwendige Änderungen blockieren
## Snapshot Tests
- Man nimmt einen Schnappschuss des Systems im "known good" Zustand auf ("golden Master") und vergleicht im Folgenden damit (bspw. Zustand des Programms nachdem gewisser Input geliefert wurde)
- Abweichungen vom Schnappschuss führen zum Fehlschlagen des Tests und Diff kann dann näher zur Ursachenforschung untersucht werden
- Eine Form von Integration oder End-To-End Tests
- Aufwendig aufzubauen, aber sehr hilfreich bei großen Änderungen
- Hilft ungewollte Veränderung an global state zu erkennen
- Nur sinnvoll, wenn der Systemzustand konstant bleibt (also bspw. die Änderungen nur den Weg dahin beeinflussen, aber nicht den Zustand an sich)
## Test-Framework für C
- assert, assertf
- [µnit — C Unit Testing Framework](https://nemequ.github.io/munit/#miscellaneous)
	- Vordefinierte assert Makros
	- Definition von Test-Suites mit Performance-Benchmark und Statistik Output