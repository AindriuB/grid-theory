# I260 — validation and browser check

## html-validate

```
$ npx --yes html-validate dist/index.html
(no output, exit 0 — 0 errors, 0 warnings)
```

Fixed two pre-existing errors while in the file (both present on baseline
`HEAD:dist/index.html` before this task, verified by running html-validate
against a copy of it): `doctype-style` (`<!doctype html>` → `<!DOCTYPE html>`)
and `aria-label-misuse` (dropped the redundant `aria-label` on the `.hero-art`
`<div>` — a generic element with no ARIA-naming role — since the child `<img>`
already carries a full descriptive `alt`).

## Browser check (real headless Chrome via CDP, not a static read)

Driven from Node's native `WebSocket` over the Chrome DevTools Protocol
(`Emulation.setDeviceMetricsOverride` for viewport width,
`Emulation.setEmulatedMedia` for `prefers-color-scheme`), serving `dist/`
with `python3 -m http.server` and querying the live DOM after navigation.

| Width | Scheme | Badge img (fallback → source override) | Body bg | Gallery scrolls | Page horizontal scroll |
|---|---|---|---|---|---|
| 390px | light | `app-store-badge-black.svg` → dark source `app-store-badge-white.svg` | `rgb(245, 247, 246)` | yes (`scrollWidth` 1241 > `clientWidth` 375) | no |
| 390px | dark | `app-store-badge-white.svg` (dark media matched) | `rgb(26, 28, 46)` | yes | no |
| 1280px | light | `app-store-badge-black.svg` → dark source `app-store-badge-white.svg` | `rgb(245, 247, 246)` | yes | no |
| 1280px | dark | `app-store-badge-white.svg` | `rgb(26, 28, 46)` | yes | no |

`window.matchMedia('(prefers-color-scheme: dark)').matches` was read directly
from the page for each case and matched the emulated scheme in all four runs.
`document.documentElement.scrollWidth` never exceeded `clientWidth` in any of
the four combinations (verified — `noHScroll: true` in every case).

Note: the four gallery `<figure>` elements individually report
`getBoundingClientRect().right` past the viewport edge at both widths — this
is the intended behaviour of `.gallery-track` (`overflow-x: auto`,
`scroll-snap-type: x mandatory`), a self-contained horizontal scroller; it
does not affect `document.documentElement.scrollWidth` (page-level scroll),
confirmed above.

Regression found and fixed during this check: the optional `#screenshots` nav
link (`<a href="#screenshots">Screenshots</a>`) made the header `<nav>`
overflow past the viewport at 390px (`site.css`'s `.site-header` is a
non-wrapping flex row; a fourth nav item does not fit at phone widths). Since
`site.css` is out of scope for this task and the nav link was explicitly
optional in the contract ("welcome", not required), it was dropped rather
than reported as a missing CSS rule; the header keeps its original three
links (Features / Privacy / Support). The gallery section itself is still
reachable via scrolling and is linked from `#screenshots` as an anchor id
even without a nav shortcut to it.
