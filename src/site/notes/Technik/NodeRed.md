---
{"dg-publish":true,"dg-path":"Tech/NodeRed.md","permalink":"/tech/node-red/","tags":["knowledge-base","german"],"created":"2025-05-26T18:08:10.481+02:00","updated":"2025-05-26T14:51:52.521+02:00"}
---

## Function node - Rückgabewert
```js
// Message passthorugh, normal return
return msg;
// Will stop flow at this point and not pass anything to next node
return null;
// Send array of messages to single output
arr = new Array(10);
return [arr];
return [[msg1, msg2, msg3]];
// Send msg1 to output 1, msg2 to output 2, msg3 to output 3
return [msg1, msg2, msg3];
// Send msg only to second output (of 4)
return [null, msg, null, null];
// Send 2 messages to first output, none to second, one to third
return [[msg1, msg2], null, msg3];
```
## Context
Daten lesen und speichern. Doku: [Writing Functions : Node-RED (nodered.org)](https://nodered.org/docs/user-guide/writing-functions#storing-data)
```JS
let data = context.get("key")
context.set("key", "value");
let data = flow.get("key");
flow.set("key", "value");
let data = global.get("key");
global.set("key", "value");
// get/set multiple (NodeRED 0.19+)
var values = flow.get(["count", "colour", "temperature"]);
// values[0] is the 'count' value
// values[1] is the 'colour' value
// values[2] is the 'temperature' value
flow.set(["count", "colour", "temperature"], [123, "red", "12.5"]);
```
- `context` - Node
	- Wird gelöscht/zurückgesetzt, wenn sich Node ändert (Titel, Inhalt, Verknüpfungen und Position im Flow sind egal)
	- Nur im ausführenden Node verfügbar (gleicher Key in anderem Node liefert andere Daten)
- `flow` - Flow
	- Wird zurückgesetzt, wenn sich Flow maßgeblich ändert (Nicht ganz klar wann das ist. Bewegungen sind egal, Löschen von Verknüpfungen und einzelnen Nodes auch)
	- Nur im ausführenden Flow verfügbar
- `global` - NodeRed Instanz
	- Wird vermutlich zurückgesetzt, wenn sich Instanz neu startet
	- Flow- und Node-übergreifend verfügbar (Keys überschreiben aber nicht Daten mit gleichem Key in `context` oder `flow`)
- Werte können beliebigen Typs sein
- Es ist auch möglich Werte asynchron zu lesen/schreiben (aber wer braucht das?)
- Seit 0.19 kann man auch den Speicherort explizit angeben (sofern mehrere eingerichtet sind)
## Node Status
Doku: [Node status : Node-RED (nodered.org)](https://nodered.org/docs/creating-nodes/status)
```javascript
node.status({fill:"red",shape:"ring",text:"disconnected"});
node.status({fill:"green",shape:"dot",text:"connected"});
node.status({text:"Just text status"});
node.status({});   // to clear the status
// The `shape` property can be: `ring` or `dot`.
// The `fill` property can be: `red`, `green`, `yellow`, `blue` or `grey`

// Example:
this.status({fill:"red",shape:"ring",text:"disconnected"});
this.status({fill:"green",shape:"dot",text:"connected"});
```
![Pasted image 20240621141018.png](/img/user/_attachments/Pasted%20image%2020240621141018.png)
## URL Parameter
TODO
`{{{field of msg object}}}`
## Nützliche Links
[Working with messages : Node-RED (nodered.org)](https://nodered.org/docs/user-guide/messages)