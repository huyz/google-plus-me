#!/bin/sh
# huyz 2011-07-14
# Package files for distribution as CRX and for Chrome Web Store

if [ ! -d dist ]; then
  mkdir dist || exit 1
fi
cd dist || exit 1
rm -rf google-plus-me

mkdir google-plus-me || exit 1
cd google-plus-me || exit 1

cp -a ../../{*.{html,js,css,json},icons,images} .

version=$(sed -n 's/.*"version" *: *"\([0-9\.][0-9\.]*\)".*/\1/p' manifest.json)
[ -n "$version" ] || exit 2

# Web store regular
perl -pi -e "s/^\s* console.debug\(typeof msg == 'object'/\/\/\$&/" gpme.js
rm -f ../google-plus-me-$version.zip
zip -r ../google-plus-me-$version.zip *

# Web Store beta (only kept for records as it matches the huyz.us beta)
perl -pi -e "s/^\/\/(\s* console.debug\(typeof msg == 'object')/\$1/" gpme.js
perl -pi -e 's/G\+me\b/G+me (BETA)/; s/"description"\s*:\s*"/$&(BETA) /;' manifest.json
rm -f ../google-plus-me-$version-beta.zip
zip -r ../google-plus-me-$version-beta.zip *

# huyz.us beta
perl -pi -e 's#"homepage_url"#"update_url": "http://huyz.us/gpme-beta-updates.xml",\n  $&#; ' manifest.json
