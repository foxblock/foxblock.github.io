# foxblock.github.io / janek.ing
This is my personal site generated from my Obsidian notes using the [Digital Garden Obsidian Plugin](https://github.com/oleeskild/Obsidian-Digital-Garden).

It is available on the web at [janek.ing](https://janek.ing)

## Details

The site uses a heavily modified version of the bolt theme.

Additional features:

- in-site comments using Github discuss plugin (see [here](https://github.com/foxblock/digitalgarden_gh-pages#comments) on how to set them up)
- customized main navbar with responsive menu version
- project showcase using in-note html/css
- better error output on site generation

It also contains certain fixes to the [official template](https://github.com/oleeskild/digitalgarden), which were either [rejected](https://github.com/oleeskild/digitalgarden/pull/321) or not [yet merged](https://github.com/oleeskild/digitalgarden/issues/315):

- edge-cases in link-generation
- improved responsive layout
- better alignment on certain items
- update most dependencies to newer versions, update to node 24
- Windows build fixes

## Local development and dependency updates

Use Node.js 24 and run `npm ci`, then `npm run dev` for a local preview.
Run `npm run build` for production output in `dist`, and `npm test` for
image, favicon, math, and path compatibility checks. Stop the development
server before a production build because both write to `dist`.

The `eleventy-plugin-gen-favicons` override uses `sharp` 0.35.4 or newer to
avoid the vulnerable libvips bundled by its declared `sharp` 0.33 dependency
([advisory](https://github.com/advisories/GHSA-f88m-g3jw-g9cj)). The regression
tests exercise favicon SVG, ICO, PNG, and manifest output with this override.
Keep it until the plugin declares a patched version itself.

After updating the upstream template, check and apply
`template-customizations.patch`, then run `npm install` to reconcile the
lockfile with its dependency changes. Verify `npm audit`, `npm test`, and
`npm run build` before committing the updated lockfile.

## Docs

Docs for the plugin and template are available at [docs.forestry.md](https://docs.forestry.md/)