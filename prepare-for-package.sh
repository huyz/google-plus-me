#!/bin/sh
# huyz 2011-07-14
# Package files for distribution as CRX and for Chrome Web Store

[ -d google-plus-me ] || mkdir google-plus-me
cp -a *.* icons google-plus-me

cd google-plus-me || exit 1
zip -r ../google-plus-me *
