#!/usr/bin/env bash
# build-web-assets.sh [ios-repo-path]
#
# Regenerates the derived site image assets (icon/* and screens/*) from the
# f1-simulation-ios source repo. Never touches dist/assets/img/badges/ — the
# App Store badge is downloaded by hand, not generated.
#
# Requires: /usr/bin/sips, cwebp (Homebrew). No ImageMagick, no pngquant.
set -euo pipefail

ios_repo="${1:-../f1-simulation-ios}"
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "$script_dir/.." && pwd)"
img_dir="$repo_root/dist/assets/img"

icon_src="$ios_repo/App/F1SimulatorApp/Assets.xcassets/AppIcon.appiconset/icon-1024.png"
iphone_dir="$ios_repo/store/screenshots/iPhone-17-Pro-Max"
ipad_dir="$ios_repo/store/screenshots/iPad-Pro-13-inch-M5"

for tool in sips cwebp; do
  command -v "$tool" >/dev/null 2>&1 || { echo "error: $tool not found on PATH" >&2; exit 1; }
done

[ -f "$icon_src" ] || { echo "error: icon source not found: $icon_src" >&2; exit 1; }

work="$(mktemp -d)"
trap 'rm -rf "$work"' EXIT

mkdir -p "$img_dir/icon" "$img_dir/screens"

# --- icon/*.png: square resizes, no baked-in corners ---------------------
for size in 32 64 128 180; do
  sips -z "$size" "$size" "$icon_src" --out "$img_dir/icon/icon-$size.png" >/dev/null
done

# --- icon/og-image.png: 1200x630, icon centred on #1A1C2E -----------------
og_mark="$work/og-mark.png"
sips -z 420 420 "$icon_src" --out "$og_mark" >/dev/null
sips -p 630 1200 --padColor 1A1C2E "$og_mark" --out "$img_dir/icon/og-image.png" >/dev/null 2>/dev/null

# --- screens/*.webp: resize preserving aspect ratio, then encode ----------
# name-in-contract:source-filename:source-dir:widths
shots=(
  "iphone-01-home-overview:01-home-overview-free.png:$iphone_dir:480 960"
  "iphone-02-race-weekend-pro:02-race-weekend-pro-unlocked.png:$iphone_dir:480 960"
  "iphone-03-scenario-reorder:03-scenario-reorder-flip.png:$iphone_dir:480 960"
  "ipad-01-home-overview:01-home-overview-free.png:$ipad_dir:800 1600"
  "ipad-02-race-weekend-pro:02-race-weekend-pro-unlocked.png:$ipad_dir:800 1600"
)

for entry in "${shots[@]}"; do
  IFS=':' read -r out_name src_name src_dir widths <<<"$entry"
  src="$src_dir/$src_name"
  [ -f "$src" ] || { echo "error: screenshot source not found: $src" >&2; exit 1; }
  for width in $widths; do
    resized="$work/$out_name-$width.png"
    sips --resampleWidth "$width" "$src" --out "$resized" >/dev/null
    cwebp -quiet -q 80 "$resized" -o "$img_dir/screens/$out_name-$width.webp"
  done
done

echo "done: $img_dir/icon and $img_dir/screens regenerated (badges/ untouched)"
