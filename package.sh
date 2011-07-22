#!/bin/sh
# huyz 2011-07-14
# Package files for distribution as CRX and for Chrome Web Store

[ -d dist ] && rm -rf dist
mkdir dist || exit 1
cp -a *.html *.js *.css *.json icons images dist/

cd dist || exit 1

# Web store regular
rm -f ../google-plus-me.zip
zip -r ../google-plus-me *

# Web Store beta
perl -pi -e 's/G\+me\b/G+me (BETA)/; s/"description"\s*:\s*"/$&(BETA) /;' manifest.json
rm -f ../google-plus-me-beta.zip
zip -r ../google-plus-me-beta *

# huyz.us beta
perl -pi -e 's#"homepage_url"#"update_url": "http://huyz.us/gpme-beta-updates.xml",\n  $&#; ' manifest.json
