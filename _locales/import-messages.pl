#!/opt/local/bin/perl -w
# huyz 2011-08-12


use utf8;
binmode STDOUT, ":utf8";
binmode STDERR, ":utf8";

use autodie qw(:all);
use strict;
use Spreadsheet::ParseExcel;
use List::Util qw[min max];

### Config

my %DIRMAP = (
  "español ES" => "es",
  "español AL" => "es_419",
  "français" => "fr",
  "português BR" => "pt_BR",
  "português PT" => "pt_PT",
  "italiano" => "it",
  "Swedish" => "sv",
  "Indonesia" => "id",
  "German" => "de",
  "Dutch" => "nl",
  "Japanese" => "ja",
  "Finnish" => "fi",
  "Polish" => "pl",
  "Simplified Chinese" => "zh_CN",
  "Traditional Chinese" => "zh_TW",
  "Hungarian" => "hu",
  "Norwegian" => "no",
);
my %TRANSLATION = (
);

### End of config

my $parser   = Spreadsheet::ParseExcel->new();
my $workbook = $parser->parse('translation.xls');


if ( !defined $workbook ) {
  die $parser->error(), ".\n";
}

for my $worksheet ( $workbook->worksheets() ) {
  my $sheetName = $worksheet->get_name();
  next if $sheetName eq "Intro";

  my $dir = $DIRMAP{$sheetName};
  if ( ! defined $dir ) {
    print STDERR "Can't find directory for '$sheetName'\n";
    next;
  }

  print "== " . $sheetName, " ==\n";

  ### Prep files

  chdir($DIRMAP{$sheetName}) or die "Can't cd to '" . $DIRMAP{$sheetName} . "'";

#  if (! -e "messages-gplus.json") {
#    system("mv messages.json messages-gplus.json");
#  }

#  if (-e "messages.json") {
#    #print STDERR "messages.json already exists\n";
#  } else {
#    system("cp -f ../en/messages.json messages.json");
#  }

  ### Read in files

  open my $fh, "<:encoding(utf8)", "../en/messages.json";
  my $target = join('', <$fh>);

  ### Read in Excel mappings

  my ( $row_min, $row_max ) = $worksheet->row_range();
  my ( $col_min, $col_max ) = $worksheet->col_range();

  my $firstRow = -1;
  for my $row ( $row_min .. $row_max ) {
    my $key = $worksheet->get_cell( $row, 0 );

    # Find first row
    if ($firstRow < 0) {
      if ($key eq "extensionName") {
        $firstRow = $row;
      }
      next;
    }

    # Skip empty rows
    next unless $key =~ /\w/;

    my $col = 3;
    my $message = $worksheet->get_cell( $row, $col );
    print "$key=$message\n";
  }

  chdir('..') or die "Can't cd to '..'";
}
