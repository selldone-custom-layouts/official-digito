#!/usr/bin/env bash
# The second half of release.sh, for a build already made (dist/ from
# `VITE_KALIO_ACCOUNT=desk npm run build-production` with the version already
# bumped in manifest.json): checks, package, prove the ZIP, upload, verify.
#
# usage: LAYOUT_ID=<id> SELLDONE_CLI_SRC=<cli clone> bash scripts/ship-built.sh
set -euo pipefail
cd "$(dirname "$0")/.."
SELLDONE_CLI="${SELLDONE_CLI:-$(npm root -g)/selldone-cli}"
: "${SELLDONE_CLI_SRC:?set SELLDONE_CLI_SRC to a clone of github.com/selldone/cli}"
PACKAGER="$SELLDONE_CLI_SRC/.agents/skills/package-selldone-storefront-layout/scripts/package_layout.py"
grep '"version"' manifest.json
rm -f dist/index.html
node scripts/kalio-svg-flatten.mjs dist/app | tail -1
J=$(find dist/app -type f \( -name '*.js' -o -name '*.mjs' \) -exec file -b --mime-type {} \; | grep -c text/x-java || true)
S=$( (grep -l 'from"../shop.js"' -r dist/app || true) | wc -l)
N=$(find dist -type f | wc -l)
echo "java-mime:$J shop.js-imports:$S files:$N (keep under ~360)"
[ "$J" = 0 ] && [ "$S" = 0 ] || { echo "CHECK FAILED"; exit 1; }
python "$PACKAGER" dist dist.zip --manifest manifest.json --force
unzip -p dist.zip app/shop.js | cmp - dist/app/shop.js && echo "zip matches dist"
node --use-system-ca scripts/kalio-deploy.mjs "$SELLDONE_CLI"
if [ -n "${LAYOUT_ID:-}" ]; then
  node --use-system-ca scripts/kalio-verify-deploy.mjs "$SELLDONE_CLI" "$LAYOUT_ID" dist/app
fi
