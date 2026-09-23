# I259 — browser check (attempt 2: real CDP emulation)

Attempt 1's overflow check was a typed conclusion, not a captured
measurement, and its dark-mode toggle was a hand-merged scratch copy of
`site.css` rather than the browser's real `prefers-color-scheme`. This
run drives real headless Chrome over the DevTools Protocol instead.

## Method

- Browser: `Google Chrome 153.0.8010.54`, launched
  `--headless=new --remote-debugging-port=9333`, a fresh
  `--user-data-dir`, no other flags affecting rendering.
- Driver: Node (`v24.19.0`, built-in `WebSocket`/`fetch`, no npm
  packages) — script kept in this task's scratchpad, never committed.
  Per page × width × mode: opens a new CDP target, `Emulation.setEmulatedMedia`
  sets `prefers-color-scheme` to `light`/`dark`, `Emulation.setDeviceMetricsOverride`
  sets the viewport to 390 or 1280 px, `Page.navigate` loads the URL, then
  `Runtime.evaluate` reads real DOM/CSSOM values back after the page settles
  two animation frames.
- Servers: `python3 -m http.server 8259 --directory dist` (the real
  `dist/`, unmodified) and a second instance on `8260` serving a
  scratchpad-only fixture page built from the shared contract's markup
  (`.brand-mark` as an `<img>`, `.store-badge` with the light/dark
  `<picture>`, `.gallery`/`.gallery-track`/`.shot`, `.button`,
  `.feedback-form`) — never committed, never under `dist/`. `dist/index.html`,
  `dist/support/index.html` and `dist/privacy/index.html` do not yet carry
  the new markup (I260/I261, wave 2), so the button/badge columns below are
  blank for those three pages by design.
- Hover: after each page settles, `Runtime.evaluate` reads the
  `.button`'s `getBoundingClientRect()` centre, `Input.dispatchMouseEvent`
  moves the real synthetic pointer there, then `getComputedStyle` is read
  again — a genuine `:hover` match (`b.matches(':hover')` was true in
  every run), not a forced pseudo-class.
- Contrast: computed in the driver script from the literal `rgb()`/`rgba()`
  strings `getComputedStyle` returned (alpha-channel colours composited
  over the sampled background first), using the same WCAG 2 relative-luminance
  formula as `palette.md`.

## Raw output (captured verbatim from the driver script's stdout)

```
page,width,mode,scrollWidth,clientWidth,overflowPx,bodyContrast,mutedContrast,accentTextContrast,prefersDark,storeBadgeSrc,buttonBg,buttonColor,buttonContrast,hoverBg,hoverColor,hoverBoxShadow,hoverTransform,hoverBgUnchanged,hoverColorUnchanged
index,390,light,390,390,0,15.62,5.26,6.77,false,,,,,,,,,,
index,390,dark,390,390,0,15.62,6.06,8.72,true,,,,,,,,,,
index,1280,light,1280,1280,0,15.62,5.26,6.77,false,,,,,,,,,,
index,1280,dark,1280,1280,0,15.62,6.06,8.72,true,,,,,,,,,,
support,390,light,390,390,0,15.62,5.26,5.26,false,,,,,,,,,,
support,390,dark,390,390,0,15.62,6.06,6.06,true,,,,,,,,,,
support,1280,light,1280,1280,0,15.62,5.26,5.26,false,,,,,,,,,,
support,1280,dark,1280,1280,0,15.62,6.06,6.06,true,,,,,,,,,,
privacy,390,light,390,390,0,15.62,5.26,5.26,false,,,,,,,,,,
privacy,390,dark,390,390,0,15.62,6.06,6.06,true,,,,,,,,,,
privacy,1280,light,1280,1280,0,15.62,5.26,5.26,false,,,,,,,,,,
privacy,1280,dark,1280,1280,0,15.62,6.06,6.06,true,,,,,,,,,,
fixture,390,light,390,390,0,15.62,5.26,6.77,false,app-store-badge-black.svg,rgb(0, 95, 115),rgb(255, 255, 255),7.28,rgb(0, 95, 115),rgb(255, 255, 255),rgba(0; 95; 115; 0.22) 0px 10px 24px 0px,matrix(1, 0, 0, 1, 0, -1),true,true
fixture,390,dark,390,390,0,15.62,6.06,8.72,true,app-store-badge-white.svg,rgb(0, 95, 115),rgb(255, 255, 255),7.28,rgb(0, 95, 115),rgb(255, 255, 255),rgba(62; 207; 192; 0.22) 0px 10px 24px 0px,matrix(1, 0, 0, 1, 0, -1),true,true
fixture,1280,light,1280,1280,0,15.62,5.26,6.77,false,app-store-badge-black.svg,rgb(0, 95, 115),rgb(255, 255, 255),7.28,rgb(0, 95, 115),rgb(255, 255, 255),rgba(0; 95; 115; 0.22) 0px 10px 24px 0px,matrix(1, 0, 0, 1, 0, -1),true,true
fixture,1280,dark,1280,1280,0,15.62,6.06,8.72,true,app-store-badge-white.svg,rgb(0, 95, 115),rgb(255, 255, 255),7.28,rgb(0, 95, 115),rgb(255, 255, 255),rgba(62; 207; 192; 0.22) 0px 10px 24px 0px,matrix(1, 0, 0, 1, 0, -1),true,true
```

Column notes: `overflowPx` = `scrollWidth − clientWidth` on
`document.documentElement` (0 everywhere above — no horizontal page
overflow on any of the 16 page × width × mode combinations, including both
390 px and 1280 px on all three real pages and the fixture, light and dark).
`prefersDark` is the page's own `matchMedia('(prefers-color-scheme: dark)').matches`,
confirming the CDP override actually reached the page (`false` for every
light run, `true` for every dark run). `storeBadgeSrc` is the fixture
`.store-badge img`'s resolved `currentSrc` — `app-store-badge-black.svg`
in light, `app-store-badge-white.svg` in dark, on both widths: the
`<picture>`/`<source media="(prefers-color-scheme: dark)">` swap works
under a real `prefers-color-scheme`, which attempt 1 could not exercise.
`hoverBgUnchanged`/`hoverColorUnchanged` are `true` in every fixture row:
the fixed `.button:hover` (`box-shadow` + `transform`, no colour change)
leaves `background`/`color` identical to the non-hover state in both
modes, so the button's hover contrast is the same 7.28:1 as its rest state
— not the 1.93:1 the old `background: var(--accent)` hover produced in
dark mode. `hoverBoxShadow` shows the glow correctly switches token
(`rgba(0,95,115,.22)` light → `rgba(62,207,192,.22)` dark) via
`var(--accent-glow)`, and `hoverTransform`'s `matrix(1,0,0,1,0,-1)` is the
1 px hover lift.

## Contrast, real rendered elements

`bodyContrast`, `mutedContrast` and `accentTextContrast` above are
computed from the actual `getComputedStyle` colours read back on each
page, not re-derived from the hex table in `palette.md` — they land within
rounding of `palette.md`'s independently-computed values (body 15.62:1
matches exactly; muted 5.26/6.06 here vs 5.30/6.05 there, accent-as-text
6.77/8.72 matches exactly), cross-checking that document.

## Not exercised here

- `:focus-visible` outlines on inputs/selects/textarea/buttons: confirmed
  by reading the stylesheet rules (unchanged from attempt 1), not by a
  keyboard-driven CDP pass — this was not a review finding and attempt 1's
  reviewer did not flag it.
- Screenshots were not saved into the repo (optional per the task).
