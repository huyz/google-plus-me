#!/opt/local/bin/perl -w
# huyz 2011-08-12
# Reads in translations from an Excel file exported from Google Spreadsheet
# and inserts them into the proper messages.json
#
# UPDATED: 2011-08-13
# Overall Stats:
#
#          español ES: 
#          español AL: 38 14 
#            français: 43 40 2 
#        português BR: 3 
#        português PT: 45 1 
#            italiano: 7 
#             Swedish: 
#          Indonesian: 24 
#              German: 45 
#               Dutch: 
#            Japanese: 38 
#             Finnish: 
#              Polish: 
#  Simplified Chinese: 
# Traditional Chinese: 
#           Norwegian: 
#           Hungarian: 39 

use utf8;
binmode STDOUT, ":utf8";
binmode STDERR, ":utf8";
select STDERR; $| = 1;
select STDOUT; $| = 1;

use autodie qw(:all);
use strict;
use Spreadsheet::ParseExcel;
use List::Util qw[min max];
use Term::ANSIColor qw(:constants color);
$Term::ANSIColor::AUTORESET = 1;


### Config

my %DIRMAP = (
  "español ES" => "es",
  "español AL" => "es_419",
  "français" => "fr",
  "português BR" => "pt_BR",
  "português PT" => "pt_PT",
  "italiano" => "it",
  "Swedish" => "sv",
  "Indonesian" => "id",
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

### Functions

our %entryCount = ();
our @translations = ();

sub printStats($) {
  my $sheetName = $_[0];
  for (my $i = 0; $i < $#{$entryCount{$sheetName}} + 1; ++$i) {
    if (defined $entryCount{$sheetName}[$i]) {
      print MAGENTA $entryCount{$sheetName}[$i] . " ";
    } else {
      print MAGENTA "0 ";
    }
  }
  print "\n";
}

### Init

# Go to the right directory
( -e 'import-messages.pl' ) && chdir('..');
if ( ! -r '_locales/en/messages.json' ) {
  die "Can't find messages.json. Running from the extension root directory?\n";
}

my $parser   = Spreadsheet::ParseExcel->new();
my $workbook = $parser->parse('bin/translations.xls');

if ( !defined $workbook ) {
  die $parser->error(), ".\n";
}

chdir('_locales');

for my $worksheet ( $workbook->worksheets() ) {
  my $sheetName = $worksheet->get_name();
  next if $sheetName eq "Intro";

  push @translations, $sheetName;

  $entryCount{$sheetName} = [];

  my $dir = $DIRMAP{$sheetName};
  if ( ! defined $dir ) {
    print STDERR "Can't find directory for '$sheetName'\n";
    next;
  }

  print REVERSE "== " . $sheetName, " ==\n";

  ### Prep files

  chdir($DIRMAP{$sheetName}) or die "Can't cd to '" . $DIRMAP{$sheetName} . "'";

  if (! -e "messages-gplus.json") {
    system("mv messages.json messages-gplus.json");
  }

  # Use English as a template
#  if (! -e "messages.json") {
  # XXX Temporary until someone provides an es-ES translation
  if ($sheetName eq "español ES") {
    system("cp -f ../es_419/messages.json messages.json");
  } else {
    system("cp -f ../en/messages.json messages.json");
  }
#  }

  ### Read in files

  open my $in, "<:encoding(utf8)", "messages.json";
  my $content = join('', <$in>);
  close $in;

  my %gplusMessages = ();
  if (-e "messages-gplus.json") {
    open my $gplus, "<:encoding(utf8)", "messages-gplus.json";
    my $gplusMessages = join('', <$gplus>);
    close $gplus;
    # XXX Assume there are no unescaped double-quotes
    while ($gplusMessages =~ /^\s*"(\w+)"\s*:\s*\{[\s\r\n]*"message"\s*:\s*"(.*?)(?<!\\)"/msg) {
      my ($key, $message) = ($1, $2);
      print "$key=\"$message\"\n";
      # Same as below
      $content =~ s/^(\s*"$key"\s*:\s*\{[\s\r\n]*"message"\s*:\s*)".*?(?<!\\)"/$1"$message"/ms;
    }
    print "\n";
  }

  ### Read in Excel mappings

  my ( $row_min, $row_max ) = $worksheet->row_range();
  my ( $col_min, $col_max ) = $worksheet->col_range();

  my $firstRow = -1;
  my @faq;
  for my $row ( $row_min .. $row_max ) {
    my $key = $worksheet->get_cell( $row, 0 )->value();

    # Find first row
    if ($firstRow < 0) {
      if ($key eq "extensionName") {
        $firstRow = $row;
      } else {
        next;
      }
    }

    # Skip empty rows
    next unless $key =~ /\w/;
    # Skip non-fancy-settings keys
    next if ($key =~ /add-on$|fancy_/);

    # Find all translations
    my @cells;
    for (my $col = 3; $col <= $col_max ; $col += 2) {
      my $transIndex = ($col - 3) / 2;

      # Find notes from translators
      my $note = $worksheet->get_cell( $row, $col + 1 );
      if (defined $note) {
        print GREEN "$key: NOTE: " . $note->value() . "\n";
      }

      # Find translation
      my $cell = $worksheet->get_cell( $row, $col );
      $cell = $cell->value() if defined $cell;
      # In this section, any blank entries are considered not set.
      if (defined $cell && $cell =~ /\S/) {

        # Accumulate FAQ
        if ( $key =~ /^options_nav_faq_desc(\d+)$/ ) {
          if ($faq[$transIndex]) {
            $faq[$transIndex] .= "\n";
          }
          $faq[$transIndex] .= $cell;
          if ($1 < 4) {
            next;
          } else {
            $cell = $faq[$transIndex];
          }
        }

        # Track which translation had an entry
        $entryCount{$sheetName}[$transIndex]++;
        # But just take the first non-empty one
        push @cells, $cell;
      }
    }

    if ( $key =~ /^options_nav_faq_desc(\d+)$/ ) {
      if ( $1 < 4 ) {
        next;
      } else {
        $key = 'options_nav_faq_desc';
      }
    }

    # Show translation counts
    if (! @cells) {
      # XXX temporary while we depend on es_419 for es-ES
      if ($sheetName eq "español ES") {
        print RED "$key: ERROR: no translations.\n";
        next;
      }

      print RED "$key: ERROR: no translations.  Deleting from file.\n";

      # Delete the entry from the file
      # XXX This will not delete the entry at the beginning since there's no comma there
      # So extensionName stays
      $content =~ s/,\s*\r?\n
        ^\s*"$key"\s*:\s*\{
          \s*"message"\s*:\s*".*?(?<!\\)"\s*(?:,
          \s*"description"\s*:\s*".*?(?<!\\)"\s*)?(?:,
          \s*"placeholders"\s*:\s*.*?\}\s*\})?
        \s*\}[\x20\t]*
        //msx;

      next;
    } elsif (@cells != 2) {
      print BLUE "$key: " . @cells . " translation(s)\n";
    }

    # Get message

    # Take the first column with an entry
    # XXX Assume there are no unescaped double-quotes
    my $message = $cells[0];
    chomp $message;
    $message =~ s/^\s*//;


    print "$key=\"$message\"\n";

    ### Do substitution

    if ($content =~ s/^(\s*"$key"\s*:\s*\{[\s\r\n]*"message"\s*:\s*)".*?(?<!\\)"/$1"$message"/ms) {
      ;

    # If not found, then append
    } else {
      print GREEN "$key: WARNING: translation not found.  Appending.\n";
      if ($content !~ s/\}[ \t]*\r?\n([ \t]*\}\s*)$/},
  "$key": {
    "message": "$message"
  }
$1/s) {
        die "Can't append '$key' to language '$sheetName'";
      }
    }
  }

  ### Display stats

  print "\n";
  print MAGENTA "STATS: ";
  printStats($sheetName);
  print "\n";

  ### Write out file

  open my $out, ">:encoding(utf8)", "messages.json";
  print $out "$content";
  close $out;

  ### End

  chdir('..') or die "Can't cd to '..'";
}

### Display stats

print "\n";
print REVERSE "Overall Stats\n\n";
for my $sheetName (@translations) {
  printf (color('magenta') . "%20s: ", $sheetName);
  printStats($sheetName);
}
