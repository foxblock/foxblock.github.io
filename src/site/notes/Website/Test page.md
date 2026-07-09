---
{"dg-publish":true,"dg-path":"Test page.md","dg-permalink":"test","permalink":"/test/","title":"Template test page","hide":true,"dgShowFileTree":"false","dgShowToc":"false","created":"2026-07-09T11:24:01.307+02:00","updated":"2026-07-09T14:08:03.613+02:00","dg-note-properties":{"title":"Template test page"}}
---

[[Non-existant page\|Non-existant page]]
Expected: Should link to static 404 page

[[Website/Test page\|alternate Text]]
Expected: shows as "alternate text" and links to current page

[[Website/Test page#Heading\|#Heading]]
Expected: Links to heading below

[[Website/Test page#Heading\|Alternate text]]
Expected: Links to heading below, but showing alternate text

[[Code/Data Structures & Algorithms\|Data Structures & Algorithms]]
Expected: Correctly link to document with & in filename

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
