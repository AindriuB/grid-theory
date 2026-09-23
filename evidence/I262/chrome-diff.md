# I262 header/footer diff (from live Chrome DOM, CDP outerHTML)

Header identical across all three pages once `../` is normalised: **true**

Footer brand/badge column identical across all three pages once `../` is normalised: **true**

## Header (normalized)

`index`:
```html
<header class="site-header"><a class="brand" href="/" aria-label="GridTheory home"><img class="brand-mark" src="/assets/img/icon/icon-64.png" srcset="/assets/img/icon/icon-128.png 2x" width="29" height="29" alt=""> GridTheory</a><nav aria-label="Primary navigation"><a href="/#features">Features</a><a href="/privacy/">Privacy</a><a href="/support/">Support</a></nav></header>
```

`support`:
```html
<header class="site-header"><a class="brand" href="/" aria-label="GridTheory home"><img class="brand-mark" src="/assets/img/icon/icon-64.png" srcset="/assets/img/icon/icon-128.png 2x" width="29" height="29" alt=""> GridTheory</a><nav aria-label="Primary navigation"><a href="/#features">Features</a><a href="/privacy/">Privacy</a><a href="/support/">Support</a></nav></header>
```

`privacy`:
```html
<header class="site-header"><a class="brand" href="/" aria-label="GridTheory home"><img class="brand-mark" src="/assets/img/icon/icon-64.png" srcset="/assets/img/icon/icon-128.png 2x" width="29" height="29" alt=""> GridTheory</a><nav aria-label="Primary navigation"><a href="/#features">Features</a><a href="/privacy/">Privacy</a><a href="/support/">Support</a></nav></header>
```

## Footer brand/badge column (normalized)

`index`:
```html
<div><a class="brand" href="/"><img class="brand-mark" src="/assets/img/icon/icon-64.png" srcset="/assets/img/icon/icon-128.png 2x" width="29" height="29" alt=""> GridTheory</a> <a class="store-badge" href="https://apps.apple.com/app/id6805695204"><picture><source media="(prefers-color-scheme: dark)" srcset="/assets/img/badges/app-store-badge-white.svg"><img src="/assets/img/badges/app-store-badge-black.svg" alt="Download on the App Store" width="120" height="40"></picture></a></div>
```

`support`:
```html
<div><a class="brand" href="/"><img class="brand-mark" src="/assets/img/icon/icon-64.png" srcset="/assets/img/icon/icon-128.png 2x" width="29" height="29" alt=""> GridTheory</a> <a class="store-badge" href="https://apps.apple.com/app/id6805695204"><picture><source media="(prefers-color-scheme: dark)" srcset="/assets/img/badges/app-store-badge-white.svg"><img src="/assets/img/badges/app-store-badge-black.svg" alt="Download on the App Store" width="120" height="40"></picture></a></div>
```

`privacy`:
```html
<div><a class="brand" href="/"><img class="brand-mark" src="/assets/img/icon/icon-64.png" srcset="/assets/img/icon/icon-128.png 2x" width="29" height="29" alt=""> GridTheory</a> <a class="store-badge" href="https://apps.apple.com/app/id6805695204"><picture><source media="(prefers-color-scheme: dark)" srcset="/assets/img/badges/app-store-badge-white.svg"><img src="/assets/img/badges/app-store-badge-black.svg" alt="Download on the App Store" width="120" height="40"></picture></a></div>
```

