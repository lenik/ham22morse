#!/usr/bin/perl

=head1 NAME

txt2json - 
=cut
use strict;
use vars qw($LOGNAME $LOGLEVEL);
use cmt::log(2);
    $LOGNAME    = 'txt2json'; # $0 =~ /([^\/\\.]+)(?:\.\w+)*$/;
use cmt::vcs('parse_id');
    my %RCSID   = parse_id('$Id: - @VERSION@ @DATE@ @TIME@ - $');
use Getopt::Long;
    Getopt::Long::Configure('gnu_getopt');

sub _main; sub _version; sub _help;

sub _boot {
    GetOptions('q|quiet'        => sub { $LOGLEVEL-- },
               'v|verbose'      => sub { $LOGLEVEL++ },
               'version'        => sub { _version; exit 0 },
               'h|help'         => sub { _help; exit 0 },
               )
        or exit(1);
    _main;
}

=head1 SYNOPSIS

B<txt2json>
    S<[ B<-q> | B<--quiet> ]>
    S<[ B<-v> | B<--verbose> ]>
    S<[ B<-h> | B<--help> ]>
    S<[ B<--version> ]>
    S<[ B<--> ]>
    S<[ I<...the rest of arguments...> ]>

=head1 DESCRIPTION

B<txt2json> is a WHAT used for WHAT. It HOW-WORKS.

BACKGROUND-PROBLEM.

HOW-txt2json-RESOLVES.

=head1 OPTIONS

=over 8

=item B<-m> | B<--my-option>

...

=item B<-q> | B<--quiet>

Repeat this option to suppress unimportant information to display.

=item B<-v> | B<--verbose>

Repeat this option to display more detailed information.

=item B<-h> | B<--help>

Display a breif help page and exit(0).

=item B<--version>

Display a short version information and exit(0).

=back

=head1 EXAMPLES

=over 4

=item Show help

    txt2json --help

=back

=head1 ENVIRONMENT

=over 8

=item TEMP, TMP

TEMP(or TMP, if $TEMP directory isn't existed) directory used to create
temporary files.

=back

=cut
sub _help {
    &_version;
    print "\nSyntax: \n    $0 [OPTION] [--] ...\n", <<'EOM';

Common options:
    -q, --quiet             Repeat to get less info
    -v, --verbose           Repeat to get more info
    -h, --help              Show this help page
        --version           Print the version info
EOM
}

exit (_boot or 0);

sub _main {
    print "[\n";
    my $lastk;
    
    while (<>) {
        if (/\[(\w)\](.*)$/) {
            my ($type, $s) = ($1, $2);
            $s =~ s/\"/\\\"/g;
            $s =~ s/\\/\\\\/g;
            $s =~ s/\t/\\t/g;
            my $qs = "\"$s\"";
            
            if ($type eq 'I') {
                if (defined $lastk) {
                    print "    }, {\n";
                } else {
                    print "    {\n";
                }
                print "        \"id\": $qs,\n";
            } elsif ($type eq 'Q') {
                print "        \"q\": $qs,\n";
            } elsif ($type =~ /[ABCD]/) {
                if ($type eq 'A') {
                    print "        \"ans\": [\n";
                }
                print "            $qs";
                print "," if $type ne 'D';
                print "\n";
                if ($type eq 'D') {
                    print "        ]";
                }
            } elsif ($type eq 'P') {
                if (length($s)) {
                    print ",\n";
                    print "        \"img\": $qs\n";
                } else {
                    print "\n";
                }
            }
            $lastk = $type;
        }
    }
    print "    }\n" if (defined $lastk);
    print "]\n";
    return 0;
}

=head1 DIAGNOSTICS

(No Information)

=cut
# (HELPER FUNCTIONS)

=head1 HACKING

(No Information)

=cut
# (MODULE FUNCTIONS)

=head1 HISTORY

=over

=item 0.x

The initial version.

=back

=cut
sub _version {
    print "[$LOGNAME]  \n";
    print "Written by Lenik,  Version 0.$RCSID{rev},  Last updated at $RCSID{date}\n";
}

=head1 SEE ALSO

The L<cmt/"Perl_simple_cli_program_template">

=head1 AUTHOR

Lenik (谢继雷) <lenik (at) bodz.net>

=cut
