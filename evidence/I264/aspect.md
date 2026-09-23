# I264 — aspect-ratio sweep

Viewports: 390, 1024, 1280px. Schemes: light, dark. Pages: /, /support/, /privacy/.
Pass criterion per image: `|(clientW/clientH) / (attrW/attrH) - 1| <= 0.01`, measured on the CONTENT box (`img.clientWidth`/`img.clientHeight`; excludes border/padding). The border-box ratio (`getBoundingClientRect`, includes the border) is also recorded for comparison. Pass criterion per page: `scrollWidth <= innerWidth`.

## before(2ab98b3)

30 image measurements, 6 failing ratio check. 18 page/config checks, 0 failing scroll-width check.

| page | viewport | scheme | src | border box (w x h) | content box (w x h) | attrs (w x h) | border ratio delta | content ratio delta | ok |
|---|---|---|---|---|---|---|---|---|---|
| / | 390 | light | /assets/img/screens/iphone-01-home-overview-480.webp | 285.000 x 2086.000 | 271.000 x 2072.000 | 960 x 2086 | 0.703 | 0.716 | **NO** |
| / | 390 | light | /assets/img/screens/iphone-02-race-weekend-pro-480.webp | 240.000 x 519.141 | 238.000 x 517.000 | 960 x 2086 | 0.005 | 0.000 | yes |
| / | 390 | light | /assets/img/screens/iphone-03-scenario-reorder-480.webp | 240.000 x 519.141 | 238.000 x 517.000 | 960 x 2086 | 0.005 | 0.000 | yes |
| / | 390 | light | /assets/img/screens/ipad-01-home-overview-800.webp | 327.594 x 435.844 | 326.000 x 434.000 | 1600 x 2133 | 0.002 | 0.001 | yes |
| / | 390 | light | /assets/img/screens/ipad-02-race-weekend-pro-800.webp | 327.594 x 435.844 | 326.000 x 434.000 | 1600 x 2133 | 0.002 | 0.001 | yes |
| / | 390 | dark | /assets/img/screens/iphone-01-home-overview-480.webp | 285.000 x 2086.000 | 271.000 x 2072.000 | 960 x 2086 | 0.703 | 0.716 | **NO** |
| / | 390 | dark | /assets/img/screens/iphone-02-race-weekend-pro-480.webp | 240.000 x 519.141 | 238.000 x 517.000 | 960 x 2086 | 0.005 | 0.000 | yes |
| / | 390 | dark | /assets/img/screens/iphone-03-scenario-reorder-480.webp | 240.000 x 519.141 | 238.000 x 517.000 | 960 x 2086 | 0.005 | 0.000 | yes |
| / | 390 | dark | /assets/img/screens/ipad-01-home-overview-800.webp | 327.594 x 435.844 | 326.000 x 434.000 | 1600 x 2133 | 0.002 | 0.001 | yes |
| / | 390 | dark | /assets/img/screens/ipad-02-race-weekend-pro-800.webp | 327.594 x 435.844 | 326.000 x 434.000 | 1600 x 2133 | 0.002 | 0.001 | yes |
| / | 1024 | light | /assets/img/screens/iphone-01-home-overview-480.webp | 350.000 x 2086.000 | 336.000 x 2072.000 | 960 x 2086 | 0.635 | 0.648 | **NO** |
| / | 1024 | light | /assets/img/screens/iphone-02-race-weekend-pro-480.webp | 240.000 x 519.141 | 238.000 x 517.000 | 960 x 2086 | 0.005 | 0.000 | yes |
| / | 1024 | light | /assets/img/screens/iphone-03-scenario-reorder-480.webp | 240.000 x 519.141 | 238.000 x 517.000 | 960 x 2086 | 0.005 | 0.000 | yes |
| / | 1024 | light | /assets/img/screens/ipad-01-home-overview-800.webp | 380.000 x 505.672 | 378.000 x 504.000 | 1600 x 2133 | 0.002 | 0.000 | yes |
| / | 1024 | light | /assets/img/screens/ipad-02-race-weekend-pro-800.webp | 380.000 x 505.672 | 378.000 x 504.000 | 1600 x 2133 | 0.002 | 0.000 | yes |
| / | 1024 | dark | /assets/img/screens/iphone-01-home-overview-480.webp | 350.000 x 2086.000 | 336.000 x 2072.000 | 960 x 2086 | 0.635 | 0.648 | **NO** |
| / | 1024 | dark | /assets/img/screens/iphone-02-race-weekend-pro-480.webp | 240.000 x 519.141 | 238.000 x 517.000 | 960 x 2086 | 0.005 | 0.000 | yes |
| / | 1024 | dark | /assets/img/screens/iphone-03-scenario-reorder-480.webp | 240.000 x 519.141 | 238.000 x 517.000 | 960 x 2086 | 0.005 | 0.000 | yes |
| / | 1024 | dark | /assets/img/screens/ipad-01-home-overview-800.webp | 380.000 x 505.672 | 378.000 x 504.000 | 1600 x 2133 | 0.002 | 0.000 | yes |
| / | 1024 | dark | /assets/img/screens/ipad-02-race-weekend-pro-800.webp | 380.000 x 505.672 | 378.000 x 504.000 | 1600 x 2133 | 0.002 | 0.000 | yes |
| / | 1280 | light | /assets/img/screens/iphone-01-home-overview-480.webp | 350.000 x 2086.000 | 336.000 x 2072.000 | 960 x 2086 | 0.635 | 0.648 | **NO** |
| / | 1280 | light | /assets/img/screens/iphone-02-race-weekend-pro-480.webp | 240.000 x 519.141 | 238.000 x 517.000 | 960 x 2086 | 0.005 | 0.000 | yes |
| / | 1280 | light | /assets/img/screens/iphone-03-scenario-reorder-480.webp | 240.000 x 519.141 | 238.000 x 517.000 | 960 x 2086 | 0.005 | 0.000 | yes |
| / | 1280 | light | /assets/img/screens/ipad-01-home-overview-800.webp | 380.000 x 505.672 | 378.000 x 504.000 | 1600 x 2133 | 0.002 | 0.000 | yes |
| / | 1280 | light | /assets/img/screens/ipad-02-race-weekend-pro-800.webp | 380.000 x 505.672 | 378.000 x 504.000 | 1600 x 2133 | 0.002 | 0.000 | yes |
| / | 1280 | dark | /assets/img/screens/iphone-01-home-overview-480.webp | 350.000 x 2086.000 | 336.000 x 2072.000 | 960 x 2086 | 0.635 | 0.648 | **NO** |
| / | 1280 | dark | /assets/img/screens/iphone-02-race-weekend-pro-480.webp | 240.000 x 519.141 | 238.000 x 517.000 | 960 x 2086 | 0.005 | 0.000 | yes |
| / | 1280 | dark | /assets/img/screens/iphone-03-scenario-reorder-480.webp | 240.000 x 519.141 | 238.000 x 517.000 | 960 x 2086 | 0.005 | 0.000 | yes |
| / | 1280 | dark | /assets/img/screens/ipad-01-home-overview-800.webp | 380.000 x 505.672 | 378.000 x 504.000 | 1600 x 2133 | 0.002 | 0.000 | yes |
| / | 1280 | dark | /assets/img/screens/ipad-02-race-weekend-pro-800.webp | 380.000 x 505.672 | 378.000 x 504.000 | 1600 x 2133 | 0.002 | 0.000 | yes |

| page | viewport | scheme | scrollWidth | innerWidth | ok |
|---|---|---|---|---|---|
| / | 390 | light | 390 | 390 | yes |
| /support/ | 390 | light | 390 | 390 | yes |
| /privacy/ | 390 | light | 390 | 390 | yes |
| / | 390 | dark | 390 | 390 | yes |
| /support/ | 390 | dark | 390 | 390 | yes |
| /privacy/ | 390 | dark | 390 | 390 | yes |
| / | 1024 | light | 1024 | 1024 | yes |
| /support/ | 1024 | light | 1024 | 1024 | yes |
| /privacy/ | 1024 | light | 1024 | 1024 | yes |
| / | 1024 | dark | 1024 | 1024 | yes |
| /support/ | 1024 | dark | 1024 | 1024 | yes |
| /privacy/ | 1024 | dark | 1024 | 1024 | yes |
| / | 1280 | light | 1280 | 1280 | yes |
| /support/ | 1280 | light | 1280 | 1280 | yes |
| /privacy/ | 1280 | light | 1280 | 1280 | yes |
| / | 1280 | dark | 1280 | 1280 | yes |
| /support/ | 1280 | dark | 1280 | 1280 | yes |
| /privacy/ | 1280 | dark | 1280 | 1280 | yes |

**Failing rows quoted:**

- `before(2ab98b3)` / @ 390px, light: `/assets/img/screens/iphone-01-home-overview-480.webp` content box 271.000x2072.000 (ratio 0.131) vs attrs 960x2086 (ratio 0.460), delta 0.716.
- `before(2ab98b3)` / @ 390px, dark: `/assets/img/screens/iphone-01-home-overview-480.webp` content box 271.000x2072.000 (ratio 0.131) vs attrs 960x2086 (ratio 0.460), delta 0.716.
- `before(2ab98b3)` / @ 1024px, light: `/assets/img/screens/iphone-01-home-overview-480.webp` content box 336.000x2072.000 (ratio 0.162) vs attrs 960x2086 (ratio 0.460), delta 0.648.
- `before(2ab98b3)` / @ 1024px, dark: `/assets/img/screens/iphone-01-home-overview-480.webp` content box 336.000x2072.000 (ratio 0.162) vs attrs 960x2086 (ratio 0.460), delta 0.648.
- `before(2ab98b3)` / @ 1280px, light: `/assets/img/screens/iphone-01-home-overview-480.webp` content box 336.000x2072.000 (ratio 0.162) vs attrs 960x2086 (ratio 0.460), delta 0.648.
- `before(2ab98b3)` / @ 1280px, dark: `/assets/img/screens/iphone-01-home-overview-480.webp` content box 336.000x2072.000 (ratio 0.162) vs attrs 960x2086 (ratio 0.460), delta 0.648.

## after(fix)

30 image measurements, 0 failing ratio check. 18 page/config checks, 0 failing scroll-width check.

| page | viewport | scheme | src | border box (w x h) | content box (w x h) | attrs (w x h) | border ratio delta | content ratio delta | ok |
|---|---|---|---|---|---|---|---|---|---|
| / | 390 | light | /assets/img/screens/iphone-01-home-overview-480.webp | 285.000 x 602.859 | 271.000 x 589.000 | 960 x 2086 | 0.027 | 0.000 | yes |
| / | 390 | light | /assets/img/screens/iphone-02-race-weekend-pro-480.webp | 240.000 x 519.141 | 238.000 x 517.000 | 960 x 2086 | 0.005 | 0.000 | yes |
| / | 390 | light | /assets/img/screens/iphone-03-scenario-reorder-480.webp | 240.000 x 519.141 | 238.000 x 517.000 | 960 x 2086 | 0.005 | 0.000 | yes |
| / | 390 | light | /assets/img/screens/ipad-01-home-overview-800.webp | 327.594 x 435.844 | 326.000 x 434.000 | 1600 x 2133 | 0.002 | 0.001 | yes |
| / | 390 | light | /assets/img/screens/ipad-02-race-weekend-pro-800.webp | 327.594 x 435.844 | 326.000 x 434.000 | 1600 x 2133 | 0.002 | 0.001 | yes |
| / | 390 | dark | /assets/img/screens/iphone-01-home-overview-480.webp | 285.000 x 602.859 | 271.000 x 589.000 | 960 x 2086 | 0.027 | 0.000 | yes |
| / | 390 | dark | /assets/img/screens/iphone-02-race-weekend-pro-480.webp | 240.000 x 519.141 | 238.000 x 517.000 | 960 x 2086 | 0.005 | 0.000 | yes |
| / | 390 | dark | /assets/img/screens/iphone-03-scenario-reorder-480.webp | 240.000 x 519.141 | 238.000 x 517.000 | 960 x 2086 | 0.005 | 0.000 | yes |
| / | 390 | dark | /assets/img/screens/ipad-01-home-overview-800.webp | 327.594 x 435.844 | 326.000 x 434.000 | 1600 x 2133 | 0.002 | 0.001 | yes |
| / | 390 | dark | /assets/img/screens/ipad-02-race-weekend-pro-800.webp | 327.594 x 435.844 | 326.000 x 434.000 | 1600 x 2133 | 0.002 | 0.001 | yes |
| / | 1024 | light | /assets/img/screens/iphone-01-home-overview-480.webp | 350.000 x 744.094 | 336.000 x 730.000 | 960 x 2086 | 0.022 | 0.000 | yes |
| / | 1024 | light | /assets/img/screens/iphone-02-race-weekend-pro-480.webp | 240.000 x 519.141 | 238.000 x 517.000 | 960 x 2086 | 0.005 | 0.000 | yes |
| / | 1024 | light | /assets/img/screens/iphone-03-scenario-reorder-480.webp | 240.000 x 519.141 | 238.000 x 517.000 | 960 x 2086 | 0.005 | 0.000 | yes |
| / | 1024 | light | /assets/img/screens/ipad-01-home-overview-800.webp | 380.000 x 505.672 | 378.000 x 504.000 | 1600 x 2133 | 0.002 | 0.000 | yes |
| / | 1024 | light | /assets/img/screens/ipad-02-race-weekend-pro-800.webp | 380.000 x 505.672 | 378.000 x 504.000 | 1600 x 2133 | 0.002 | 0.000 | yes |
| / | 1024 | dark | /assets/img/screens/iphone-01-home-overview-480.webp | 350.000 x 744.094 | 336.000 x 730.000 | 960 x 2086 | 0.022 | 0.000 | yes |
| / | 1024 | dark | /assets/img/screens/iphone-02-race-weekend-pro-480.webp | 240.000 x 519.141 | 238.000 x 517.000 | 960 x 2086 | 0.005 | 0.000 | yes |
| / | 1024 | dark | /assets/img/screens/iphone-03-scenario-reorder-480.webp | 240.000 x 519.141 | 238.000 x 517.000 | 960 x 2086 | 0.005 | 0.000 | yes |
| / | 1024 | dark | /assets/img/screens/ipad-01-home-overview-800.webp | 380.000 x 505.672 | 378.000 x 504.000 | 1600 x 2133 | 0.002 | 0.000 | yes |
| / | 1024 | dark | /assets/img/screens/ipad-02-race-weekend-pro-800.webp | 380.000 x 505.672 | 378.000 x 504.000 | 1600 x 2133 | 0.002 | 0.000 | yes |
| / | 1280 | light | /assets/img/screens/iphone-01-home-overview-480.webp | 350.000 x 744.094 | 336.000 x 730.000 | 960 x 2086 | 0.022 | 0.000 | yes |
| / | 1280 | light | /assets/img/screens/iphone-02-race-weekend-pro-480.webp | 240.000 x 519.141 | 238.000 x 517.000 | 960 x 2086 | 0.005 | 0.000 | yes |
| / | 1280 | light | /assets/img/screens/iphone-03-scenario-reorder-480.webp | 240.000 x 519.141 | 238.000 x 517.000 | 960 x 2086 | 0.005 | 0.000 | yes |
| / | 1280 | light | /assets/img/screens/ipad-01-home-overview-800.webp | 380.000 x 505.672 | 378.000 x 504.000 | 1600 x 2133 | 0.002 | 0.000 | yes |
| / | 1280 | light | /assets/img/screens/ipad-02-race-weekend-pro-800.webp | 380.000 x 505.672 | 378.000 x 504.000 | 1600 x 2133 | 0.002 | 0.000 | yes |
| / | 1280 | dark | /assets/img/screens/iphone-01-home-overview-480.webp | 350.000 x 744.094 | 336.000 x 730.000 | 960 x 2086 | 0.022 | 0.000 | yes |
| / | 1280 | dark | /assets/img/screens/iphone-02-race-weekend-pro-480.webp | 240.000 x 519.141 | 238.000 x 517.000 | 960 x 2086 | 0.005 | 0.000 | yes |
| / | 1280 | dark | /assets/img/screens/iphone-03-scenario-reorder-480.webp | 240.000 x 519.141 | 238.000 x 517.000 | 960 x 2086 | 0.005 | 0.000 | yes |
| / | 1280 | dark | /assets/img/screens/ipad-01-home-overview-800.webp | 380.000 x 505.672 | 378.000 x 504.000 | 1600 x 2133 | 0.002 | 0.000 | yes |
| / | 1280 | dark | /assets/img/screens/ipad-02-race-weekend-pro-800.webp | 380.000 x 505.672 | 378.000 x 504.000 | 1600 x 2133 | 0.002 | 0.000 | yes |

| page | viewport | scheme | scrollWidth | innerWidth | ok |
|---|---|---|---|---|---|
| / | 390 | light | 390 | 390 | yes |
| /support/ | 390 | light | 390 | 390 | yes |
| /privacy/ | 390 | light | 390 | 390 | yes |
| / | 390 | dark | 390 | 390 | yes |
| /support/ | 390 | dark | 390 | 390 | yes |
| /privacy/ | 390 | dark | 390 | 390 | yes |
| / | 1024 | light | 1024 | 1024 | yes |
| /support/ | 1024 | light | 1024 | 1024 | yes |
| /privacy/ | 1024 | light | 1024 | 1024 | yes |
| / | 1024 | dark | 1024 | 1024 | yes |
| /support/ | 1024 | dark | 1024 | 1024 | yes |
| /privacy/ | 1024 | dark | 1024 | 1024 | yes |
| / | 1280 | light | 1280 | 1280 | yes |
| /support/ | 1280 | light | 1280 | 1280 | yes |
| /privacy/ | 1280 | light | 1280 | 1280 | yes |
| / | 1280 | dark | 1280 | 1280 | yes |
| /support/ | 1280 | dark | 1280 | 1280 | yes |
| /privacy/ | 1280 | dark | 1280 | 1280 | yes |

