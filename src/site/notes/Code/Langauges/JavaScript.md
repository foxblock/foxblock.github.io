---
{"dg-publish":true,"permalink":"/code/langauges/java-script/","tags":["knowledge-base","german"],"created":"2026-01-20T17:12:38.754+01:00","updated":"2026-01-20T16:15:51.571+01:00"}
---

## Achtung
### NaN
```JS
NaN === NaN; // false
NaN == NaN; // false
Number.isNaN(NaN) // true
```
### var vs let, implicit var
```JS
// var declarations are hoisted to beginning of function
function varTest(bool) {
	if (bool) {
		var test = 4;
	} else {
		var test = 2;
	}
	return test; // 2 or 4
}
// Is the same as
function varTest(bool) {
	var test;
	if (bool) {
		test = 4;
	} else {
		test = 2;
	}
	return test; // 2 or 4
}
// Achtung! Das folgende erzeugt nach dem Aufruf eine variable "test" im globalen Kontext! (implicit var)
function varTest(bool) {
	test = 3;
}

// let declarations are block-level (hoisted, but not initialized in temporal dead-zone)
function letTest(bool) {
	var test = 1;
	if (bool) {
		test = 3; // ReferenceError
		let test = 4;
	} else {
		let test = 2;
	}
	return test; // returns 1
}
```
### const is not const
``` JS
const val = 3;
val = 4; // TypeError
const obj = { "foo": "bar" };
obj.foo = "baz"; // allowed
obj = { "test": 123 } // TypeError
```
### Automatic Semicolon Insertion
```JS
function ReturnsUndefined() {
	return
	{
		"foo": "bar"
	}
}
// returns undefined
// a semicolon is automatically inserted by the parser after "return", so the object is never passed to it

function ReturnsCorrectly() {
	return {
		"foo": "bar"
	}
}
```
### Array.sort()
Array.sort() sortiert alle Einträge zu String konvertiert! Daher im Folgenden "2" -> "33" -> "8"
```js
const numbers = [33, 2, 8];
numbers.sort();
console.log(numbers[1]); // 33 (numbers is [2,33,8])
```
Grund dafür ist, dass Arrays Einträge mit unterschiedlichen Typen beinhalten können: `["1", true, 3, {}]`. Alle Typen können aber in String konvertiert werden.
### Type bullshit
[GitHub - denysdovhan/wtfjs: 🤪 A list of funny and tricky JavaScript examples](https://github.com/denysdovhan/wtfjs?tab=readme-ov-file#-examples)
[Equality comparisons and sameness - JavaScript | MDN (mozilla.org)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness)
`==` Abstract Equality konvertiert die meisten Typen zu Number, wenn die Typen nicht gleich sind ([Quelle]([ECMAScript® 2020 Language Specification (ecma-international.org)](https://262.ecma-international.org/11.0/#sec-abstract-equality-comparison)))
`===` Strict Equality macht keine Typen-Konvertierung
```js
0 == false // true (false -> 0)
"" == false // true (Number("") -> 0, Number(false) -> 0)
"0" == false // true (same as above)
0 == '0' // true ('0' -> 0)

'0' == !{} // true (!{} is false -> both converted to 0)
[] == ![] // true ([] -> 0, ![] -> false -> 0)
!![] // true ([] is truthy, so !![] -> true)
[] == false // true (false -> 0, [] -> 0)
[] == 0 // true ([] -> 0)
[] == "" // true
[] == '0' // false
[0] == "" // false
[0] == '0' // true
[null] == "" // true
[null] == "0" // false
[null] == [] // false

false == '0o0' // true (0o is octal-prefix)
!!"false" == !!"true" // true (non-emoty string is truthy)
"b" + "a" + +"a" + "a" // 'baNaNa'

!!null == false // true (null is falsy, so !![] -> false)
null == false // false (false -> 0 != null)
null == undefined // true (explicit rule)

"[object Object]" == {foo:"bar"} // true (object -> "[object Object]")
```
Truthy:
- Object (empty or otherwise)
- Array (empty or otherwise)
- Non-empty string
- Numbers != 0
- etc.
Falsy:
- Empty string ("")
- null
- undefined
- 0
- NaN
- false

[Annotated ES5](https://es5.github.io/#x11.9.3)
- String comparison can be forced by: `"" + a == "" + b`.
- Numeric comparison can be forced by: `+a == +b`.
- Boolean comparison can be forced by: `!a == !b`.
### Array out-of-bounds
```js
let array = [1,2,3]
array[5] = 9;
console.log(array); // [1, 2, 3, undefined, undefined, 6]
console.log(array[5]); // undefined
let array2 = new Array(5);
array2[3] = 9;
console.log(array2); // [ 2 empty items, 9, 2 empty items ]
console.log(array2[2]); // undefined
```
Arrays werden dynamisch vergrößert. Lücken sind immer undefined.
### Strings
sind als [Ropes](https://en.wikipedia.org/wiki/Rope_(data_structure)) implementiert (TL;DR: Binärbaum anstatt Array)
### Operator precedence
- wie bei C/C++
- bitwise Operatoren werden nach fast allen anderen interpretiert (+,<=,%,<<,etc)
- bitwise: AND & -> XOR ^ -> OR |
## Default values
```js
function test(param) {
	// filters all falsy values (null, undefined, 0, false, etc.)
	// only works if default value is falsy or valid values are never falsy, otherwise it might overwrite falsy values of param
	param = param || 0; // ok, defaults to 0
	param = param || 1; // will overwrite with 1 if param is falsy (e.g. 0)
	// filters only undefined specifically (param was not passed)
	if (param === undefined) param = 0;
}
```
Speed wise both options seem to be about the same.
## for vs forEach
Array Alternativen:
- `for (let i = 0; i < array.length; ++i) { ... }`
- `for (const element of array) { ... }`
- `for (const {member1, member2} of array) { ... }`
- `array.forEach((element, index, array) => {...})`
- `array.reduce((accumulator, element, index, array) => { ... })`
- `array.map((element, index, array) => (...)})`
- `array.map(({member1, member2}) => (...))`
Die klassische, imperative for-Schleife ist deutlich schneller, als forEach, map.reduce, array.map, etc.
Bei kleinen Arrays (<1000 Elemente) macht dies in der Praxis keinen großen Unterschied.
for..of ist ähnlich schnell wie for.
Mikro-Optimierungen, wie z.B. das Cachen von "array.length" vor dem Loop bringen keine Verbesserung (macht der Compiler vermutlich eh).
[Performance of JavaScript .forEach, .map and .reduce vs for and for..of (leanylabs.com)](https://leanylabs.com/blog/js-forEach-map-reduce-vs-for-for_of/)
![Pasted image 20240301103722.png](/img/user/_attachments/Pasted%20image%2020240301103722.png)
![Pasted image 20240301103739.png](/img/user/_attachments/Pasted%20image%2020240301103739.png)
(Operationen pro Sekunde, mehr ist besser)

Eine pre-Allokation eines Ergebnis-Arrays ist deutlich schneller, als Elemente einzeln zu pushen (gilt in jeder Sprache)
```JS
// bad
for (const elem of source)
	result.push(elem.x + elem.y);
// good
const result = Array.new(source.length);
for (let i=0; i < source.length; ++i)
	result[i] = source[i].x + source[i].y
```
## String template literals
```js
var foo = 3.14;
console.log(`Pi is ${foo}. This inserts a line break:
	half of Pi is ${foo / 2}. This does not line break:\
	both retain the tab character at the start`);
```
More info: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
## Async Order
[3 Questions: You Don't Know JavaScript | Prime Reacts (youtube.com)](https://www.youtube.com/watch?v=flzlEmyxMs8)
```JS
// resolve is done immediately, then is added to microtask queue
Promise.resolve().then(() => console.log(1));
// added to microtask queue
queueMicrotask(() => console.log(2));
// added to Web API, on next tick added to macrotask queue
// macrotask queue is executed when microtask queue is empty (so adding microtasks in a loop can starve marcotask queue)
setTimeout(() => console.log(3), 0);
// just executed, this tick puts setTimeout onto macrotask queue
console.log(4);
// body of constructor is executed synchronously (only Promise.resolve is async)
new Promise(() => console.log(5));
// immediately invoked async function - body is run synchronously (only awaited value is async)
(async () => console.log(6))()

// Logs in order: 4 - 5 - 6 - 1 - 2 - 3
```
## Classes
```JS
class Person {
	constructor(name, money) {
		this.name = name;
		this.money = money;
	}
	transferFunds(otherPerson, amount) { }
	changeName(newName) { }
}
const andy = new Person("Andy", 100);
const paul = new Person("Paul", 42);
```
Funktionen sind nicht in Klasseninstanz gespeichert, sondern im gemeinsamen Prototyp.
```JS
class Person {
	constructor(name, money) {
		this.name = name;
		this.money = money;
		this.transferFunds = function(otherPerson, amount) { }
		this.changeName = function(newName) { }
	}
}
const andy = new Person("Andy", 100);
const paul = new Person("Paul", 42);
```
Jede Klasseninstanz besitzt eigene Instanzen der Funktionen -> nehmen mehr Speicher in Anspruch.
```JS
class Dog {
	constructor(name) {
		this.name = name;
		this.wagTail = () => {
			return "Wagging tail!"
		}
	}

	bark() {
		return "Woof!";
	}
}
const dog1 = new Dog("Max");
const dog2 = new Dog("Spot");

// return value is same string constant
dog1.wagTail() === dog2.wagTail() // true
// wagTail is defined in constructor = different for each instance
dog1.wagTail === dog2.wagTail // false
// bark is defined in common prototype
dog1.bark === dog2.bark // true
// Prototype of both is the same
Object.getPrototypeOf(dog1) === Object.getPrototypeOf(dog2) // true
// constructor is defined in common prototype
dog1.constructor === dog2.constructor // true
```
## Generators
```JS
function* genFunc() {
	yield 1;
	yield 2;
	yield 3;
	return 4;
};
const iterator = genFunc();
iterator.next(); // {value: 1, done:false}
iterator.next(); // {value: 2, done:false}
iterator.next(); // {value: 3, done:false}
iterator.next(); // {value: 4, done:true}

// Once all values are used up, iterator returns undefined
iterator.next(); // {value: undefined, done: true}
console.log([...iterator]); // []

// Only yielded values are returned here:
console.log([...genFunc()]); // [1, 2, 3]
for (const value of genFunc()) {
	console.log(value);
} // 1 2 3
```
Stern nach "function" Keyword erzeugt einen "Generator".
Gute Anwendung: Filesystem walkers
Achtung: In for..of Loops und spread operators wird der Wert nach dem "return" nicht ausgegeben! -> idealerweise am Ende "return null" machen (oder kein return = implicit "return undefined"), um zu signalisieren, dass man fertig ist.
## Bitshift

> [!warning]
> Shift Operatoren konvertieren den Input in 32-bit signed int.
```
<< >> Signed shift (converts all numbers to 32bit signed int)
>>> Unsigned right shift
```
More info: https://stackoverflow.com/a/6798829