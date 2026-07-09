---
{"dg-publish":true,"dg-path":"Test page.md","dg-permalink":"test","permalink":"/test/","title":"Template test page","hide":true,"dgShowFileTree":"false","dgShowToc":"false","created":"2026-07-09T11:24:01.307+02:00","updated":"2026-07-09T14:29:15.932+02:00","dg-note-properties":{"title":"Template test page"}}
---

[[Non-existant page\|Non-existant page]]
Expected: Should link to static 404 page

[[Website/Test page\|alternate Text]]
Expected: shows as "alternate text" and links to current page

[[Website/Test page#Heading\|#Heading]]
Expected: Links to heading below

[[Website/Test page#Heading\|Alternate text]]
Expected: Links to heading below, but showing alternate text

[[Website/Test page#A more complicated / heading (with symbols)\|#A more complicated / heading (with symbols)]]
Expected: Links to second heading below

[[Website/Test page#A more complicated / heading (with symbols)\|Alternate text]]
Expected: Links to second heading below, but showing alternate text

[[Code/Data Structures & Algorithms\|Data Structures & Algorithms]]
Expected: Correctly link to document with & in filename

[[Code/Langauges/Go#Public / Private (exported names)\|Go#Public / Private (exported names)]]
Expected: Link to heading in other document

[[Code/Data Structures & Algorithms#Multi-stage Tables\|Data Structures & Algorithms#Multi-stage Tables]]
Expected: Link to heading in other document

[Clean-Code](https://qntm.org/clean)
Expected: Working link to external page with custom text

Testing links in code blocks:
```
#include - this should not be converted to a clickable tag-link

[[Test page]] - this should also not be converted to a link
```

```C
#include - this should not be converted to a clickable tag-link

[[Test page]] - this should also not be converted to a link
```

`#inline-code`
Expected: Should not be converted to a clickable tag-link
## Heading

foo

### A more complicated / heading (with symbols)

foo