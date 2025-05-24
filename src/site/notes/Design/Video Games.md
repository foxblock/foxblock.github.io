---
{"dg-publish":true,"permalink":"/design/video-games/","tags":["knowledge-base","german"],"created":"2025-04-04T16:35:15.777+02:00","updated":"2025-05-24T12:51:03.530+02:00"}
---

## 10 Lessons as per Mark Brown
https://www.youtube.com/watch?v=Cm2_drGLGbc
1. If you want to understand why a game makes you feel a certain way, ask yourself: how do the mechanics contribute to the experience?
2. There is no definitive right or wrong mechanic. The only way to judge a mechanic, is to ask whether or not it can contribute to the experience you are trying to forge.
3. You have to decide who the game is for and tune your mechanics appropriately. (e.g. hard-code or casual, accessible or much to learn)
4. Options and bonus content can be used to make a game appealing to those who are more (or less) hardcore than the target audience. (bonus levels in Mario as an example)
5. Options, accessibility settings and easy modes don't have to pose a threat to your intended experience. (Assist mode in celeste as an example)
6. Designers should think of genres in the loosest possible terms. (Don't put yourself in a box, before designing something)
7. The best solution for a complex problem is whatever provides the most interesting experience to the player. (Iterate often, follow the fun)
8. A game idea is worthless until you have proven its value through a prototype.
9. Frequent playtesting should be used to make sure your design is effectively producing the results you desire. (use with caution, there is only once chance for a first impression)
10. Always figure out for yourself if a game design lesson is true for your and for the type of games you want to make. (Trends change, play a lot of games)
## What is fun?
https://www.youtube.com/watch?v=TbZ3HzvFEto&t=940s
- "The degree to which the games recognizes and responds to the player's choices and actions"
	- Behavioral science equivalent: What are the reinforcers? What is the reinforcement schedule?
- If you do something, the game has to react to it. If you shoot a wall, there have to be decals (and a sound effect). If the wall is ignoring the player, it inflicts a "narcissistic injury"
- The game has to acknowledge back to the player that he is making choices and that he is progressing. Otherwise it loses any impact.
- If the player stands still, the world can be quiet. But as you walk forward, something has to happen every 3-5 seconds (even if it is just a little thing like an interesting sign or a sound). https://youtu.be/TbZ3HzvFEto?feature=shared&t=670
https://youtu.be/nCxU-OBoISk?feature=shared&t=1057
- There needs to be a response to the action. The more meaningful the action, the bigger the response
- Exaggerate a bit. Use sounds / animation / screen shake / etc.
- The core actions of the game should feel really awesome. Create an unique experience that matches the action
- These responses keep the player engaged
## Combinatorics
- In many cases you want combinatoric explosion (e.g. n\*m instead of n+m), because it gives you a bigger solution space to work in
	- https://youtu.be/nCxU-OBoISk?feature=shared&t=831
- Example: Draw/handle hats separately from characters, so you can put any hat on any character. Draw background for cards separately from emblem, so they can be animated individually (and don't require a spritesheet)
- Make behaviors orthogonal to each other so they can be combined in interesting ways (see [[Code/Game Programming#Fat/Flat struct (behaviors)\|Game Programming#Fat/Flat struct (behaviors)]])
## Puzzle Games
- Was ist das Kernthema des Spiels? (Braid: Zeit, VVVVVV: Flipping)
	- Alle Puzzle sollten eine Eigenschaft dieses Themas behandeln (On-Topic) und nicht über Off-Topic Eigenschaften lösbar sein (z.B. Timing bei Jumps)
	- Alle interessanten Effekte und Eigenschaften des Themas sollten durchgespielt werden (siehe z.B. Braid). Wie verändert das Thema ein klassisches Spiel? Was passiert wenn man XYZ hinzufügt? Was passiert, wenn man es weglässt? Was passiert wenn man Parameter XYZ davon ändert? etc.
- Die offensichtliche aber falsche Lösung sollte eindeutig falsch sein (ein Sprung sollte deutlich zu kurz sein, wenn das entscheidende Element fehlt und nicht nur ein bisschen zu kurz) -> ansonsten denkt ein Spieler, dass es an seinen mangelnden Fähigkeiten liegt (Off-Topic Element))
	- Insbesondere gilt dies bei "analogen" Spielen/Mechaniken: Die richtige Lösung sollte sich deutlich von falschen abheben (hoher "margin of error" bei der richtigen Lösung)
	- Bei präzisen Elementen kann man kleine visuelle Hinweise an der richtigen Stelle platzieren (darf nicht zu auffällig sein)
	- Genauso sollte die finale Lösung einfach zu erzeugen sein, damit nach dem Aha-Moment des Spielers es nicht mehr an mechanischen Fähigkeiten scheitert (oder anderen Off-Topic Elementen)
- Die Grundelemente des Spiels sollten sehr simpel und verständlich sein. Ansonsten wird das Spiel zu komplex, wenn Elemente des Kernthemas dazu kommen
	- Jedes dieser Elemente ist ein Werkzeug für den Spieler. Er muss dieses gut verstehen und von den anderen Werkzeugen unterscheiden können, um die richtige Auswahl beim Lösen eines Puzzles zu treffen.
	- Dem Spieler Zeit geben die einzelnen Elemente einzeln und in Kombination zu lernen
	- Sich Gedanken a-priori über diese Elemente machen ist sehr wichtig: z.B. wie groß soll Charakter sein (beeinflusst wie viel auf den Bildschirm passt), wie schnell (beeinflusst wie viel mechanische Fähigkeiten der Spieler haben muss und wie schnell sich das Spiel anfühlt), wie hoch soll Jump sein (beeinflusst Vertikalität und wie groß Level sein kann), etc.
	- Konsistenz: Die Elemente sollten sich nicht groß verändern, sodass der Spieler keine Überraschung erlebt und sich immer auf die Kernfunktionen verlassen kann (sonst: Frustration, Unklarheit)
	- Idealerweise gibt es keine Elemente, die nur einmal in Spezialsituationen verwendet werden. Ansonsten wird der Spieler diese auch an anderer Stelle suchen
- Analoge Elemente sind schwieriger zu designen als diskrete
	- (s.o.) Bandbreite zwischen Lösungen ist kontinuierlich und ggf. klein
	- Spieler muss viel mit den Variablen probieren um "sweet spot" zu finden (im Gegensatz zu einer richtigen Kombination von diskreten Einstellungen)
	- Plattformer: Jump sollte vermutlich konstant sein (Länge wie Höhe). Ansonsten zu viele Variablen beim Gestalten von Puzzles (muss immer alle Variationen des Jumps testen) und zu viel Fokus auf mechanische Fähigkeiten des Spielers
- Antithese: Manchmal bietet es sich an, einzelne dieser Regeln zu brechen, um den Spieler auf etwas zu stoßen, andere Elemente hervorzuheben oder das Spiel aufzulockern (Braid: Hunt Levels - drehen sich nicht strikt um Zeit, haben komisches Hud und besondere Tür)
- Puzzles sollten auf ihre Essenz destilliert werden: Nicht mehr Elemente als nötig enthalten (On-Topic wie Off-Topic)
	- Idealerweise entwickelt man ein Gefühl dafür, was ein spezielles Puzzle "ausmacht" und wie es sich von anderen Puzzles abhebt. Man sollte versuchen alle Elemente zu entfernen, die dafür nicht zwingend notwendig sind
	- Hierbei ist die Balance des Schwierigkeitsgrad und wie viele implizite oder explizite Hinweise man gibt nicht immer einfach/offensichtlich -> Playtesting
	- Beispiel Braid Anniversary Edition: High Jump (ideal: nur 1 Monster mit Entanglement, schlechter: mit zusätzlicher Tür und Schlüssel oder Version, wo man mit der Nase auf Lösung gestoßen wird) -> "Can I find a more elegant way to build this puzzle?"
	- Viele Versionen eines Puzzles ausprobieren -> guter Level Editor hilfreich, alternativ im Kopf oder auf Papier
- Partielle Lösbarkeit
	- Um Frustration zu vermeiden und Erfolgsmomente auch bei schwierigen Puzzles zu erzeugen, kann man versuchen "partielle" Lösungen einzubauen. Dies sind Momente, wo der Spieler realisiert, dass er einen Teil des Problems richtig erfasst und gelöst hat und sich anschließend auf die weiteren Teile des Puzzles fokussieren kann.
	- Dies kann auch helfen, dass der Spieler auf dem richtigen Weg bleibt und nicht vorzeitig abbricht, um eine andere (falsche) Lösung zu suchen.
- Spieler sollten nicht per Zufall auf die richtige Lösung eines Puzzles stoßen (oftmals so in "Antimatter" - einfach rückwärts durch alles laufen löst gefühlt 10% der Puzzles). Nur wenn man über ein Problem nachdenkt und es bewusst löst, fühlt es sich gut an.
- Schwierigkeit sollte nicht von Größe oder Komplexität der Puzzles kommen. (siehe Notizen zu Destillat oben)
- Fokus auf die interessanten Elemente und Puzzles, kein "Filler" einbauen. Jedes Puzzle sollte eine (neue) Idee präsentieren oder weiter ausbauen.
- Magic Moment: "Dieses Puzzle ist unmöglich!" -> "Ah! Eureka!" Die Erkenntnis, wie man das "unmögliche" schaffen kann.
- Es ist ein Videospiel -> alles ist möglich. Der Spieler geht erstmal von den "üblichen" Regeln aus (sofern er diese kenn, je nachdem welches Vorwissen er hat - u.U. gar keins!). Das heißt aber jede Regel kann gebrochen werden und muss erklärt oder gezeigt werden. Nichts sollte als "gegeben" angenommen werden.
- Puzzles, wo Elemente eine "natürlich" Bedeutung haben, können interessant sein (z.B. weil man sie sowieso braucht, um einen bestimmten Ort zu erreichen, aber dann nochmal konkret im Kontext des Puzzles). Fühlt sich "natürlich" an, weil die Elemente nicht ausschließlich für das Puzzle existieren. (-> Braid "Elevator action", JBlow nennt es "artful excuses"). Vorsicht: Werden schnell zu "red herrings", wenn sie zu sehr vom eigentlichen Puzzle ablenken oder nur die Lösung verschleiern.
- Flow of ideas: Grundidee eines Puzzles mit weniger Elementen, dann nach und nach Elemente hinzufügen, die das Puzzle interessanter machen oder einen "Twist" erzeugen (nicht einfach nur Schwierigkeit oder Unübersichtlichkeit erhöhen)
- Puzzles sollten sich idealerweise nicht groß überlappen, um Redundanz zu vermeiden (jedes Puzzles behandelt eine eigene interessante Idee / Interaktion zwischen den Elementen des Spiels)
- Designentscheidungen sollten davon geleitet sein, welche Variante mehr interessante Interaktionen und Puzzle zulässt
- Intrinsische vs. extrinsische Motivation:
	- Spieler will selbst etwas erreichen
	- Spiel belohnt Spieler bei Erreichen von Meilenstein mit Grafik / Sound / Text, etc.
	- Es ist immer etwas extrinsische Motivation da (weil man z.B. Elemente nicht sofort zugänglich macht oder Spieler diese nicht versteht), aber man kann gestalten wie viel
	- Intrinsische Motivation kann z.B. durch Story-Bits oder ähnliche Rewards entstehen, die das Spiel nicht explizit trackt oder den Spieler darauf hinweist (das Spiel weiß nicht, dass der Spieler etwas erreicht hat und kann es nicht anpreisen -> er tut es nur des Ergebnisses wegen, aus freien Stücken)
	- Das Verknüpfen (im Kopf des Spielers) von Gameplay-Elementen und Story zur Interpretation eines größeren Ganzen (welche der Entwickler so geplant hat), kann auch intrinsische Motivation sein -> zweite Ebene. Spielt trackt es nicht und weißt nicht explizit darauf hin -> Kunst
## Jon Blow on Game Networking
https://nitter.space/Jonathan_Blow/status/1894511416088170716#m

Okay, so, like, here's a very *high level* overview of the issues involved in doing a networked game at a decent level of quality. 

The first thing one discovers when doing this kind of system is that, even though web dudes love TCP, it is very bad for games if that's all you use, because the second there is any packet loss or delay in a TCP stream, it holds up everything else in the stream after, then you get all this data and it's now useless because it's late (who cares where the other player was 2 seconds ago). So in general one needs to develop a protocol on top of UDP that transmits ephemeral-data-that-may-be-lost, and then either implement a reliable protocol on top of that one to transmit data-that-cannot-be-lost, or use TCP there. 

So now you have reliable messages and unreliable messages, and you decide what is short-term data that is okay if it gets lost (positions, orientations, whatever) and what is long-term data that cannot be lost (one-time changes of rare variables, changes of communication phase, etc). 

But now one of the most common bugs in these systems is partitioning the logic cleanly between these two types of communication in a very complicated system -- there can be race conditions (maybe some unreliable data you didn't expect beats the reliable message that tells the client to prepare to receive that unreliable data), you get all kinds of weird softlocks etc unless this is very carefully designed. 

Then you have the problem that these games are being worked on by programmers and designers who are not doing networking at all. They are defining fields on entities and world state, and there will be some system for attempting to automatically sync these over the network. But in order for this system not to be totally dismal performance-wise, it has to be very carefully programmed, and the problem is that the more magical the system tries to be, the more prone to the above desync bugs it will be (see many Unreal engine games). But at the same time, on a big enough project it is just a reality that you need this system to exist and work. So there tends to be a two-phase approach where fields are defined but treated conservatively (reliable send always, no compression) and then get optimized later, with very careful consideration about how to get this to perform well. 

Because network messages only come sometimes, but players are running at maybe 240Hz, there is a system on the client side that does prediction of what the current game state is, based on extrapolation from previously known states. This gets very complicated because the naive things (linear extrapolation based on previous velocity) look very bad in the face of packet loss etc. You need to attempt to emulate complex behavior by running some gameplay code similar to what the server is doing, but it's never exactly the same, and factoring the code so that it can be used in both contexts, while being understandable and maintainable, but also not painfully slow, can be a big challenge. 

No matter how good a job you do on the client-side prediction, it's always desynced from the server, so you need to have a system that smoothly reconciles between the extrapolated state, and the new information received from the server, without snapping stuff to the target value (this looks bad and is very disorienting) but also without interpolating too slowly (since this adds too much latency). This tends to be specific to the type of any particular value. 

On the server there also tends to be a latency compensation component to help players deal with lag: Incoming packets arrive that represent user commands, and rather than applying those commands to the *current* world state, in which case they will always be late, one often tries to pull up a representation of prior world state and see what the command was doing in that context (like if the command is "I am shooting from position X in direction K", you are almost always going to miss the target if the server naively applies the command 'late'). A famous example of handling this is Yahn Bernier's system for Counter-Strike that he presented at GDC a long time ago (though I don't exactly like the particular things his system does). 

The above system relies on having an accurate estimate of the latency from client to server and from server to client, which is a whole system itself. 

How do you represent the values inside the packets? You are sending a lot of information so you want to keep them small. If you have a typical floating-point value, for example, you don't want to send 32 bits. So you represent it in a different way. How? Do you linearly quantize as an integer? Nonlinearly quantize as an integer? Make some kind of smaller float format? How many bits do you need for this value, and is it enough? Do you need to dynamically vary how many bits are used to represent this value in different contexts, and have something in the protocol to indicate this? All of these have different trade-offs and a significant amount of math is brought to bear here to make the right decisions. 

What about vector quantities, 3D positions or directions? What about 4D stuff like quaternions for orientation representation, or homogeneous-coordinate transformation matrices? To make good decisions here requires fluid working knowledge of all the linear algebra involved in 3D rendering, plus then knowledge of vector quantization schemes or some equivalent. Just representing quaternions in a reasonable manner is a whole thing, and it depends on the nature of how the rotations look typically. 

You can put the data into the packet as full values, but one of the most general techniques used in data compression is to represent things as deltas from a known-previous-value rather than the full value. But deltas are only relevant straightforwardly for the reliable messages, because in unreliable messages the client may not have the previous value! (aka client and server may disagree on what that is). What do you do here? Do you negotiate a neighborhood for the value via reliable messages, that then gets used in the unreliable messages? How much bandwidth does this take, is it a win? 

You want to entropy-code the outgoing messages to make them smaller (basically applying generic stream compression on top of the data stream you have already been trying to make small), because you are sending a lot of world state, and this involves knowledge of general data compression, which is itself a huge topic (there are entire textbooks just on the *basics* of how to compress data), but it's tricky because good compression relies on context, and you only know that the receiver has context on the reliable (TCP-style) messages, not the unreliable (UDP-style) messages, so maybe those two things have different compression styles (the unreliable messages cannot use context outside the message for compression).

You have a bandwidth and CPU usage cap on the server, so you want to decide which updates to send each frame. You don't want to oversaturate someone (if you just sent data last frame you don't want to push out more), but you do want people to get a lot of data in brief periods if a lot is happening. 

In a 3D space some players/objects/etc are a lot further from you and others are closer, and you can't send all the data all the time, so there is some heuristic that provides more fidelity for things that need more fidelity. You might even have occlusion detection running on the server to decide that some players should get almost no information about some things (if it's a closed room-based world for example), but if an event is big enough you still need to know about it. 

Because CPU is limited on the server and there are a lot of clients you want to *quickly* determine whose world state is the most erroneous and prioritize sending to those people (which will change every frame), and if you are randomly-accessing a ton of memory this will be too slow, so this involves knowledge of cache-coherent data structures and general code optimization. 

If you are trying to serve a lot of clients you realize that this horrendous model of doing a system call per network message send or receipt (Unix or Windows-style) is really bad, so you end up wanting to code for hardware that doesn't work this way, so you use a network card that has an API that lets you talk to it via userspace without going through the kernel, and you talk to that via an asynchronous command-buffer API, and this in itself is a different paradigm than most programmers have ever dealt with, that has its own challenges. 

I have surely forgotten a lot of things here. It's a quick tweet. Each of the above paragraphs would be at least several chapters in the hypothesized book on the topic. And of course when you go do stuff in practice you run into a lot of practical problems not considered by theory ("hey all our designers are writing all this Blueprint code, how in the hell are we going to client-side-predict the results of this?")

Oh, here's one I forgot: Getting UDP messages through peoples' NAT is a whole thing that is very difficult and annoying and may not work at all no matter what you try. There are some other UDP-based protocols that do their best at this if anyone is interested in what it entails. 

Have EXTRA fun if you want two clients to be able to send UDP to *each other* in a modern environment...