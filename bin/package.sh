#!/bin/bash
# huyz 2011-07-14
# Package files for distribution as CRX and for Chrome Web Store

#############################################################################
### Config

SOURCES="gpme.js background.js fancy-settings/source/settings.js"

### End config
#############################################################################
### Config

### Init dir

[ -e package.sh ] && cd ..
if [ ! -r manifest.json ]; then
  echo "Can't find manifest.json.  Running from the extension root directory?" >&2
  exit 1
fi

### Checks

for i in _locales/*; do
  if [ -d "$i" -a ! -e "$i/messages.json" ]; then
    echo "ERROR: Missing $i/messages.json" >&2
    exit 1
  fi
done


# Get version number from file
version=$(sed -n 's/.*"version" *: *"\([0-9\.]*\)".*/\1/p' manifest.json)

### For sanity check, give a chance to cancel

echo "G+me version $version."
echo -n "Regular or beta? [rb] "
read mode
case "$mode" in
  b) mode=beta ;;
  r) mode=regular ;;
  *) exit ;;
esac


if [ ! -d dist ]; then
  mkdir dist || exit 1
fi
cd dist || exit 1
rm -rf google-plus-me

mkdir google-plus-me || exit 1
cd google-plus-me || exit 1

# Pick out the files we need
#shopt -s extglob
#cp -a ../../@(!(jquery).@(html|js|css|json)|icons|images|_locales|fancy-settings|gplusx|@(gplusx.js|gen/gplusx-map.json|webx|@(jquery-1.6.2!(-min).js|webx.js))) .
(cd ../..; tar cf - --exclude=jquery.js --exclude="jquery*min.js" \
  {*.{html,js,css,json},icons,images,_locales,fancy-settings} \
  gplusx/{gplusx.js,gen/gplusx-map.json} \
  gplusx/webxdk/{webx,jquery*}.js \
) | tar xf -

version=$(sed -n 's/.*"version" *: *"\([0-9\.][0-9\.]*\)".*/\1/p' manifest.json)
[ -n "$version" ] || exit 2

if [ $mode = regular ]; then
  # Paranoid edition
  DEBUG=false
  PARANOID=true
  echo -e "\n== Paranoid edition =="
  perl -pi -e 's/^(var DEBUG =).*/$1 false;/' $SOURCES
  perl -pi -e 's/^(var PARANOID =).*/$1 true;/' $SOURCES
  rm -rf _locales
  cp -a ../../{manifest.json,_locales} .
  perl -pi -e "
      s/G\\+me\\b/G+me v$version (PARANOID Edition)/;
      s/^,\\s*\"tabs\"//;
    " manifest.json
  perl -pi -e "s/(\"message\": \"G\\+me for Google Plus™)\"/\$1 (PARANOID Edition)\"/g" _locales/*/messages.json
  rm -f ../google-plus-me-$version-paranoid.zip
  zip -r ../google-plus-me-$version-paranoid.zip *

  # Web store regular
  DEBUG=false
  PARANOID=false
  echo -e "\n== Web Store =="
  perl -pi -e 's/^(var DEBUG =).*/$1 false;/' $SOURCES
  perl -pi -e 's/^(var PARANOID =).*/$1 false;/' $SOURCES
  perl -pi -e "
      s/G\\+me\\b/G+me v$version/;
    " manifest.json
  rm -f ../google-plus-me-$version.zip
  zip -r ../google-plus-me-$version.zip *
fi

# Web Store beta (only kept for records as it matches the huyz.us beta)
if [ $mode = beta ]; then
  DEBUG=true
  PARANOID=false
  echo "\n== Web Store beta =="
  perl -pi -e 's/^(var DEBUG =).*/$1 true;/' $SOURCES
  perl -pi -e 's/^(var PARANOID =).*/$1 false;/' $SOURCES
  rm -rf _locales
  cp -a ../../{manifest.json,_locales} .
  perl -pi -e "
      s/G\\+me\\b/G+me v$version (BETA)/;
    " manifest.json
  perl -pi -e "s/(\"message\": \"G\\+me for Google Plus™)\"/\$1 v$version (BETA)\"/g" _locales/*/messages.json
  rm -f ../google-plus-me-$version-beta.zip
  zip -r ../google-plus-me-$version-beta.zip *
fi

# huyz.us beta
# NOTE: this must run right after eerything else.
echo -e "\n== Independent beta (crx file) with DEBUG=$DEBUG PARANOID=$PARANOID"
perl -pi -e 's#"homepage_url"#"update_url": "http://huyz.us/gpme-beta-updates.xml",\n  $&#; ' manifest.json
echo "Now go to Chrome > Manage Extensions and click 'Pack extension'"
