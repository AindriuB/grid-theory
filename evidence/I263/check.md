# I263 — evidence

Branch sha: `task/I263-privacy-support-disclosure` branched from local
`main` at `1a9c5ed7c447f200ea127ddcf2dfdcb86a961fed` (I261 merge sha, base
`e84ed74`), confirmed with `git log -1 --format='%H' main` before creating
the worktree. All checks below (byte-identical prefix/suffix/sections,
`git diff --stat`) compare against this same sha.

## Attempt 2 — changes from reviewer feedback + scope extension

Attempt 1 (`3874c48`) passed the tester (20/20) but the reviewer flagged
one overstated claim, and the same review round brought a scope extension
for the Jolpica sentence. Both are applied on top of `3874c48`, on the
same branch:

1. **Contacting support — "never to sell it, share it" was untrue as
   written.** A support email is necessarily relayed and stored by email
   services outside our control. The sentence now reads "We do not sell
   it, share it, or use it for marketing, except with the email services
   that deliver and store it" — no provider is named, and "Cloudflare"
   still never appears in the email text.
2. **What an email carries, restated per the reviewer's suggestion:**
   "we receive your name and email address as your mail app sends them,
   your message, and anything you include" (previously "your email
   address, your message, and anything else you choose to add").
3. **Restored the privacy-questions/deletion clause:** the closing
   sentence now reads "privacy questions or deletion requests can be sent
   to the same address" (previously only covered deletion).
4. **Scope extension — Jolpica sentence (exactly one sentence, in
   "Information GridTheory uses"):** "These requests contain no
   information that identifies you" understated the exposure — like any
   internet request, the requests expose the device's IP address to the
   provider. Reworded to: "These requests carry no account or personal
   details, but, as with any internet request, the provider can see the
   device's IP address." No link to a Jolpica privacy policy was added —
   see "Jolpica privacy-policy check" below for why.

Every check from attempt 1 was re-run below against the current content;
sections whose text changed (Support, the Jolpica sentence, the
byte-identical-sections diff, the screenshots) are re-verified and
re-captured, not just re-asserted.

## Jolpica privacy-policy check (one HEAD request, per the scope extension)

`api.jolpi.ca` is the app's only Jolpica origin
(`Sources/ClientPlatform/Provider/Live/JolpicaEndpoints.swift:17`); its
public site is `jolpi.ca`. A single `curl -I https://jolpi.ca/privacy`
returned `200`. Before trusting that as evidence of a real privacy-policy
page, a second HEAD request to a deliberately nonsense path,
`curl -I https://jolpi.ca/this-definitely-does-not-exist-xyz123`, also
returned `200` — the site is a client-rendered SPA with a catch-all route
that returns `200` for any path, so a `200` at `/privacy` does not show a
privacy policy exists there. No other Jolpica URL was checked. Per the
scope extension ("link the provider's privacy policy only if one exists"),
no link was added — linking an unverified page would itself overstate
what's true.

Commit day: 23 September 2026. If the user pushes on a later day, the
`Effective 23 September 2026` string in `dist/privacy/index.html` is the
only thing that needs to change — I262's pre-deploy checklist should carry
this note.

All `rg` commands below were run from the `grid-theory` repo root inside
this task's worktree.

## Provider privacy-policy URLs (canonical, verified with a single HEAD request)

- GitHub: `https://docs.github.com/en/site-policy/privacy-policies/github-privacy-statement`
  redirects (301) to
  `https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement`,
  which returns `200` on a single `curl -I`. The redirect target is the URL
  linked in the page, so the link itself resolves with one HEAD request
  (no redirect at the linked URL).
- Cloudflare: `https://www.cloudflare.com/privacypolicy/` returns `200` on
  a single `curl -I`. Linked as-is.

No other URL was fetched.

## "do not collect, sell, or receive" — removed

```
$ rg -n 'do not collect, sell, or receive' dist
(no output)
```

## Denial sentences scoped to the app

```
$ rg -o -i '[^.>]*\bn[o'"'"']t (collect|receive)[^.<]*' dist/privacy/index.html
GridTheory is designed to work without an account, and the app itself does not collect, sell, or receive personal information about you
 GridTheory does not receive payment details
```

Both hits name the app as their subject ("the app itself" / "GridTheory",
GridTheory being the app's name in this document). The Children's privacy
section no longer contains any "not collect/receive" phrasing at all — it
now reads "The app itself collects no personal information from anyone,
including children", explicitly scoped to the app rather than resting on
an unqualified claim about GridTheory (the product) as a whole, and it
names the support-email exception via a forward reference to the
Contacting support section.

## Support section

```
$ rg -o '<h2>[^<]*[Ss]upport[^<]*</h2>' dist/privacy/index.html
<h2>Contacting support</h2>
```

Section text (the `<p>` following that `<h2>`):

> If you email support@gridtheory.app, directly or through the form on the
> support page, we receive your name and email address as your mail app
> sends them, your message, and anything you include; the form also lets
> you include your device, iOS version, and app version to help us help
> you. The form itself sends nothing; it opens your mail app, and nothing
> is sent until you press send there. We use what you send only to reply
> and fix problems. We do not sell it, share it, or use it for marketing,
> except with the email services that deliver and store it. We keep it
> only as long as needed to resolve your request, and privacy questions or
> deletion requests can be sent to the same address.

Covers (a) what we receive and the form's named fields, (b) the form sends
nothing itself, (c) used only to reply/fix, (d) not sold/shared/used for
marketing (qualified, per attempt 1's review, with the necessary exception
for the email services that relay and store the message — no provider
named), (e) kept only as long as needed, (f) deleted on request by
emailing the same address (restated as a general privacy-questions/
deletion-requests clause, per attempt 1's review).

Required substrings, each present at least once:

```
$ rg -i 'email address' dist/privacy/index.html -o | head -1
email address
$ rg -i 'message' dist/privacy/index.html -o | head -1
message
$ rg -i 'iOS version' dist/privacy/index.html -o | head -1
iOS version
$ rg -i 'app version' dist/privacy/index.html -o | head -1
app version
$ rg -i 'mail app' dist/privacy/index.html -o | head -1
mail app
$ rg -i 'repl(y|ies)|respond' dist/privacy/index.html -o | head -1
reply
$ rg -i 'fix' dist/privacy/index.html -o | head -1
fix
$ rg -i 'sell|sold' dist/privacy/index.html -o | head -1
sell
$ rg -i 'shar(e|ed)' dist/privacy/index.html -o | head -1
share
$ rg -i 'marketing' dist/privacy/index.html -o | head -1
marketing
$ rg -i 'as long as' dist/privacy/index.html -o | head -1
as long as
$ rg -i 'delet' dist/privacy/index.html -o | head -1
delet
```

## Mailto link and Contact section

```
$ rg -o 'href="mailto:support@gridtheory\.app"' dist/privacy/index.html
href="mailto:support@gridtheory.app"
```

On `<a class="text-link" href="mailto:support@gridtheory.app">support@gridtheory.app</a>`,
inside the "Contacting support" section, which also keeps the existing
support-page link (`<a class="text-link" href="../support/">support page</a>`).
This is the same section that serves the page's general contact purpose
(the standalone "Contact" heading from the baseline was folded into this
one, retitled to include "support" so it also satisfies the h2 check
above) — it names the address directly.

## Occurrence count

```
$ rg -o 'support@gridtheory\.app' dist/privacy/index.html | wc -l
       2
```

Exactly 2, from the one mailto `<a>` whose `href` and visible text both
contain the literal address, as I261's review established. This is the
count I262's amendment should check for the settled cross-file set.

## App-side claims kept — byte-identical except the one permitted Jolpica sentence

A scratchpad Python script extracted "Information GridTheory uses", "Your
scenarios and activity" and "Location" from both the current file and
`git show 1a9c5ed7c447f200ea127ddcf2dfdcb86a961fed:dist/privacy/index.html`,
compared as strings:

```
prefix identical: True
suffix identical: True
Information GridTheory uses identical: False
  baseline: <p>The app downloads public Formula 1 schedule and results data from Jolpica to build its local season cache. These requests contain no information that identifies you.</p><p>GridTheory uses Apple’s StoreKit framework for optional one-off purchases and MapKit to display circuit map tiles. Apple handles those services under its own policies. GridTheory does not receive payment details.</p>
  current:  <p>The app downloads public Formula 1 schedule and results data from Jolpica to build its local season cache. These requests carry no account or personal details, but, as with any internet request, the provider can see the device’s IP address.</p><p>GridTheory uses Apple’s StoreKit framework for optional one-off purchases and MapKit to display circuit map tiles. Apple handles those services under its own policies. GridTheory does not receive payment details.</p>
Your scenarios and activity identical: True
Location identical: True
```

"Information GridTheory uses" now differs by exactly the one Jolpica
sentence the scope extension permits — the diff above shows every other
byte of that section, including the immediately following StoreKit/MapKit
sentence, is unchanged. "Your scenarios and activity" and "Location" are
still byte-identical to `1a9c5ed`.

## Effective date

```
$ rg -n 'Effective 13 September 2026' dist
(no output)
$ rg -o 'Effective [0-9]{1,2} [A-Z][a-z]+ 20[0-9]{2}' dist/privacy/index.html
Effective 23 September 2026
```

Exactly one match, dated the commit day (23 September 2026, on or after
the amendment's floor).

## No address other than the support address

```
$ rg -o -i '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}' dist evidence/I263 | rg -v 'support@gridtheory\.app'
(no output)
$ rg -n -i 'email routing|forward|gmail|icloud|outlook|proton|fastmail' dist
(no output)
```

The forwarding mailbox and its provider/mechanism are never named.
"Cloudflare" appears only in the hosting sentence below, in its
traffic/DNS-serving capacity, never adjacent to "email"/"forward".

## Hosting/CDN disclosure

```
$ rg -n -i 'github pages' dist/privacy/index.html
(1 match — see quoted sentence below)
$ rg -c -i 'cloudflare' dist/privacy/index.html
1
$ rg -o 'href="https://[^"]*"' dist/privacy/index.html | rg -i 'github\.com'
href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement"
$ rg -o 'href="https://[^"]*"' dist/privacy/index.html | rg -i 'cloudflare\.com'
href="https://www.cloudflare.com/privacypolicy/"
```

The matching sentence (the "Hosting" section's `<p>`, links stripped to
text for quoting):

> This site is hosted on GitHub Pages and served through Cloudflare.
> Either may process visitors' IP addresses and standard request data
> (for example, in server logs) to deliver and protect the site, under
> their own privacy policies: GitHub's privacy policy and Cloudflare's
> privacy policy.

Names both GitHub Pages and Cloudflare, says either may process visitors'
IP addresses and standard request data (e.g. server logs) to deliver and
protect the site under their own privacy policies, links both providers'
privacy policies, and contains neither "email" nor "forward" nor the
support address. It is a factual statement about the infrastructure the
site sits on, not a claim about GridTheory's own behaviour.

## Nothing beyond what's true (checked before writing the sentence)

```
$ rg -n -i 'document\.cookie|gtag\(|\banalytics\b|mixpanel|amplitude|plausible|matomo|piwik' dist
dist/index.html:8:...GridTheory has no account, no advertising or analytics SDK, and no developer-run server...
dist/privacy/index.html:1:...advertising SDK, analytics SDK, or third-party crash-reporting SDK...
```

Both hits are existing statements that GridTheory does *not* run an
analytics SDK — no `<script>`, `document.cookie`, or third-party analytics
call was found anywhere in `dist`. The new hosting sentence does not claim
GridTheory itself sets cookies or runs analytics; it only says the
third-party hosts (GitHub Pages, Cloudflare) may log standard request
data under their own policies.

## Outside `<main>` unchanged

A scratchpad Python script compared the prefix up to and including
`<main class="legal">` and the suffix from `</main>` onward against
`git show 1a9c5ed7c447f200ea127ddcf2dfdcb86a961fed:dist/privacy/index.html`:

```
prefix identical: True
suffix identical: True
```

```
$ git diff --stat 1a9c5ed7c447f200ea127ddcf2dfdcb86a961fed
 dist/privacy/index.html             |   2 +-
 evidence/I263/check.md              | 289 ++++++++++++++++++++++++++++++++++++
 evidence/I263/privacy-390-dark.png  | Bin 0 -> 176120 bytes
 evidence/I263/privacy-390-light.png | Bin 0 -> 181006 bytes
 4 files changed, 290 insertions(+), 1 deletion(-)
```

Only `dist/privacy/index.html` and `evidence/I263/*` (the byte counts and
`check.md` line count above are from the pending working-tree diff at the
time this was run, before the attempt-2 commit; re-run after committing
shows the same two paths, updated counts).

## No style/script leakage, classes already exist

```
$ rg -n 'style=|<style|<script' dist/privacy/index.html
(no output)
```

Classes used inside `<main>`: `legal`, `eyebrow`, `updated`, `text-link` —
all pre-existing, all already defined in `dist/assets/site.css` (`.legal`,
`.eyebrow`, `.legal .updated`, `.text-link`). No new class names, no
inline styles, no `<style>`/`<script>` added.

## html-validate

```
$ npx --yes html-validate dist/privacy/index.html
(no output, exit code 0)
```

0 errors.

## Headless Chrome, CDP, 390 px light/dark

Re-captured for attempt 2 against the updated body content (both
screenshots below show the reworded Jolpica sentence and Contacting
support section). Method matches `evidence/I259/check.md`:
`Google Chrome 153.0.8010.54`, `--headless=new --remote-debugging-port=9263`,
fresh `--user-data-dir`. Driver: Node `v24.19.0`, built-in `WebSocket`/`fetch`,
script kept in the scratchpad, never committed. `Emulation.setDeviceMetricsOverride`
set the viewport to 390×844 (mobile), `Emulation.setEmulatedMedia` set
`prefers-color-scheme` per row, `Page.navigate` loaded
`http://localhost:8263/privacy/` (served from the real `dist/`,
unmodified, via `python3 -m http.server 8263`), then `Runtime.evaluate`
read the DOM back after two animation frames.

| page | width | mode | scrollWidth | clientWidth | overflowPx | prefersDark |
|---|---|---|---|---|---|---|
| privacy | 390 | light | 390 | 390 | 0 | false |
| privacy | 390 | dark | 390 | 390 | 0 | true |

`overflowPx` (`scrollWidth − clientWidth`) is 0 in both modes — no
horizontal overflow at 390 px. `prefersDark` reads back `false`/`true`
correctly, confirming the CDP emulation reached the page. Screenshots
saved as `evidence/I263/privacy-390-light.png` and
`evidence/I263/privacy-390-dark.png`.

Both the Chrome instance (port 9263) and the `http.server` (port 8263)
that were started for this check have been shut down; nothing was left
running.

## Nothing pushed

```
$ git log origin/main..HEAD
(commits on this branch only, not on origin/main)
```
