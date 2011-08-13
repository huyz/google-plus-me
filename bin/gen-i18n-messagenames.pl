#!/usr/bin/perl -w
# huyz 2011-08-02
# To get around a Chrome i18n-message caching bug
# we need background.js to provide all the i18n messages for us
# http://code.google.com/p/chromium/issues/detail?id=53628#makechanges

( -e 'gen-i18n-messagenames.pl' ) && chdir('..');
if ( ! -r '_locales/en/messages.json' ) {
  die "Can't find messages.json. Running from the extension root directory?\n";
}

die unless open(MESSAGES, "_locales/en/messages.json");
die unless open(MESSAGE_NAMES, "> background-gen-i18n-messagenames.js");
*STDOUT = *MESSAGE_NAMES;

print "var MESSAGE_NAMES = [\n";

my $i = 0;

while (<MESSAGES>) {
  # There must be exactly 2 spaces in the front
  if (/^  "(\w+)"\s*:\s*\{.*/) {
    if ($i++ > 0) {
      print ",\n";
    }
    print "  \"$1\"";
  }
}

print "\n];\n";
