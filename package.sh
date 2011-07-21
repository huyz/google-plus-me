#!/bin/sh
# huyz 2011-07-14
# Package files for distribution as CRX and for Chrome Web Store

[ -d dist ] && rm -rf dist
mkdir dist || exit 1
cp -a *.html *.js *.css *.json icons images dist/

cd dist || exit 1
rm -f ../google-plus-me.zip
zip -r ../google-plus-me *

perl -pi -e 's/G\+me\b/G+me (BETA)/; s/"description"\s*:\s*"/$&(BETA) /' manifest.json
zip -r ../google-plus-me-beta *
