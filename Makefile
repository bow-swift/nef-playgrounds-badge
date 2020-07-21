PACKAGES := $(wildcard ./packages/*)
TASKS := build clean

.PHONY: all
all:
	$(MAKE) clean
	$(MAKE) build

.PHONY: site
site: all
	cp -r packages/nef-badge/dist/* site
	cp -r packages/nef-appstore/dist site/recipe

.PHONY: $(TASKS)
$(TASKS): $(PACKAGES)

.PHONY: $(PACKAGES)
$(PACKAGES):
	$(MAKE) -C $@ $(MAKECMDGOALS)
