.DEFAULT_GOAL = help

## Dependencies

package-lock.json: _HELP = Lock dependency versions to file
package-lock.json:
	npm i

.PHONY: relock
relock: _HELP = Delete and recreate the lock file
relock:
	rm -rf node_modules/ package-lock.json && $(MAKE) package-lock.json

.PHONY: deps
deps: _HELP = Install project dependencies
deps:
	npm i

## Testing

.PHONY: lint
lint: _HELP = Run linters
lint:
	npm run lint

.PHONY: format
format: _HELP = Apply format/lint fixes
format:
	npm run lint:fix

.PHONY: test
test: _HELP = Run unit tests
test:
	@echo TODO Not Implemented

## Misc

.PHONY: all
all: _HELP = Run linters and unit tests and builds
all: test lint build

.PHONY: clean
clean: _HELP = Remove temporary files
clean:
	rm -rfv .output/ .wxt/ coverage/

.PHONY: distclean
distclean: _HELP = Remove temporary files including node_modules
distclean: clean
	rm -rf node_modules/

define MAKEFILE_HELP_AWK
BEGIN {
	while (getline < "/dev/stdin") if ($$0 == "# Files") break  # Skip lines until targets start being listed.
	while (getline < "/dev/stdin") {
		if ($$0 ~ /^# makefile \(from [`']/ && match($$0, /', line [0-9]+\)$$/)) {
			file_name = substr($$0, 19, RSTART - 19)
			line_no = substr($$0, RSTART + 8, RLENGTH - 8 - 1)
		} else if (match($$0, /^# _HELP = /) || match($$0, /^[^ \t#:]+: _HELP = /)) {
			help = substr($$0, RLENGTH + 1)
			if (RLENGTH > 10) target_name = $$1  # make 4.x
			if (file_name && line_no && target_name && help) {  # Commit to data array if all states are set.
				for (i = 0; file_name SUBSEP line_no SUBSEP i SUBSEP "target_name" in data; i++) {}  # Just increment i.
				data[file_name,line_no,i,"target_name"] = target_name
				data[file_name,line_no,i,"help"] = help
				if (length(target_name) > data["width"]) data["width"] = length(target_name)
				$$0 = ""  # Signal to clear state.
			}
		} else if (match($$0, /^[^ \t#:]+:/)) target_name = $$1  # make 3.
		if (!$$0) file_name = line_no = target_name = help = ""  # Reset state on blank line.
	}

	data["width"] += col1pad + 0  # Adding 0 initializes to int.
	if (col1minwidth + 0 > data["width"]) data["width"] = col1minwidth
	if (col1tab + 0 && (remainder = data["width"] % col1tab)) data["width"] += (col1tab - remainder)

	cyan    = (colors == "true") ? "\033[36m" : ""
	magenta = (colors == "true") ? "\033[35m" : ""
	reset   = (colors == "true") ? "\033[00m" : ""
}

match($$0, /^[ \t]*##[ \t]*[^ \t#]/) {
	gsub(/[ \t]+$$/, "")  # Strip trailing whitespace.
	header = substr($$0, RLENGTH)
}

FILENAME SUBSEP FNR SUBSEP 0 SUBSEP "target_name" in data {
	if (header) { print magenta header ":" reset; header = "" }
	target_fmt = "%-" data["width"] "s"
	for (i = 0; FILENAME SUBSEP FNR SUBSEP i SUBSEP "target_name" in data; i++) {
		printf(cyan target_fmt reset "%s\n", data[FILENAME,FNR,i,"target_name"], data[FILENAME,FNR,i,"help"])
	}
}
endef

.PHONY: help
help: make_workaround = $(MAKE)
help: export program = $(MAKEFILE_HELP_AWK)
help: _HELP = Print help menu
help:
	@($(make_workaround) -qprR $(foreach f,$(MAKEFILE_LIST),-f $(f)) 2>/dev/null || true) |awk -F : \
		-v "col1minwidth=$(or $(HELP_WIDTH),16)" \
		-v "col1tab=$(or $(HELP_TAB),4)" \
		-v "col1pad=$(or $(HELP_PAD),2)" \
		-v "colors=$(or $(HELP_COLORS),true)" \
		"$$program" $(MAKEFILE_LIST)
