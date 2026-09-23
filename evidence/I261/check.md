# I261 — html-validate and browser check

## html-validate

```
$ npx --yes html-validate dist/support/index.html dist/privacy/index.html
(no output, exit 0)
```

0 errors, 0 warnings on both files. (The default ruleset's `doctype-style`
rule requires an uppercase `<!DOCTYPE html>`; both owned files now use it —
`dist/index.html`, owned by I260 and left byte-identical, still uses the
site's original lowercase `<!doctype html>` and was not linted here.) Re-run
after attempt 2's fixes; unchanged from attempt 1.

## Browser check (real CDP emulation, not a typed conclusion)

- Browser: `Google Chrome 153.0.8010.54`, launched
  `--headless=new --remote-debugging-port=9345`, a fresh `--user-data-dir`
  under this task's scratchpad.
- Driver: Node `v24.19.0`, built-in `WebSocket`/`fetch`, no npm packages,
  kept in this task's scratchpad, never committed. Per page × width × mode:
  opens a new CDP target, `Emulation.setEmulatedMedia` sets
  `prefers-color-scheme`, `Emulation.setDeviceMetricsOverride` sets the
  viewport to 390 or 1280 px, `Page.navigate` loads the real `dist/` served
  by `python3 -m http.server 8261 --directory dist`, then `Runtime.evaluate`
  reads real DOM/CSSOM values back.
- Safety: the JS-path submission checks below never call `location.href`
  with a filled-in form — only the **empty-message** path is exercised live
  (it returns before ever building a URL). The full "Data issue" example is
  verified separately, and only by direct function call under Node with no
  `window`/`location` at all — see `evidence/I261/mailto.md`. No mailto: URL
  was ever navigated to or opened by any check in this file.

### Per page × width × mode (all 8 combinations, re-run after attempt 2)

| page | width | mode | overflowPx | prefersDark | store badge img |
|---|---|---|---|---|---|
| support | 390 | light | 0 | false | app-store-badge-black.svg |
| support | 390 | dark | 0 | true | app-store-badge-white.svg |
| support | 1280 | light | 0 | false | app-store-badge-black.svg |
| support | 1280 | dark | 0 | true | app-store-badge-white.svg |
| privacy | 390 | light | 0 | false | app-store-badge-black.svg |
| privacy | 390 | dark | 0 | true | app-store-badge-white.svg |
| privacy | 1280 | light | 0 | false | app-store-badge-black.svg |
| privacy | 1280 | dark | 0 | true | app-store-badge-white.svg |

`overflowPx` = `scrollWidth − clientWidth` on `document.documentElement` — 0
everywhere, no horizontal overflow on either page at either width, in either
mode, even though the form-note's mailto link is now real, longer static
text (see below) rather than a placeholder ellipsis. `prefersDark` is the
page's own `matchMedia('(prefers-color-scheme: dark)').matches`, confirming
the CDP override reached the page. `store badge img` is the `.store-badge
img`'s resolved `currentSrc` filename — the dark `<picture><source>` swap
still works on both pages. Icons, Smart App Banner meta, `og:image`, brand
mark and store-badge href were re-confirmed unchanged from attempt 1's pass
and are not repeated here.

### Form behaviour, no-JS path (real CDP, `Emulation.setScriptExecutionDisabled`)

Attempt 1's review: with JS off, the form had no `action` and carried
`novalidate`, so the browser's default GET submission sent
`support/?category=…&message=<text>` — the message reached the web host and
browser history, and "Nothing is sent from this page." became false. Fix:
the submit `<button>` now ships `disabled` in the static markup, and only
`feedback.js`'s `init()` clears it. With script execution off, the button
is never enabled, so there is no submittable form at all — no enabled
submit control means neither a click nor an Enter-key implicit submission
can fire a native form submission.

Verified live: `Emulation.setScriptExecutionDisabled({ value: true })`,
then real synthetic input (`Input.dispatchMouseEvent` / `Input.insertText`,
not a script call) — click into the category select, click + type
`LEAK-MARKER-I261` into the message textarea, click the submit button, then
refocus the message field and press Enter:

```json
{
  "submitDisabledBefore": true,
  "submitDisabledAfter": true,
  "typedValueBeforeSubmitAttempt": "LEAK-MARKER-I261",
  "finalLocationHrefAndFormStatus": "http://127.0.0.1:8261/support/||",
  "navEventsDuringInteractions": []
}
```

`navEventsDuringInteractions` is `Page.frameRequestedNavigation` /
`Page.frameNavigated` / `Page.navigatedWithinDocument`, filtered to the
interaction window (after the initial page load) — empty, so neither the
click nor the Enter key produced any navigation, requested or committed;
`location.href` is unchanged and carries no query string, so the marker
never left the textarea. `submitDisabledAfter` stays `true` because
`feedback.js` never ran to clear it.

The previously-empty `[data-support-email-link]` anchor (attempt 1: `href="#"`,
text `…`, filled by script) is corrected here to a **statically-populated**
mailto link — `href="mailto:support@gridtheory.app"`, text
`support@gridtheory.app` — always present in the raw HTML, so it works with
no JS at all, per review's "the plain support@gridtheory.app link still
usable without JS." `feedback.js` still runs the same
`link.href = …; link.textContent = …;` assignment on load (matching the
shared contract's "filled by script"), so JS-enabled visitors see identical,
re-confirmed output.

Deliberate, noted deviation: the shared site contract's "exactly one
occurrence [of the address] in `dist/`" now reads three occurrences of
the literal string on `dist/support/index.html`'s single body line — the
form's `data-support-email` attribute, the fallback anchor's `href`, and
that anchor's text. Counted with `rg -o`, not `rg -n` lines, since the
page body is one physical line, so a line count reads 1 regardless of
how many occurrences it holds:

```
$ rg -o 'support@gridtheory\.app' dist/support/index.html | wc -l
       3

$ rg -n 'support@gridtheory\.app' dist
dist/support/index.html:3:<body><header class="site-header"><a class="brand" href="../" aria-label="GridTheory home"><img class="brand-mark" src="../assets/img/icon/icon-64.png" srcset="../assets/img/icon/icon-128.png 2x" width="29" height="29" alt=""> GridTheory</a><nav aria-label="Primary navigation"><a href="../#features">Features</a><a href="../privacy/">Privacy</a><a href="./">Support</a></nav></header><main class="legal"><p class="eyebrow">GridTheory</p><h1>Support</h1><h2>Need help?</h2><p>Please include the app version, your iPhone or iPad model, and a short description of what happened, or use the form below.</p><h2>Send feedback</h2><form class="feedback-form" id="feedback-form" data-support-email="support@gridtheory.app" novalidate><div class="field"><label for="fb-category">Category</label><select id="fb-category" name="category" required><option value="Bug">Bug</option><option value="Idea">Idea</option><option value="Data issue">Data issue</option><option value="Other">Other</option></select></div><div class="field"><label for="fb-device">Device</label><input id="fb-device" name="device" type="text" autocomplete="off"></div><div class="field"><label for="fb-ios">iOS version</label><input id="fb-ios" name="ios" type="text" autocomplete="off"></div><div class="field"><label for="fb-app-version">App version</label><input id="fb-app-version" name="appVersion" type="text" autocomplete="off"></div><div class="field field--full"><label for="fb-message">Message</label><textarea id="fb-message" name="message" maxlength="1500" required></textarea></div><button class="button" type="submit" disabled>Send feedback</button><p class="form-note">Opens your mail app with a prefilled message to <a class="support-email" data-support-email-link href="mailto:support@gridtheory.app">support@gridtheory.app</a>. Nothing is sent from this page.</p><p class="form-status" role="status" aria-live="polite"></p></form><noscript><p>Sending feedback needs JavaScript enabled in your browser.</p></noscript><h2>Privacy</h2><p>GridTheory does not collect personal information. Read the full <a class="text-link" href="../privacy/">privacy policy</a>.</p></main><footer><div><a class="brand" href="../"><img class="brand-mark" src="../assets/img/icon/icon-64.png" srcset="../assets/img/icon/icon-128.png 2x" width="29" height="29" alt=""> GridTheory</a> <a class="store-badge" href="https://apps.apple.com/app/id6805695204"><picture><source media="(prefers-color-scheme: dark)" srcset="../assets/img/badges/app-store-badge-white.svg"><img src="../assets/img/badges/app-store-badge-black.svg" alt="Download on the App Store" width="120" height="40"></picture></a></div><div class="footer-links"><a href="../privacy/">Privacy policy</a><a href="./">Support</a></div><p class="disclaimer">Unofficial. Not associated with Formula One Licensing BV or the FIA.</p></footer><script src="../assets/feedback.js" defer></script></body></html>
```

Given the address is now real, verified and meant to be public, and the
reviewer explicitly asked for a working no-JS link, this was judged the
safer trade-off over leaving the anchor inert without JS.

### Form behaviour, JS path — repeated empty submit (real CDP, script enabled)

Category defaults to "Bug" (the `<select>`'s first `<option>`), so an empty
*message* is the reachable "both required fields not satisfied" case.
Submitting twice in a row with the message still blank:

```json
{
  "afterFirstSubmit": {
    "status": "Please choose a category and add a message before sending.",
    "activeId": "fb-message",
    "categoryInvalid": null,
    "messageInvalid": "true"
  },
  "afterSecondSubmit": {
    "status": "Please choose a category and add a message before sending.",
    "activeId": "fb-message",
    "mutations": [
      "Please choose a category and add a message before sending.",
      "",
      "Please choose a category and add a message before sending."
    ]
  },
  "navigationEventsDuringSubmits": []
}
```

`messageInvalid` confirms `aria-invalid="true"` lands on the empty field and
`activeId` confirms focus moves to it (review's "move focus to the first
missing field and set aria-invalid"). `mutations` is a `MutationObserver` on
`.form-status` spanning both submits — on the second (identical-text)
submit it recorded clear-then-reset (`"…"` → `""` → `"…"`), not a no-op, so
an `aria-live="polite"` region announces again on repeat (review's "clear
then re-set the status so screen readers re-announce"). No navigation
occurred on either submit.
