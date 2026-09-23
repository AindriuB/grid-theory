# I262 — fixes applied to `dist/`

One fix, clearing the header/footer-consistency acceptance item.

## `dist/index.html` — footer brand/badge column drift

**Item cleared:** "The `<header>` element and the footer's brand/badge column
are identical across the three pages once the `../` prefix is normalised."

**Before:** the index page's footer put a tagline paragraph between the
brand link and the store badge —
`</a><p>Championship odds &amp; scenarios.</p><a class="store-badge" …>` —
that neither `support/index.html` nor `privacy/index.html` had; those two
pages go straight from the brand link to the store badge, separated only by
a single space (`</a> <a class="store-badge" …>`).

This was real drift, not a `../`-depth artefact: once every `href`/`src`/
`srcset` on all three footers is resolved to a canonical absolute path (see
`evidence/I262/chrome-diff.md`), the index page's first footer column still
differed from the other two because of this extra paragraph.

Two of three pages agreed on the no-tagline form, and nothing in the Shared
site contract's "Store badge" bullet calls for a tagline in the footer's
first column (only in the hero, where `.availability` already carried body
copy) — so the fix brings `index.html` in line with `support/index.html` and
`privacy/index.html` rather than the other way round.

**After:** removed the `<p>Championship odds &amp; scenarios.</p>` and
replaced it with the same single space the other two pages use between the
brand link and the store badge. No other markup, class, or copy touched.

## Note: the forbidden-string sweep is not a `dist/` defect

`rg -n -i 'f4c95d|ff715b|090c18|data:image|Coming soon|brand-mark">GT|home-overview' dist`
does return two lines — both are the `iphone-01-home-overview-{480,960}.webp`
and `ipad-01-home-overview-{800,1600}.webp` filenames in `index.html`'s hero
and gallery `srcset`s. These are not a leftover placeholder: they are the
exact filenames the Shared site contract's "Asset paths" section specifies
(`screens/iphone-01-home-overview-{480,960}.webp`,
`screens/ipad-01-home-overview-{800,1600}.webp`), produced by I258 and
consumed correctly by I260.

The bare `home-overview` substring in this item's regex was carried over
from I260's own (now-retired) acceptance check, which forbade
`home-overview.png` — the single flat pre-gallery asset I260 deleted when it
replaced the placeholder hero with the real screenshot gallery. Dropping the
`.png` suffix when this task's acceptance list condensed several retired
checks into one line made the pattern also match the current, correct,
contract-mandated `.webp` filenames. Renaming or removing those references
to make this line return nothing would violate this task's own
"byte-identical" constraint on `dist/assets/img/**` and the Shared site
contract's asset paths, for no real benefit — so no `dist/` change was made
here; this is flagged as a check-definition issue rather than a site defect.
