# Javascript/CSS Compressor Makefile - By Benjamin "balupton" Lupton (MIT Licenced)

MAKEFLAGS = --no-print-directory --always-make
MAKE = make $(MAKEFLAGS)

BUILDDIR = ./.build

CLOSUREURL = http://closure-compiler.googlecode.com/files/compiler-latest.zip
CLOSUREDIR = $(BUILDDIR)/closure
CLOSUREFILE = $(CLOSUREDIR)/compiler.jar
YUIURL = http://yui.zenfs.com/releases/yuicompressor/yuicompressor-2.4.7.zip
YUIDIR = $(BUILDDIR)/yui
YUIFILE = $(YUIDIR)/yuicompressor-2.4.7/build/yuicompressor-2.4.7.jar


all:
	$(MAKE) build;
	$(MAKE) add;


demo:
	open ./demo/index.html

add:
	git add .gitignore CHECKLIST.* COPYING.* demo Makefile README.* scripts

push:
	git push --all ; git push --tags ;

edithooks:
	mate .git/hooks/pre-commit


refresh:
	wget -q http://balupton.github.com/jquery-sparkle/scripts/resources/core.console.js -O scripts/resources/core.console.js ;
	wget -q http://balupton.github.com/jquery-sparkle/scripts/resources/core.string.js -O scripts/resources/core.string.js ;
	wget -q http://balupton.github.com/jquery-sparkle/scripts/resources/jquery.events.js -O scripts/resources/jquery.events.js ;
	wget -q http://balupton.github.com/jquery-sparkle/scripts/resources/jquery.extra.js -O scripts/resources/jquery.extra.js ;
	wget -q http://balupton.github.com/jquery-sparkle/scripts/resources/jquery.utilities.js -O scripts/resources/jquery.utilities.js ;
	wget -q http://balupton.github.com/jquery-scrollto/scripts/resources/jquery.scrollto.js -O scripts/resources/jquery.scrollto.js ;
	wget -q http://balupton.github.com/jquery-history/scripts/resources/jquery.history.js -O scripts/resources/jquery.history.js ;
	wget -q http://balupton.github.com/jquery-history/demo/styles/generic.css -O demo/styles/generic.css ;


pack:
	cat \
		./scripts/resources/core.console.js \
		./scripts/resources/core.string.js \
		./scripts/resources/jquery.events.js \
		./scripts/resources/jquery.extra.js \
		./scripts/resources/jquery.utilities.js \
		./scripts/resources/jquery.scrollto.js \
		./scripts/resources/jquery.history.js \
		./scripts/resources/jquery.ajaxy.js \
		> ./scripts/jquery.ajaxy.js;

compress:
	java -jar $(CLOSUREFILE) --create_source_map ./scripts/closure.map --js_output_file=./scripts/jquery.ajaxy.min.js --js=./scripts/jquery.ajaxy.js;

build:
	$(MAKE) pack;
	$(MAKE) compress;

build-update:
	$(MAKE) clean;
	mkdir $(BUILDDIR) $(CLOSUREDIR) $(YUIDIR);
	cd $(CLOSUREDIR); wget $(CLOSUREURL) -O file.zip; tar -xf file.zip;
	cd $(YUIDIR); wget $(YUIURL) -O file.zip; tar -xf file.zip;

clean:
	rm -Rf $(BUILDDIR);
