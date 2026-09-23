# I259 — palette and contrast evidence

## Tokens

`:root` declares `color-scheme: light dark`. Light values live in `:root`;
dark values live under `@media (prefers-color-scheme: dark) { :root { ... } }`.

| token | light | dark |
|---|---|---|
| `--bg` | `#F5F7F6` | `#1A1C2E` |
| `--fg` (body text) | `#1A1C2E` | `#F5F7F6` |
| `--accent` (text/foreground use) | `#005F73` | `#3ECFC0` |
| `--accent-fill` (button fill, both modes) | `#005F73` | `#005F73` |
| `--panel` | `rgba(26, 28, 46, 0.05)` | `rgba(245, 247, 246, 0.06)` |
| `--line` | `rgba(26, 28, 46, 0.12)` | `rgba(245, 247, 246, 0.16)` |
| `--muted` | `rgba(26, 28, 46, 0.66)` | `rgba(245, 247, 246, 0.58)` |
| `--focus` | `#005F73` | `#3ECFC0` |
| `--accent-glow` | `rgba(0, 95, 115, 0.22)` | `rgba(62, 207, 192, 0.22)` |
| `--shadow` | `rgba(26, 28, 46, 0.55)` | `rgba(0, 0, 0, 0.55)` |

`--panel`, `--line`, `--muted`, `--accent-glow` are rgba/alpha forms of the
contract's own navy (`#1A1C2E`), off-white (`#F5F7F6`) or accent hex values,
so no exception is needed for them. `--accent`, `--accent-fill` and `--focus`
are always exactly one of the contract's four palette hex values.

## Exceptions (literal, non-token colours)

- `--accent-fill-ink: #FFFFFF` (white). The contract text explicitly
  requires "filled buttons stay `#005F73` with white text in both modes" —
  white itself is not one of the four palette hex values, so it is listed
  here per the acceptance criterion's own escape hatch. Used only as the
  button's text colour.
- `--shadow` in dark mode: `rgba(0, 0, 0, 0.55)` (literal black, not derived
  from a contract hex). The light-mode shadow is `rgba(26, 28, 46, 0.55)` —
  an alpha form of the contract navy — but that same navy shadow is
  invisible against the dark mode's navy (`#1A1C2E`) background, so dark
  mode falls back to a low-alpha black. It only ever appears as a soft drop
  shadow behind `.hero-art img`; it never carries text or a UI boundary.

## Contrast ratios (computed from the hex values, WCAG relative-luminance formula)

| pair | mode | ratio | passes 4.5:1 |
|---|---|---|---|
| body text `#1A1C2E` on background `#F5F7F6` | light | 15.62 : 1 | yes |
| body text `#F5F7F6` on background `#1A1C2E` | dark | 15.62 : 1 | yes |
| accent-as-text `#005F73` on background `#F5F7F6` | light | 6.77 : 1 | yes |
| accent-as-text `#3ECFC0` on background `#1A1C2E` | dark | 8.72 : 1 | yes |
| muted text (`rgba(26,28,46,.66)` composited → `#646672`) on `#F5F7F6` | light | 5.30 : 1 | yes |
| muted text (`rgba(245,247,246,.58)` composited → `#999ba2`) on `#1A1C2E` | dark | 6.05 : 1 | yes |
| white `#FFFFFF` on filled-button `#005F73` | both | 7.28 : 1 | yes |

Every pair clears 4.5:1 with margin. The muted-text alpha values (`.66`
light, `.58` dark) were chosen by searching downward from full-strength
text until the composited colour's contrast against the page background
dropped below roughly 5:1, so there is headroom before the 4.5:1 floor.

Computation method: standard WCAG 2 relative luminance,
`L = 0.2126R + 0.7152G + 0.0722B` on linearised sRGB channels, ratio
`(L1 + 0.05) / (L2 + 0.05)` with L1 the lighter of the pair. Script used to
compute the above (not committed, scratchpad-only):
`contrast.py` in this task's scratchpad, run with `python3`.

## App Store badge minimum size

`.store-badge img` is set to `height: 44px; width: auto;` (aspect ratio
preserved from the image's own intrinsic size).

Source (checked 2026-09-23): Apple Developer, "Marketing Resources and
Identity Guidelines" → App Store Badges → Graphic Standards,
<https://developer.apple.com/app-store/marketing/guidelines/>: "Minimum
badge height is 10 mm for use in printed materials and 40 px for use
onscreen." 44 px is used here to sit above that 40 px floor while still
reading as an inline element next to body copy. `.store-badge` and
`.store-badge img` never set `filter`, `opacity` below `1`, `transform`, or
a `background`/`border` on the image — the artwork is shown exactly as
supplied, per the same guidelines' badge-use rules (don't modify, angle, or
animate the badge).

## Button hover (fixed after review)

`.button:hover` originally swapped the fill to `var(--accent)`, which is
`#3ECFC0` in dark mode — white text on that fill is 1.93:1, well under the
4.5:1 floor, and also equalled the fill in light mode so hover gave no
feedback there either. Fixed to leave `background`/`color` untouched on
hover (`--accent-fill` `#005F73` with white text stays exactly as in the
contrast table above, both modes) and give feedback with
`box-shadow: 0 10px 24px var(--accent-glow); transform: translateY(-1px);`
instead — glow colour already varies correctly by mode via `--accent-glow`,
and neither property touches the text/fill colours the contrast row covers.
