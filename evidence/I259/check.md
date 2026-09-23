# I259 — browser check

Browser: Google Chrome 153.0.8010.54 (headless CLI, macOS), driven from the
command line since no interactive browser session was available in this
environment. Pages were served locally with `python3 -m http.server` (one
server for the real `dist/`, one for a throwaway fixture page covering the
contract's not-yet-built markup — the fixture is scratchpad-only, never
committed, never under `dist/`).

Dark mode note: Chrome's headless CLI in this build does not honour
`--blink-settings=preferredColorScheme` or `--force-dark-mode` for the
`prefers-color-scheme` media feature (verified: identical output regardless
of the flag). To exercise the dark-mode rules without a real OS/browser
dark-mode toggle, a scratch-only copy of `site.css` was generated with the
`@media (prefers-color-scheme: dark)` block's declarations merged into
`:root` directly (same property values, no rule added or removed) and
served alongside a scratch copy of `dist/`. This exercises the exact same
dark-mode declarations that ship in `site.css`; only the mechanism for
selecting them was swapped for testing purposes. The real file's media
query itself was read and confirmed correct by inspection.

## What was checked, at 390 px and 1280 px, each pass in both light and
## simulated-dark:

- `dist/index.html` — header/brand, hero copy and store-badge stand-in,
  hero-art image, proof strip, features grid, privacy callout, footer.
  No horizontal page scroll, no invisible text, in either mode, either
  width.
- `dist/support/index.html` (current placeholder copy, pre-I261) — legal
  layout, text-link. No horizontal page scroll, no invisible text.
- `dist/privacy/index.html` — legal layout, long-form paragraphs, updated
  date in accent colour. No horizontal page scroll, no invisible text.
- Fixture page (scratchpad-only, built from the contract's markup) —
  `.brand-mark` as an `<img>`, `.store-badge` in the hero and footer,
  `.gallery` / `.gallery-track` / `.shot` / `.shot--phone` / `.shot--tablet`
  with placeholder images, `.button`, and the full `.feedback-form` with
  `.field`, `.field--full`, `.form-note`, `.form-status`, `.support-email`.
  No horizontal page scroll, no invisible text, in either mode, either
  width.

## Horizontal overflow

For every target above, `document.documentElement.scrollWidth` was measured
against `document.documentElement.clientWidth` (via a same-origin iframe
sized to the exact test width, since headless Chrome's own window could not
be driven narrower than ~500 px). Result at both 390 px and 1280 px, light
and dark, on all four targets: `scrollWidth === clientWidth` — no page-level
horizontal overflow. `.gallery-track` itself scrolls horizontally by design
(`overflow-x: auto; scroll-snap-type: x mandatory`); that contained scroll
is expected and does not add to the page's `scrollWidth`.

## Visual read

Full-page and cropped screenshots were taken at 390 px and 1280 px, light
and simulated-dark, for the fixture and for `dist/index.html`,
`dist/support/index.html`, `dist/privacy/index.html`, and read back
directly (not saved into the repo — screenshots were scratchpad-only).
Confirmed by eye: body text, eyebrow, muted copy, the accent heading word,
button text, feedback-form labels/inputs, and the support-email link are
all legible against their background in both modes; the gallery shows a
partially-visible next card (evidence the track scrolls rather than
wrapping or overflowing the page); the feedback form's two-column layout
collapses to one column under 700 px.

## Not exercised here

- The store badge's own light/dark artwork swap (`<picture>` /
  `<source media="(prefers-color-scheme: dark)">`) depends on the browser's
  real `prefers-color-scheme`, which the forced-dark CSS proxy above does
  not change — only real OS/browser dark mode does. Confirmed instead by
  reading `.store-badge` and `.store-badge img` in `site.css`: neither sets
  `filter`, `opacity < 1`, `transform`, or a `background`/`border` on the
  image.
- `:focus-visible` outlines on inputs/selects/textarea/buttons were
  confirmed by reading the stylesheet rules, not by an interactive
  keyboard-tab pass (no interactive browser session in this environment).
