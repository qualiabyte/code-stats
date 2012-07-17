COFFEE_PATHS := test
TEST_PATHS := test

coffee:
	coffee -c $(COFFEE_PATHS)

test:
	./node_modules/.bin/mocha $(TEST_PATHS)

clean: clean_coffee

clean_coffee:
	find $(COFFEE_PATHS) -name '*.coffee' |sed 's/coffee$$/js/' |xargs rm

.PHONY: coffee clean clean_coffee test
