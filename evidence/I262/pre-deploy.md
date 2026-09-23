# I262 — pre-deploy checklist (do this, in order, immediately before pushing)

Every acceptance item in this task's own checks passes as of this branch's
commits, with one waived item — the forbidden-string check's bare
`home-overview` substring also matches the contract-mandated `.webp`
screenshot filenames; see `evidence/I262/fixes.md` ("Note: the forbidden-
string sweep is not a `dist/` defect") for why that is not a site defect.
Captured `html-validate` output is in `evidence/I262/html-validate.md`.
Nothing has been pushed — `main` on the remote is untouched. These are the
steps only the user can do, right before pushing, because they depend on
the actual push date and on live devices/services this task cannot reach.

1. **Confirm the privacy policy's effective date matches the day of push.**
   `dist/privacy/index.html` currently reads `Effective 23 September 2026`
   (set by I263 on its own commit day, 2026-09-23). If you push on a
   different day, edit that one string first — nothing else in the privacy
   policy — to the actual push date, then commit that change before pushing.
   Check with:
   ```
   rg -o 'Effective [0-9A-Za-z ]+' dist/privacy/index.html
   ```

2. **Re-run the placeholder and stray-address greps** (this task's checks
   already pass, but re-run them after step 1's edit, if any, to be sure
   nothing regressed):
   ```
   rg -n 'gridtheory\.invalid' dist
   rg -o -i '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}' dist | rg -v 'support@gridtheory\.app'
   ```
   Both must return nothing. (The general address grep already covers any
   stray mailbox; it is not repeated as a provider/fragment-specific search
   here, so nothing about the private forwarding address is ever written
   into this checklist or its evidence.)

3. **Push `main`.** This is the only thing that triggers a deploy — the
   GitHub Pages workflow runs on push to `main`, and no task has pushed.

4. **Confirm the Pages run succeeded** (Actions tab, or `gh run list`).

5. **Purge the Cloudflare cache.** Cloudflare → the `gridtheory.app` zone →
   Caching → Configuration → **Purge Everything**. Do this after the Pages
   run in step 4 succeeds and before any of the live checks below — the
   zone can otherwise keep serving the previous deploy's HTML/CSS/JS for a
   while after Pages has already updated.

6. **Live checks, in Mobile Safari on a real iPhone** (desktop Chrome cannot
   exercise the Smart App Banner):
   - `https://gridtheory.app` — confirm the Smart App Banner appears at the
     top of the page. The `apple-itunes-app` meta is in place and verified
     in this task's checks, but the banner itself only renders in Mobile
     Safari, so this is the one visual confirmation that has to happen on a
     real device, after the push and the cache purge.
   - `https://gridtheory.app/privacy/` — confirm the visible `Effective
     <date>` string matches the day of push (step 1).
   - `https://gridtheory.app/support/` — confirm the feedback form composes
     a `mailto:` to `support@gridtheory.app` when submitted, and that the
     visible no-JS fallback `mailto:` link is present and points to the
     same address.

7. **Apple badge source note (from I258, still true, nothing to redo):**
   both `dist/assets/img/badges/app-store-badge-{black,white}.svg` are
   Apple's official "Download on the App Store" artwork, fetched unmodified
   from Apple's App Store Marketing Tools on 2026-09-23 (see
   `evidence/I258/badge-source.md` for the exact source URLs and sha256
   hashes). This task re-verified both files in `dist/` still match those
   hashes byte-for-byte — no re-fetch or re-approval needed before pushing.
