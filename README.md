# GridTheory public site

Static marketing, support, and privacy-policy pages for GridTheory.

The `dist/` folder is deployed to GitHub Pages by the included workflow. The
site is configured for `gridtheory.app`; point the domain's DNS to GitHub
Pages before using it as the App Store marketing and support URL.

The support address is `support@gridtheory.app`, held in
`dist/support/index.html`: the feedback form's `data-support-email`
attribute, and the fallback link's `href` and text. Changing it later means
editing all three, in that one file — the forwarding target behind the
address is private and is never written into this repo.

Images under `dist/assets/img/` regenerate with `scripts/build-web-assets.sh`.

Pushing `main` deploys the site. Nothing here pushes it automatically —
that push is the user's call.
