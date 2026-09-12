# ap-ui-kit

Design tokens for the ap_ui_kit design system, authored in Figma via the **Token Studio** plugin and built into CSS with **Style Dictionary v5**. Presented in **Storybook**, structured similarly to the `ap_ds_storybook` repo.

This file is the runninpmng project log — architecture, how to build/run things, and a dated progress history. Update the "Progress log" section at the bottom whenever something meaningful changes, same as we've been doing this session.

## How the pieces fit together

- **`tokens.json`** — the raw Token Studio export. Source of truth; edited in Figma, pulled into this repo via Token Studio's VS Code/git sync.
- **`build-tokens.js`** — reads `tokens.json`, splits it into per-set files under `tokens/sets/` (gitignored, regenerated every run), and runs Style Dictionary against the right combination of sets for each build.
- **`scripts/generate-color-manifest.js`** — reads the built CSS and produces `tokens/generated/color-manifest.json`, the list Storybook's Color Foundations pages render from. Also diffs each theme's built CSS against Core's to figure out which semantic (tier_2) tokens actually change per theme — see "Sidebar structure" below.
- **`build/`** — Style Dictionary's output. Committed to git (unlike the intermediate `tokens/sets/`) so the CSS is reviewable in diffs.
- **`.storybook/` + `components/`** — the Storybook presentation layer described below.

### Two independent, toggleable dimensions

Unlike `ap_ds_storybook` (theme only), this repo has **two** dimensions that can each be turned on/off independently at runtime via a data attribute:

| Dimension | Options | Build folders | Runtime attribute |
|---|---|---|---|
| **Theme** | core / green / gold | `build/tier_1_core`, `build/tier_1_green`, `build/tier_1_gold` | `data-theme="green"` / `"gold"` (core = default, no attribute needed) |
| **Viewport** | mobile / tablet / desktop | `build/viewport_mobile`, `build/viewport_tablet`, `build/viewport_desktop` | `data-viewport="tablet"` / `"desktop"` (mobile = default) |

Each dimension also gets a combined, selector-scoped bundle for actually switching at runtime:
- `build/all-themes/css/variables.css`
- `build/all-viewports/css/variables.css`

Build folder names intentionally match Token Studio's own set names, so the output is recognizable against the sets list in Token Studio.

**Confirmed this session:** `tier_1_green.json` / `tier_1_gold.json`'s `color` key only ever contains `brand` — Color Palettes, Utility, Neutral, and Transparent are defined once in Core and never overridden per-theme. Within the tier_2 semantic layer (Content/Background/Border), only the entries that ultimately reference `color.brand.*` actually resolve differently per theme (confirmed by diffing built CSS, not by reading references — see `generate-color-manifest.js`'s `tier2ThemeDiffs`). This directly shaped the Storybook sidebar structure below.

**Known caveat (not yet resolved):** `tier_1_green`/`tier_1_gold` each carry their own copy of the per-viewport font-size/line-height scale constants, so theme and viewport aren't fully independent at the data level. Each dimension alone is correct; a theme AND a non-mobile viewport active on the *same element* at the same time isn't guaranteed to combine correctly yet (equal CSS specificity, last rule wins entirely rather than merging per-property). Doesn't affect Color (color never varies by viewport) — will matter once Typography Foundations pages are built.

### Pipeline note

`build-tokens.js` reads `tokens.json` directly and does **not** use `npx token-transformer`. token-transformer's output was found to double-wrap every `$type`/`$value` into `{value, type}` objects, which broke every resolved value — Style Dictionary's own `source` array does the same set-merging without that corruption. If you see old notes anywhere referencing a token-transformer step, they're stale.

## Storybook

Modeled on `ap_ds_storybook`'s Storybook setup, with two deliberate differences:

1. **Live-computed values, not hand-typed.** `ap_ds_storybook`'s Foundations pages hand-type every token's hex value into a JS array. Here, `ColorSwatch.jsx` only ever knows a CSS variable's *name* (from `color-manifest.json`) and reads its real, currently-resolved value via `getComputedStyle` at render time — so it can never drift from the actual tokens, and never needs manual updating.
2. **Two toolbar dropdowns, not one.** Theme and Viewport are independent `globalTypes` in `.storybook/preview.jsx`, both applied to a wrapper div via one decorator, matching the `all-themes`/`all-viewports` bundles. This toolbar exists on *every* page, including Core — so Core's page can already preview green/gold by itself; the pinned per-theme pages below are purely additive, for direct navigation.

### Sidebar structure

Mirrors `ap_ds_storybook`'s nav tree (`Tokens > Tier 1: Definitions > 1. Core > ...`, `Tokens > Tier 2: Semantic > ...`):

```
Tokens
  Tier 1: Definitions
    1. Core            -> Color (all 5: Color Palettes, Utility, Brand, Neutral, Transparent)
    2. Green Tier 1     -> Color (Brand only -- the only thing that differs, see above)
    3. Gold Tier 1      -> Color (Brand only)
  Tier 2: Semantic
    Green Tier 2        -> Content, Background, Border (only entries that differ from Core)
    Gold Tier 2         -> Content, Background, Border (only entries that differ from Core)
```

Design decisions made explicitly (Andrew's call, both times over the "just use the toolbar dropdown, no extra pages" alternative):
- Green/Gold Tier 1 and Tier 2 each get their **own sidebar pages**, not just the shared toolbar dropdown on Core's page.
- Those pages are **trimmed to only what's actually different from Core** — full Color Palettes/Utility/Neutral/Transparent duplication would just repeat Core's page for no reason, since those categories never vary by theme.

None of this duplicates any component or value: `tier1ColorStories.jsx` and `tier2SemanticStories.jsx` are factory functions that take a theme name and return story objects with `globals: { theme }` set (so e.g. "2. Green Tier 1 / Color" always renders pinned to green regardless of the toolbar's current selection), reading from the exact same live-computed `ColorSwatch`/manifest as Core. `Color.stories.jsx` / `ColorGreen.stories.jsx` / `ColorGold.stories.jsx` (Tier 1) and `SemanticGreen.stories.jsx` / `SemanticGold.stories.jsx` (Tier 2) are thin per-theme wrappers around those factories. The Tier 2 "differs from Core" filtering is computed once at build time in `generate-color-manifest.js` (`tier2ThemeDiffs`) by diffing built CSS values, not by parsing token references — correct regardless of how many levels of `{alias}` indirection a token goes through. There's no separate "Core" entry under Tier 2, matching `ap_ds_storybook`.

`.storybook/preview.jsx`'s `parameters.options.storySort.order` pins this exact ordering (Storybook's default alphabetical sort wouldn't otherwise put "1. Core" before "2. Green Tier 1" reliably as more categories get added).

Current scope: Color is complete. Border (width + radius) and Typography's Font Size (font1 only) are now underway too -- see the Progress log below for each. Typography's remaining primitives (Line Height, Letter Spacing, Text Case, Font Family, Font Weight, and font2/font3 for Font Size) and Spacing/Elevation Foundations pages are the natural next passes, following the same pattern (a `generate-<category>-manifest.js`, a component reading live values, and the same per-theme-factory + diff-only approach where a category actually varies by theme).

The Viewport dropdown has no visible effect on any Color/Semantic page (color tokens don't vary by viewport) — that's expected, not a bug — but it's wired up globally now so future pages can use it without touching `preview.jsx` again.

## Commands

```bash
npm install
npm run build             # node build-tokens.js && node scripts/generate-color-manifest.js
npm run storybook          # builds tokens, then starts the Storybook dev server on :6006
npm run build-storybook    # builds tokens, then produces a static storybook-static/ build
npm run deploy-storybook   # publishes storybook-static/ to GitHub Pages (the gh-pages branch)
```

To add a new theme or viewport: add one entry to the `THEMES`/`VIEWPORTS` array at the top of `build-tokens.js` (name — matches the Token Studio set name — source set(s), CSS selector). Nothing else needs to change.

### Publishing Storybook to GitHub Pages

The live site is deployed via the `gh-pages` package, which pushes the contents of `storybook-static/` to a `gh-pages` branch on `origin` — GitHub Pages serves straight from that branch. Going forward, redeploying the Storybook site is just:

```bash
npm run build-storybook && npm run deploy-storybook
```

any time you want to publish the latest version. Currently live at https://ajuhpark.github.io/ap_ds_storybook/ (this URL follows the repo's current name on GitHub, so it'll change if the repo is ever renamed).

## Known issues / open items

- **Theme + viewport combined simultaneously** — not yet built (see caveat above); needs a decision on whether to do a full cross-product build or change the underlying data.
- **`tier_1_core.font_weights_font_1`'s numeric medium/thin/heavy values** — still need the intended numeric scale (existing scale is non-standard: light=100, regular=300, semibold=500, bold=700).
- **Typography / Spacing / Elevation Foundations pages** — Border is done; Typography has Font Size (font1 only) so far. The rest (Line Height, Letter Spacing, Text Case, Font Family, Font Weight, font2/font3, Spacing, Elevation) is still deferred.
- **Dead weight**: root `config.json` and `MyStyleDictionary/` (incl. its own `config.json`) are unused leftovers from the original Style Dictionary tutorial this repo was scaffolded from; same for `output`/`output.json` and the leftover `build/android`, `build/compose`, `build/ios`, `build/ios-swift`, `build/scss` tutorial platforms if they reappear. Safe to delete, just hasn't been done.
- **`js` platform** was dropped from the build system (only `css` per theme/viewport now) — revisit if a JS variables file turns out to be needed somewhere.

## Progress log

**2026-09-11 (16) — Font Size now covers font2/font3 too; chevron direction fixed**
Two small follow-ups on (15)'s Font Size page: the collapsed chevron was
rotating -90deg (down-facing icon becomes right-facing), which reads as
"expand sideways" -- changed to `rotate(180deg)` so it points up instead,
per Andrew's screenshot. Then added `<FontSizeFontGroup>` for `font2` and
`font3` to `FontSizeScale.jsx` (each was already sitting in `typography-
manifest.json`, 21 steps apiece, from (15) -- this was just the two extra
lines that file's own comment said it needed). Verified via `npm run
build` (21/21/21) + `npx storybook build`.

**2026-09-11 (15) — Added Foundations/Typography > Font Size (font1 only)**
First Typography page. Since font-size steps are keyed by heading level
per font (h1, h2-lg, h2, ... -- see (13)/(14)'s research turn) rather than
a flat numbered scale, the page needed its own layout, not a straight port
of ap_ds_storybook's `TypeTokenSwatch`: a collapsible section per font
("font1" + a chevron that toggles the card grid below it, expanded by
default) with each card showing the heading-level name (e.g. "h1") above
the usual live size + CSS var row and alphabet-triplet sample -- matching
Andrew's screenshot layout. Only `font1` renders for now, per instruction;
`font2`/`font3` are already in the manifest for whenever they're added.

New `scripts/generate-typography-manifest.js` (same "extract names only"
architecture as the color/border manifests) produces `tokens/generated/
typography-manifest.json`, filtering out `base`/`heading-scale`/
`body-text-scale` -- those are the formula parameters h1/h2/... are
calculated from, not usable size steps themselves. New `components/
Foundations/Typography/{Typography.css, FontSizeCard.jsx,
FontSizeFontGroup.jsx, FontSizeScale.jsx, Typography.stories.jsx}`.
`FontSizeCard` reads its live size via the shared `useLiveCssValue` hook
and renders its alphabet sample in that font's own live family
(`--ap-font-families-{font}`), not a fixed one. Hit the same class of bug
as the original `generate-color-manifest.js` fix, but in this new
manifest script's own doc-comment: a literal `*/` inside a variable-name
list closed the JSDoc block comment early, causing a `SyntaxError`. Caught
and fixed before it ever reached Storybook. Wired into package.json's
"build" script; verified via `npm run build` (21 steps for font1/font2/font3
each) + `npx storybook build`'s index.json.

**2026-09-11 (14) — Fixed "React is not defined" on the new Border page**
`Border.stories.jsx` (added in (13)) uses JSX directly (`<BorderScale />`)
but was missing `import React from "react"` -- the same classic-JSX-
transform gap hit earlier in the session (`@storybook/react-vite` doesn't
bundle `@vitejs/plugin-react` here, so every file with JSX needs React
explicitly in scope). `BorderToken.jsx`/`BorderScale.jsx` already had the
import; only the stories file was missing it. Added it; re-verified with
`npm run build` + `npx storybook build`.

**2026-09-11 (13) — Added Foundations/Border (width + radius), live-computed**
First page outside Color. Confirmed `--ap-border-width-{0,1,2,4,8}` and
`--ap-border-radius-{0,2,4,8,16,32,round}` already exist in Core's built
CSS, essentially matching ap_ds_storybook's set 1:1 (we have one extra,
`width-0`). Read ap_ds_storybook's `components/Foundations/Border/`
(`Border.css` / `BorderScale.jsx` / `Border.stories.jsx`) -- one page
combining two sections (width, radius), each a two-tone title ("border"
muted + "width"/"radius" bold) above a flex-wrap row of bold-key/muted-
value/var-name token cards. Unlike Color, it's a flat list per section, no
family/step sub-split, and (confirmed: no ChocolateTier1/Border or
StrawberryTier1/Border directories exist there) it doesn't get a per-theme
page -- border tokens don't vary by theme.

Ported the same way as Color: new `scripts/generate-border-manifest.js`
(same "extract names only from built CSS, never values" architecture as
generate-color-manifest.js) produces `tokens/generated/border-manifest.json`
-- flat `width`/`radius` arrays of `{key, cssVar}`, `key` being everything
after the prefix (works for both numeric steps and the non-numeric "round").
New `components/Foundations/Border/Border.css` (`ap-` prefixed port of
ap_ds_storybook's classes), `BorderToken.jsx` (single token, live value via
the existing shared `useLiveCssValue` hook -- imported from `../Color/
useLiveCssValue.js` rather than duplicated, since it's generic, not color-
specific), `BorderScale.jsx` (the two-section page), and
`Border.stories.jsx` (`Tokens/Tier 1: Definitions/1. Core/Border`, no
Green/Gold variant). Wired `generate-border-manifest.js` into package.json's
"build" script. Verified via `npm run build` (5 width tokens, 7 radius
tokens) + `npx storybook build`'s index.json.

**2026-09-11 (12) — Storybook's built-in device-preview viewport tool disabled**
Turns out the "Small mobile" W x H control in the toolbar is a separate thing from our own `viewport` globalType (already hidden in (11)) -- it's Storybook's own core device-preview tool, present by default since Storybook 8, confirmed identical in `ap_ds_storybook` (same `@storybook/addon-a11y`/`addon-docs` devDependencies, no `@storybook/addon-viewport`, no `parameters.viewport` config there either). It defaulting to "Small mobile" here but not there was just `localStorage` -- that tool's selection persists per browser origin (i.e. per dev-server port), so the two projects' dev servers had independently drifted. Added `parameters.viewport.disable = true` to `ap_ui_kit`'s `preview.jsx` to remove the control from the toolbar outright, so it can't drift again regardless of what's in any given browser's local storage.

**2026-09-11 (11) — Theme (Green/Gold) and Viewport toolbar dropdowns hidden for now**
Removed the `toolbar` block from both the `theme` and `viewport` globalTypes in `.storybook/preview.jsx`, so neither shows up as a toolbar dropdown anymore. Reasoning: the Theme dropdown's Green/Gold options were redundant with the dedicated "Green Tier 1"/"Gold Tier 1"/"Green Tier 2"/"Gold Tier 2" sidebar pages (those pin their own `globals: {theme}` per story, which works with or without a toolbar control for it); the Viewport dropdown is a no-op today since viewport tokens only ever touch fontSize/lineHeights, never color, and Color is still the only scope implemented. `initialGlobals` (`theme: "core"`, `viewport: "mobile"`) and the `withTokenAttributes` decorator are untouched, so `data-theme`/`data-viewport` wiring still works exactly the same -- only the toolbar UI is gone. Re-adding a `toolbar` block to either globalType later (e.g. once Typography/Spacing Foundations need live Viewport switching) brings the dropdown back with no other changes.

**2026-09-11 (10) — Tier 2 semantic card label now matches ap_ds_storybook's `.color-palette-label`**
Caught by inspection: ap_ds_storybook's Tier 2 pages (`ContentColors.jsx` etc.) render nothing but `<ColorSwatchCardGroup label="content" .../>` -- a small 12px/weight-600/gray/capitalized label (`.color-palette-label`, `margin-bottom: 0.5rem`) directly above the card list, no separate heading. Our `ColorGridSection.jsx` had no such label at all and instead wrapped everything in the much bigger `.ap-color-section__title` (18px/700/black) that Tier 1 pages use -- a heading treatment ap_ds_storybook's Tier 2 doesn't have. Fixed by giving `ColorSwatchCardGroup` a `label` prop (rendered via a new `.ap-color-swatch-card-label` class in `ColorSwatchCard.css`, matching `.color-palette-label`'s properties exactly) and having `ColorGridSection.jsx` pass `grid.title` into it instead of rendering its own `<h3>`. Deliberately a NEW class rather than reusing Tier 1's `.ap-color-palette-label` -- that class has its `margin-bottom` commented out on purpose (Tier 1's `.ap-color-palette` supplies that spacing via its own flex `gap` instead), and Tier 2's card list isn't wrapped in `.ap-color-palette`, so reusing it as-is would've left the label with no spacing below it. Tier 1 files untouched.

**2026-09-11 (9) — Tier 2 semantic sidebar nested under a "Color" folder**
Screenshots comparing the two sidebars showed `ap_ds_storybook`'s Tier 2 tree is `Tier 2: Semantic > Strawberry Tier 2 > Color > Content/Background/Border` -- an extra "Color" folder between the theme page and the token-type stories -- while `ap_ui_kit`'s was flat: `Tier 2: Semantic > Green Tier 2 > Content/Background/Border`. Fixed by adding `/Color` to the end of the `title` in `SemanticGreen.stories.jsx` and `SemanticGold.stories.jsx` (`Tokens/Tier 2: Semantic/Green Tier 2/Color` and `.../Gold Tier 2/Color`) -- Storybook derives the sidebar tree entirely from each story file's `title` string, so no other files needed to change. Verified via a static build's `index.json`: both Green and Gold Tier 2 now list their Docs/Content/Background/Border entries under the nested `.../Color` path.

**2026-09-11 (8) — Tier 2 semantic colors rebuilt to match ap_ds_storybook's card component**
Read `ap_ds_storybook`'s `ContentColors.jsx` / `ColorSwatchCardGroup.jsx` / `ColorSwatchCard.jsx` / `ColorSwatchCard.css` in full -- the Content/Background/Border pages there aren't a wrapping grid of small swatches, they're a single vertical list (max-width 412px) of bordered white cards, each with a 48x48 swatch on the left and the token's name/hex/CSS-var stacked on the right. Rebuilt `ap_ui_kit`'s Tier 2 semantic rendering to match that structure exactly: new `ColorSwatchCard.jsx` (one card, live value via the existing `useLiveCssValue`/`hasVisibleAlpha` hook instead of ap_ds_storybook's hand-typed `value` prop) and `ColorSwatchCardGroup.jsx` (the vertical list), plus a new `ColorSwatchCard.css` mirroring ap_ds_storybook's measurements/classes but pointed at `ap_ui_kit`'s own `--ap-color-neutral-*` fallbacks instead of `--ds-color-neutral-*`. `ColorGridSection.jsx` now renders `<ColorSwatchCardGroup>` instead of the old `.ap-color-grid` wrap-of-`ColorSwatch`; the now-orphaned `ColorSwatch.jsx`/`ColorSwatch.css` and the unused `.ap-color-grid` rule in `Color.css` were deleted. Tier 1 (`ColorPalette.jsx`, `ColorScaleSection.jsx`, `tier1ColorStories.jsx`, `Color.stories.jsx`, `ColorGreen.stories.jsx`, `ColorGold.stories.jsx`, and Tier 1's classes in `Color.css`) was left untouched, per instruction. Re-verified with `npm run build` + `npx storybook build`, and grepped for stray references to the deleted files afterward.


**2026-09-11 (7) — Turned on autodocs (the "Docs" sidebar entries)**
Checked `ap_ds_storybook/.storybook/preview.jsx` -- the "Docs" entry every component there has (e.g. Border) comes from a project-wide `tags: ["autodocs"]` on the top-level `preview` object, not per-file config. `main.js`'s default `docs.autodocs: "tag"` setting only auto-generates a Docs page for stories carrying that tag. Added the same `tags: ["autodocs"]` to `ap_ui_kit`'s `.storybook/preview.jsx` -- confirmed via a static build's `index.json` that all 5 story files (Core/Green/Gold Tier 1 Color, Green/Gold Tier 2) now get one automatically, with no per-file changes needed, current or future.


**2026-09-11 (6) — Transparent moved to the ColorPalette layout too**
Checked `ap_ds_storybook/components/Foundations/Color/TransparentColors.jsx` -- it renders through the exact same `<ColorPalette>` component as Utility/Brand (one family, "transparent", with its steps), not a separate card grid. Moved `Transparent` from `generate-color-manifest.js`'s `grids` (card layout) to `scales` (via `buildFlatScale`, same as Neutral), and updated `tier1ColorStories.jsx` so Transparent renders through `ColorScaleSection`/`ColorPalette` instead of `ColorGridSection`. Tier 2 semantic (Content/Background/Border) is unchanged -- those really are ap_ds_storybook's separate "card" pattern, not a ColorPalette. Re-verified with `npm run build` + `npx storybook build`.


**2026-09-11 (5) — Scale tiles rebuilt to match ap_ds_storybook's exact structure/CSS**
The "row" layout from the previous pass (swatch + label bundled together, gap between rows) was still visually different from `ap_ds_storybook`'s real pattern -- traced its actual code to `ap_ds_storybook/components/Foundations/Color/ColorPalette.jsx` + `Color.css`. Its real structure: a palette's tiles and labels are **two separate flex columns**, not paired rows -- the tile column has zero gap (tiles stack edge-to-edge into one continuous 4rem-square strip) and the label column is a completely independent flex tree, height-matched (each label div = 4rem tall) so the two columns line up row-for-row despite the tile column having no gap of its own.

Rebuilt to match exactly: new `ColorPalette.jsx` mirrors that two-column structure 1:1 (own `ColorTile`/`ColorLabel` subcomponents), and `Color.css` copies the class shapes directly (`.ap-color-token-group`, `.ap-color-palette`, `.ap-color-tile-column`, `.ap-color-tile` at `4rem` square, `.ap-color-label-column`, `.ap-color-label`, etc. -- `ap-` prefixed versions of `ap_ds_storybook`'s `ds-` prefixed classes). The one intentional difference: `ap_ds_storybook`'s tile and label both read a hand-typed `value` from the same JS object; ours each independently read the live value via a new shared `useLiveCssValue.js` hook (extracted from `ColorSwatch.jsx`, which also now uses it) -- custom properties inherit, so a tile and its label with separate refs always agree without either needing to carry its own value. `ColorScaleSection.jsx` now just renders one `<ColorPalette>` per family. `ColorSwatch.jsx` (Transparent/Tier 2 grids, unchanged) also switched to the shared hook, dropping its own duplicate alpha-detection logic. Re-verified with `npm run build` + `npx storybook build`.

**2026-09-11 (4) — Fixed swatches always showing checkerboard; scale layout matches ap_ds_storybook**
Bug: every swatch (even fully opaque colors) rendered as a plain grey/white checkerboard with no visible color at all -- looked like every token was transparent. Root cause: `ColorSwatch.jsx`'s box always painted a checkerboard `background-image` (added so genuinely alpha tokens would read clearly against a white background) *unconditionally*, on top of the `background-color` layer, regardless of whether that color actually had any transparency. The live-read value (shown as text under each swatch) was correct the whole time -- it was purely a CSS layering bug, not a token-resolution bug. Fixed by computing each swatch's actual alpha from its live `getComputedStyle` value and only applying the checkerboard when alpha is genuinely < 1.

Also made a first attempt at restyling the scale pages to match `ap_ds_storybook` (superseded by (5) above once the actual reference code was checked more carefully).

**2026-09-11 (4) — Fixed swatches always showing checkerboard; scale layout matches ap_ds_storybook**
Bug: every swatch (even fully opaque colors) rendered as a plain grey/white checkerboard with no visible color at all -- looked like every token was transparent. Root cause: `ColorSwatch.jsx`'s box always painted a checkerboard `background-image` (added so genuinely alpha tokens would read clearly against a white background) *unconditionally*, on top of the `background-color` layer, regardless of whether that color actually had any transparency. The live-read value (shown as text under each swatch) was correct the whole time -- it was purely a CSS layering bug, not a token-resolution bug. Fixed by computing each swatch's actual alpha from its live `getComputedStyle` value (`hasVisibleAlpha` in `ColorSwatch.jsx`) and only applying the checkerboard when alpha is genuinely < 1 -- so opaque colors now render solid, and only the `Transparent` category (and anything else truly translucent) shows the checker pattern behind it.

Also restyled the scale pages (Color Palettes / Utility / Brand / Neutral) to match `ap_ds_storybook`'s own layout: families as side-by-side columns (family name as the column header) with steps listed top-to-bottom, each step showing a small swatch beside "{step} {value}" bold + the CSS var name in muted monospace below -- instead of the previous horizontal strip-of-swatches-per-family. `ColorSwatch` now takes a `layout` prop (`"row"` for scales, `"card"` for Transparent/Tier 2 grids, which are unchanged). Re-verified with `npm run build` + `npx storybook build`.

**2026-09-11 (3) — Green/Gold Tier 1 & Tier 2 pages trimmed to differences-only**
Confirmed via `tokens/sets/tier_1_green.json` / `tier_1_gold.json` that `brand` is the *only* key either theme's `color` object overrides — so `ColorGreen.stories.jsx`/`ColorGold.stories.jsx` now only export `Brand` (dropped Color Palettes/Utility/Neutral/Transparent, which would've just been exact duplicates of Core's page). Extended `generate-color-manifest.js` to diff each theme's built CSS against Core's for the tier_2 semantic vars (`tier2ThemeDiffs`) — 15 tokens differ per theme (4 in Content, 10 in Background, 1 in Border; all reference `color.brand.*`) — and `tier2SemanticStories.jsx` now renders only those. `ColorGridSection.jsx` shows a plain "no differences" note if a diffed category ever comes up empty. Re-verified with `npm run build` + `npx storybook build`.

**2026-09-11 (2) — Sidebar restructured to match ap_ds_storybook's nav tree**
Split the single "Foundations/Color" story into the Tier 1 / Tier 2 sidebar structure described above, matching `ap_ds_storybook`'s `Tokens > Tier 1: Definitions > 1. Core / 2. ... Tier 1 / 3. ... Tier 1` and `Tokens > Tier 2: Semantic > ... Tier 2` tree. Chose (Andrew's call) to give Green and Gold their own pinned-theme sidebar pages for both Tier 1 and Tier 2, even though our Color pages already respond live to the Theme toolbar dropdown — done via a `globals: { theme }` factory (`tier1ColorStories.jsx`, `tier2SemanticStories.jsx`) rather than duplicating any component or value. Added `parameters.options.storySort.order` to `.storybook/preview.jsx` to pin the exact ordering. Re-verified with `npx storybook build`.

**2026-09-11 (1) — Storybook implemented (Color only)**
Added the full Storybook layer described above: `.storybook/main.js` + `preview.jsx` (two-dropdown toolbar), `components/TokenPreviewContext.jsx`, `components/Foundations/Color/**`, and `scripts/generate-color-manifest.js`. Added React 19.2.8, Storybook 10.3.6 family, and Vite 6 as dependencies. Verified end-to-end: `npm install`, `npm run build`, and `npx storybook build` (static production build) all completed cleanly.

Ran into `ReferenceError: React is not defined` the first time the dev server actually rendered a story. Root cause: `@storybook/react-vite` here doesn't install `@vitejs/plugin-react`, so JSX compiles to the classic `React.createElement` form (needs `React` in scope) rather than the newer automatic runtime — same as `ap_ds_storybook`, whose `Button.jsx` etc. also explicitly `import React from "react"`. Fixed by adding that import to every file with JSX (any new one needs it too — `preview.jsx` already had it). Re-verified with another clean `npx storybook build`.

Not yet committed/pushed — review the new files in VS Code and push via Source Control when ready.

**Earlier (same overall effort, prior to this log existing)**
- Upgraded Style Dictionary to v5.4.0 + `@tokens-studio/sd-transforms` v2.0.3.
- Removed `token-transformer` from the pipeline entirely after finding it was the root cause of the long-standing `[object Object]` bug (it double-wraps `$type`/`$value`).
- Built the two-dimensional (theme × viewport) build system in `build-tokens.js`, with build folder names matched to Token Studio's own set names.
- Fixed a stale `{fontWeights-numbers.300}` reference (hyphen typo) and added missing `medium`/`thin`/`heavy` slots to the font-weight sets.
- Fixed a `"Heavt"` → `"Heavy"` typo in Token Studio (font weight `heavy` now correctly resolves to `900`).
- Deleted leftover tutorial build folders (`build/android`, `build/compose`, `build/ios`, `build/ios-swift`, `build/scss`).
