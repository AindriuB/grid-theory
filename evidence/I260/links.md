# I260 — local link/asset resolution check

Every `src`/`srcset`/`href` in `dist/index.html` that is not `https://…` or a
`#fragment`, and the file it resolves to under `dist/`.

| Reference | Resolves to |
|---|---|
| `./` | `dist/index.html` (self) |
| `assets/site.css` | `dist/assets/site.css` |
| `assets/img/icon/icon-32.png` | `dist/assets/img/icon/icon-32.png` |
| `assets/img/icon/icon-64.png` | `dist/assets/img/icon/icon-64.png` |
| `assets/img/icon/icon-128.png` | `dist/assets/img/icon/icon-128.png` |
| `assets/img/icon/icon-180.png` | `dist/assets/img/icon/icon-180.png` |
| `assets/img/badges/app-store-badge-black.svg` | `dist/assets/img/badges/app-store-badge-black.svg` |
| `assets/img/badges/app-store-badge-white.svg` | `dist/assets/img/badges/app-store-badge-white.svg` |
| `assets/img/screens/iphone-01-home-overview-480.webp` | `dist/assets/img/screens/iphone-01-home-overview-480.webp` |
| `assets/img/screens/iphone-01-home-overview-960.webp` | `dist/assets/img/screens/iphone-01-home-overview-960.webp` |
| `assets/img/screens/iphone-02-race-weekend-pro-480.webp` | `dist/assets/img/screens/iphone-02-race-weekend-pro-480.webp` |
| `assets/img/screens/iphone-02-race-weekend-pro-960.webp` | `dist/assets/img/screens/iphone-02-race-weekend-pro-960.webp` |
| `assets/img/screens/iphone-03-scenario-reorder-480.webp` | `dist/assets/img/screens/iphone-03-scenario-reorder-480.webp` |
| `assets/img/screens/iphone-03-scenario-reorder-960.webp` | `dist/assets/img/screens/iphone-03-scenario-reorder-960.webp` |
| `assets/img/screens/ipad-01-home-overview-800.webp` | `dist/assets/img/screens/ipad-01-home-overview-800.webp` |
| `assets/img/screens/ipad-01-home-overview-1600.webp` | `dist/assets/img/screens/ipad-01-home-overview-1600.webp` |
| `assets/img/screens/ipad-02-race-weekend-pro-800.webp` | `dist/assets/img/screens/ipad-02-race-weekend-pro-800.webp` |
| `assets/img/screens/ipad-02-race-weekend-pro-1600.webp` | `dist/assets/img/screens/ipad-02-race-weekend-pro-1600.webp` |
| `privacy/` | `dist/privacy/index.html` |
| `support/` | `dist/support/index.html` |

All 19 references resolve. Verified by parsing `dist/index.html` for
`src=`/`href=`/`srcset=` values with a Python script and checking each
non-`https://`, non-`#` path exists under `dist/`.
