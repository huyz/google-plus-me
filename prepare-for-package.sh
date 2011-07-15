#!/bin/sh
# huyz 2011-07-14
# Package files for Chrome web store

[ -d google-plus-me ] || mkdir google-plus-me
cp -a *.* icons google-plus-me

zip -r google-plus-me google-plus-me
