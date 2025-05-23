---
{"dg-publish":true,"permalink":"/code/rest-vs-websockets/","tags":["knowledge-base","german"],"created":"2024-04-04T17:15:39.935+02:00","updated":"2025-05-23T15:08:20.317+02:00"}
---

[Don't Use Websockets (Until You Try This…) (youtube.com)](https://www.youtube.com/watch?v=6QnTNKOJk5A)
[REST API (HTTP) vs Websockets - Concept Overview With Example (youtube.com)](https://www.youtube.com/watch?v=fG4dkrlaZAA)
[Webhooks vs Websockets vs HTTP Streaming - Which Event-Driven API to use? (youtube.com)](https://www.youtube.com/watch?v=6RvlKYgRFYQ)
## REST
- TCP
- stateless
- Client Request -> Server Response
- CRUD -> HTTP Method
	- Create -> POST
	- Read -> GET
	- Update -> PUT
	- Delete -> DELETE
- Sehr einfach zu implementieren, viel Doku und Beispiele
- Ideal geeignet für CRUD, einzelne (statische) Datenbankabfragen und Live-Updates mit langem Intervall (>1s) bei einem/wenigen Clients
- Weniger geeignet für Live-Apps mit kurzem Intervall (<1s) und vielen Clients - z.B. Chat oder Spiele (zu viel HTTP Overhead und Latency)
- Einfach zu skalieren (horizontal wie vertikal), da stateless
- Short Polling: Client Request -> Direkte Antwort vom Server (klassisches Modell)
- Long Polling: Client Request -> Verzögerte Antwort vom Server nachdem neue Daten eingetroffen sind (Verbindung wird solange aufrecht gehalten, Timeouts beachten!), nicht mehr stateless
## HTTP Streaming
- TCP
- Server Side Events (SSE) -> Ähnlich Long Polling, aber Request wird nach Push von Daten nicht geschlossen und für weitere Updates genutzt (nur bei Read/GET möglich) nicht mehr stateless
	- Header: Content-Type: text/event-stream, Cache-Control: no-cache
	- Body EVENT: id (fortlaufend), event: onProgress (und final dann "done", um den Stream zu schließen), data
	- In Go: Writer.Flush() ohne Writer.Close()
	- Frontend: new EventSource, EventSource.addEventListener
- Alternative: Transfer-encoding Header "Chunked" (üblich für Server-Server-Kommunikation)
## Websockets
- TCP
- Stateful (Informationen zu bestehenden Verbindungen müssen gemanaged werden)
- Client baut dauerhafte Verbindung auf, welche für Full-Duplex Kommunikation genutzt werden kann
- Stand 2024 von allen großen Browsern unterstützt
- Ideal geeignet für Live-Apps mit kurzem Intervall (<1s), geringer Latenz und vielen Clients
- Overkill für statische Apps und langes Update-Intervall
- Komplizierter zu implementieren
- Herausfordernd zu skalieren, da Sessions/Verbindungen über Server-Instanzen synchronisiert werden müssen
	- z.B. mit Redis
## Webhooks
- TCP
- Spezielle HTTP Endpoints an einem Server zum Abonieren von Updates
- Client muss ebenfalls öffentlichen HTTP Endpoint für Callbacks bereitstellen
- Client sendet Request zu Webhook API mit der Liste an Events, welcher er abonieren will und einem/mehreren Endpoints, wohin die API Callbacks ausführen soll
- Ideal geeignet für selten auftretende Events, welche asynchron verarbeitet werden können/sollen (REST hätte viel Overhead, Websockets wären overkill)