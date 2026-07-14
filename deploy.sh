#!/usr/bin/env bash
# Deploy the Orchard site: save to GitHub + publish to Vercel.
# Usage:  ./deploy.sh "short message about what changed"
set -euo pipefail

cd "$(dirname "$0")"

MSG="${1:-Update site}"

echo "==> 1/3  Saving to GitHub…"
git add -A
if git diff --cached --quiet; then
  echo "    (no code changes to commit)"
else
  git commit -m "$MSG"
fi
git push origin main

echo "==> 2/3  Building for Vercel…"
NITRO_PRESET=vercel npm run build

echo "==> 3/3  Deploying to production…"
npx vercel deploy --prebuilt --prod --yes

echo "✅ Done. Live at https://orchard-site-xi.vercel.app"
