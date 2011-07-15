#!/bin/sh
# huyz 2011-07-14
# Package files for distribution as CRX and for Chrome Web Store

[ -d google-plus-me ] || mkdir google-plus-me
cp -a *.html *.js *.css *.json icons google-plus-me

cd google-plus-me || exit 1
rm -f ../google-plus-me.zip
zip -r ../google-plus-me *
