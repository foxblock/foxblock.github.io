---
{"dg-publish":true,"dg-path":"Tech/Obsidian.md","permalink":"/tech/obsidian/","tags":["knowledge-base"],"created":"2025-04-26T13:30:21.505+02:00","updated":"2025-05-24T12:55:18.426+02:00"}
---

## Callouts
> [!note] Note
> This is a note.

> [!tldr] tldr/summary/abstract
> Too long; didn't read.

> [!info] info
> Here's some information.

> [!todo] todo
> Things to be done.

> [!tip] tip/hint/important
> This is a tip

> [!success] success/check/done
> This thing is done

> [!question] question/help/faq
> Here's a question

> [!warning] warning/caution/attention
> This is a warning!

> [!fail] failure/fail/missing
> This failed!

> [!danger] danger/error
> Error! Error!

> [!bug] bug
> Bug reported!

> [!example] example
> This is only an example.

> [!quote] quote/cite
> This is a quote.
### Special Features
> [!note]- Foldable note
> The minus sign after the callout type makes this text hidden on first sight! Works with all other types, too!

> [!question] Can callouts be nested?
> > [!todo] Yes!, they can.
> > > [!example]  You can even use multiple layers of nesting.
> > > Woo!

> [!INFO] Code in callout
> ```C
> // Make sure every line begins with a > in markdown
> // otherwise the callout will break
> int main(int argc, char **argv) { }
> ```

### Markdown
```Markdown
> [!note] Note
> This is a note.

> [!tldr] tldr/summary/abstract
> Too long; didn't read.

> [!info] info
> Here's some information.

> [!todo] todo
> Things to be done.

> [!tip] tip/hint/important
> This is a tip

> [!success] success/check/done
> This thing is done

> [!question] question/help/faq
> Here's a question

> [!warning] warning/caution/attention
> This is a warning!

> [!fail] failure/fail/missing
> This failed!

> [!danger] danger/error
> Error! Error!

> [!bug] bug
> Bug reported!

> [!example] example
> This is only an example.

> [!quote] quote/cite
> This is a quote.

> [!note]- Foldable note
> Text only visibale after unfolding

> [!question] Can callouts be nested?
> > [!todo] Yes!, they can.
> > > [!example]  You can even use multiple layers of nesting.
> > > Woo!

> [!INFO] Code in callout
> ```C
> // Make sure every line begins with a > in markdown
> // otherwise the callout will break
> int main(int argc, char **argv) { }
> // Remove the backslash below (since Obsidian does not like nested codeblocks)
> \```
```

## Getting rid of unused properties
Once you used a property it will always show up in auto-complete. Very annoying if you misspelled it and corrected it later.
Open `[path to your vault]/.obsidian/types.json` and remove the unneeded properties. You can also just adjust property type there.
This is safe to do - editing a property still in use will not change or remove it from documents.
Unused properties are also removed from the list automatically after a while.
## Digital Garden Documentation
[Digital Garden - Publish Obsidian Notes For Free](https://dg-docs.ole.dev/)
[oleeskild/obsidian-digital-garden](https://github.com/oleeskild/Obsidian-Digital-Garden)
## CSS Styling
Obsidian playbook: https://notes.nicolevanderhoeven.com/obsidian-playbook/Obsidian+Playbook+Readme
Styling with CSS: [CSS snippets - Obsidian Help](https://help.obsidian.md/Extending+Obsidian/CSS+snippets)
Available variables and classes: [Build a theme - Developer Documentation (obsidian.md)](https://docs.obsidian.md/Themes/App+themes/Build+a+theme#Step%207%20Discover%20CSS%20variables%20in%20use)
List of supported codeblock languages (Prism is the library used by Obsidian): https://prismjs.com/#supported-languages
Obsidian is rendering using a web-browser, so you can always `Ctrl + Shift + I` in Obsidian to bring up the dev tools (including the inspector to check individual classes and styling options).
# Heading 1
Test
## Heading 2
Test
### Heading 3
Test
#### Heading 4
Test
##### Heading 5
Test
###### Heading 6
Test