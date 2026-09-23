# I262 browser pass (headless Chrome via CDP)

Safari's Smart App Banner (`apple-itunes-app` meta) only renders in Mobile Safari on iOS; it cannot be exercised in desktop Chrome, headless or otherwise. Not faked here — confirmed only that the meta tag itself is present and correct (separate `rg` check).

## index

- 390px, light: body background `rgb(245, 247, 246)`, text `rgb(26, 28, 46)`, no horizontal overflow: **true** (scrollWidth 390 vs clientWidth 390)
- 390px, dark: body background `rgb(26, 28, 46)`, text `rgb(245, 247, 246)`, no horizontal overflow: **true** (scrollWidth 390 vs clientWidth 390)
- 1280px, light: body background `rgb(245, 247, 246)`, text `rgb(26, 28, 46)`, no horizontal overflow: **true** (scrollWidth 1280 vs clientWidth 1280)
- 1280px, dark: body background `rgb(26, 28, 46)`, text `rgb(245, 247, 246)`, no horizontal overflow: **true** (scrollWidth 1280 vs clientWidth 1280)

## support

- 390px, light: body background `rgb(245, 247, 246)`, text `rgb(26, 28, 46)`, no horizontal overflow: **true** (scrollWidth 390 vs clientWidth 390)
- 390px, dark: body background `rgb(26, 28, 46)`, text `rgb(245, 247, 246)`, no horizontal overflow: **true** (scrollWidth 390 vs clientWidth 390)
- 1280px, light: body background `rgb(245, 247, 246)`, text `rgb(26, 28, 46)`, no horizontal overflow: **true** (scrollWidth 1280 vs clientWidth 1280)
- 1280px, dark: body background `rgb(26, 28, 46)`, text `rgb(245, 247, 246)`, no horizontal overflow: **true** (scrollWidth 1280 vs clientWidth 1280)

## privacy

- 390px, light: body background `rgb(245, 247, 246)`, text `rgb(26, 28, 46)`, no horizontal overflow: **true** (scrollWidth 390 vs clientWidth 390)
- 390px, dark: body background `rgb(26, 28, 46)`, text `rgb(245, 247, 246)`, no horizontal overflow: **true** (scrollWidth 390 vs clientWidth 390)
- 1280px, light: body background `rgb(245, 247, 246)`, text `rgb(26, 28, 46)`, no horizontal overflow: **true** (scrollWidth 1280 vs clientWidth 1280)
- 1280px, dark: body background `rgb(26, 28, 46)`, text `rgb(245, 247, 246)`, no horizontal overflow: **true** (scrollWidth 1280 vs clientWidth 1280)

## Gallery track scroll (390px, index)

Track is scrollable (`scrollWidth 1241 > clientWidth 390`): **true**

Before scroll: `scrollLeft=20`, first visible shot: "Race weekend, with Pro session countdowns."

After `scrollBy({left:400})`: `scrollLeft=544`, first visible shot: "The same screen, full-size on iPad."

scrollLeft actually moved: **true**

## No-JS check (support page, `Emulation.setScriptExecutionDisabled`)

Submit button stays `disabled` (feedback.js never ran to enable it): **true**

Static fallback `mailto:` link works without JS: href `mailto:support@gridtheory.app`, text "support@gridtheory.app"

## Feedback form mailto (JS enabled, form filled, submit clicked)

Captured via `Page.frameRequestedNavigation` (never followed, `Page.stopLoading` sent immediately after): `mailto:support@gridtheory.app?subject=GridTheory%20feedback%3A%20Bug&body=Category%3A%20Bug%0ADevice%3A%20(not%20given)%0AiOS%20version%3A%20(not%20given)%0AApp%20version%3A%20(not%20given)%0A%0AMessage%3A%0ATest%20message%20from%20I262.`

