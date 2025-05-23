---
{"dg-publish":true,"permalink":"/code/langauges/css/","tags":["knowledge-base"],"created":"2024-03-12T16:42:12.683+01:00","updated":"2025-05-23T14:04:20.139+02:00"}
---

## Selectors
```CSS
/*** Element types ***/
a
img
body
/*** Attributes ***/
a[title] /* a element with title attribute */
h1[class~="logo"] /* h1 element whose class contains logo */
/*** Classes ***/
.myClass
li.myClass /* only applies to li elements */
.myClass.other /* only when both myClass and other present */
/*** IDs ***/
#test /* all elements with ID test */
[id=test] /* same thing */
/*** universal ***/
* /* all elements */
*.warning /* all elements with class warning */
/*** Pseudo-classes ***/
:hover /* mouse over */
:active /* user actives, i.e. clicks button/link */
:focus /* inout element with focus (e.g. active text-box) */
:focus-within /* element or descendants have focus */
:visited /* link/a element that has been visited */
:target /* element with id matching fragment of URL (i.e. http://www.example.com/index.html#section2 -> id="section2") */
:first-child, :last-child
:disabled, :read-only, :invalid, :checked
/* there are many more */
```
## Combinators
```CSS
li li /* li elements with ancestor li - i.e. 2nd+ nested li */
.center img /* img with any ancestor with class center */
.content > div.nice /* div with class nice and direct parent with class content */
img + p /* element p directly following img and same parent */
img ~ p /* any element p following an img with the same parent */
span, div /* apply same style to both span and div */
```
### Class nesting example
[JSFiddle - Code Playground](https://jsfiddle.net/k6wxec39/)
![Pasted image 20240311124103.png](/img/user/attachments/Pasted%20image%2020240311124103.png)
## em und rem
`em` is factor of font pixel-size in parent container
`rem` works the same, but always references the root element `<html>`. Default `font-size` is 16px.
```html
<html>
	This text is 16px big
	<div style="font-size:10px">
		This text is 10px big
		<div style="font-size:2em">
			This text is 20px big (2 * 10px)
			<div style="font-size:1.5em">
				This text is 30px big (1,5 * 2 * 10px)
			</div>
			<div style="font-size:1.5rem">
				This text is 24px big (1,5 * 16px)
			</div>
		</div>
	</div>
</html>
```
https://jsfiddle.net/d5rbwqza/