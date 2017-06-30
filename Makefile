# Commands
NODEJS = nodejs
NPM = npm
RM = rm
TOUCH = touch

# Computed file-sets
JSFILES = src/*.js

.PHONY: all clean deploy realclean run

all: html/muttrcbuilder.js

html/muttrcbuilder.js: node_modules $(JSFILES)
	$(NODEJS) node_modules/.bin/browserify -t rollupify -r ./src/Builder.js:muttrcbuilder -o $@

node_modules: package.json
	$(NPM) install
	$(TOUCH) $@

clean:
	$(RM) html/muttrcbuilder.js || true

realclean: clean
	$(RM) -r node_modules || true

run: all
	(cd html; python -m SimpleHTTPServer 5000)

deploy: all
	$(NPM) run deploy