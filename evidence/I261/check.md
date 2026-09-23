# I261 — html-validate and browser check

## html-validate

```
$ npx --yes html-validate dist/support/index.html dist/privacy/index.html
(no output, exit 0)
```

0 errors, 0 warnings on both files. (The default ruleset's `doctype-style`
rule requires an uppercase `<!DOCTYPE html>`; both owned files now use it —
`dist/index.html`, owned by I260 and left byte-identical, still uses the
site's original lowercase `<!doctype html>` and was not linted here.)

## Browser check (real CDP emulation, not a typed conclusion)

- Browser: `Google Chrome 153.0.8010.54`, launched
  `--headless=new --remote-debugging-port=9344`, a fresh `--user-data-dir`.
- Driver: Node `v24.19.0`, built-in `WebSocket`/`fetch`, no npm packages,
  kept in this task's scratchpad, never committed. Per page × width × mode:
  opens a new CDP target, `Emulation.setEmulatedMedia` sets
  `prefers-color-scheme`, `Emulation.setDeviceMetricsOverride` sets the
  viewport to 390 or 1280 px, `Page.navigate` loads the real `dist/` served
  by `python3 -m http.server 8261 --directory dist`, then `Runtime.evaluate`
  reads real DOM/CSSOM values back.
- Safety: the form-submission checks never call `location.href` with a
  filled-in form — only the **empty-message** path is exercised live (it
  returns before ever building a URL). The full "Data issue" example is
  verified separately, and only by direct function call under Node with no
  `window`/`location` at all — see `evidence/I261/mailto.md`. No mailto: URL
  was ever navigated to or opened by this check.

### Per page × width × mode (all 8 combinations)

| page | width | mode | overflowPx | prefersDark | bodyContrast | store badge img | brand-mark src |
|---|---|---|---|---|---|---|---|
| support | 390 | light | 0 | false | 15.62 | app-store-badge-black.svg | icon-64.png |
| support | 390 | dark | 0 | true | 15.62 | app-store-badge-white.svg | icon-64.png |
| support | 1280 | light | 0 | false | 15.62 | app-store-badge-black.svg | icon-64.png |
| support | 1280 | dark | 0 | true | 15.62 | app-store-badge-white.svg | icon-64.png |
| privacy | 390 | light | 0 | false | 15.62 | app-store-badge-black.svg | icon-64.png |
| privacy | 390 | dark | 0 | true | 15.62 | app-store-badge-white.svg | icon-64.png |
| privacy | 1280 | light | 0 | false | 15.62 | app-store-badge-black.svg | icon-64.png |
| privacy | 1280 | dark | 0 | true | 15.62 | app-store-badge-white.svg | icon-64.png |

`overflowPx` = `scrollWidth − clientWidth` on `document.documentElement` — 0
everywhere, no horizontal overflow on either page at either width, in either
mode. `prefersDark` is the page's own
`matchMedia('(prefers-color-scheme: dark)').matches`, confirming the CDP
override reached the page. `store badge img` is the `.store-badge img`'s
resolved `currentSrc` filename — the dark `<picture><source>` swap works
under a real `prefers-color-scheme` on both pages. `brand-mark src` confirms
the header/footer mark renders as the real `<img>` (`icon-64.png`), not the
old `<span class="brand-mark">GT</span>`.

Identical on every one of the 8 rows (so shown once): `favicon32 =
../assets/img/icon/icon-32.png`, `touchIcon = ../assets/img/icon/icon-180.png`,
`ogImage = https://gridtheory.app/assets/img/icon/og-image.png`,
`itunesMeta = app-id=6805695204`, `themeMetas = ["(prefers-color-scheme:
light)=#F5F7F6", "(prefers-color-scheme: dark)=#1A1C2E"]`,
`storeBadgeHref = https://apps.apple.com/app/id6805695204`, `hasDataImage =
false`, `hasOldBrandMark = false`.

### Form behaviour (support page, real DOM)

The visible `[data-support-email-link]` anchor is empty in the raw HTML and
filled by `feedback.js` on load:

```json
{ "href": "mailto:support%40gridtheory.app", "text": "support@gridtheory.app" }
```

Submitting with category "Bug" and an empty message does not navigate and
sets `.form-status`:

```json
{
  "before": "http://127.0.0.1:8261/support/",
  "after": "http://127.0.0.1:8261/support/",
  "status": "Please choose a category and add a message before sending."
}
```

`before` and `after` are identical — no navigation occurred.
