SHELL = /bin/bash

SCSS = sassc
SCSSFLAGS = -I /usr/share/javascript/zwk

OBJECTS = \
    list.css \
    skel.css

%.css: %.scss
	$(SCSS) $(SCSSFLAGS) "$<" "$@"

all: $(OBJECTS)

auto-build:
	onchange $(patsubst %, -f %, .) make all

clean: 
	rm -f $(OBJECTS)

