# I261 — mailto URL, worked example

`buildFeedbackMailto` from `dist/assets/feedback.js`, called directly under
Node (no browser, no network) with:

- address: `support@gridtheory.app` (the form's `data-support-email`)
- category: `Data issue`
- device: `iPhone 17 Pro`
- iOS version: `26.0`
- app version: `1.1`
- message: `Points & odds? 100%`

## Built URL (exact, `encodeURIComponent` applied to the address, subject and
body — matching what `feedback.js` sets as `location.href`)

```
mailto:support%40gridtheory.app?subject=GridTheory%20feedback%3A%20Data%20issue&body=Category%3A%20Data%20issue%0ADevice%3A%20iPhone%2017%20Pro%0AiOS%20version%3A%2026.0%0AApp%20version%3A%201.1%0A%0AMessage%3A%0APoints%20%26%20odds%3F%20100%25
```

## Decoded

- To: `support@gridtheory.app`
- Subject: `GridTheory feedback: Data issue`
- Body:
  ```
  Category: Data issue
  Device: iPhone 17 Pro
  iOS version: 26.0
  App version: 1.1

  Message:
  Points & odds? 100%
  ```

Every field is on its own labelled line, the message is verbatim (including
`&`, `?`, `%`, which round-trip correctly through `encodeURIComponent`/
`decodeURIComponent`), and the subject matches `GridTheory feedback: Data
issue`. The URL was only decoded and inspected here — never opened, so no
mail app was launched and no message was sent.

## Method

Node `v24.19.0`, `require()`-ing `dist/assets/feedback.js` directly (the
file guards its `module.exports` with `typeof module !== "undefined"`, so
the same file runs unmodified in the browser and under Node). A stub
`document`/`window` (both effectively no-ops, since there is no
`feedback-form` element) prevents `init()` from throwing; `buildFeedbackMailto`
itself takes no DOM input, only the plain `address`/`fields` values shown
above, and does not touch the network (`fetch`/`XMLHttpRequest`/
`sendBeacon`/`WebSocket`/dynamic `import()` all absent from the file).
