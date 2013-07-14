[Startup Names](http://nicovalencia.github.io/startup-names/)
=============================================================

Rachel and Bing had a great idea to combine startup names by chaining prefix and suffix compounds.
Hargobind and I developed an urge to write some code.

Setup
-----

Install Node.js & NPM, then:

`npm install`

Data Files
----------

- `names.json` : JSON array of company names to use
- `words.json` : JSON array of acceptable prefix/suffixes
- `nodes.json` : JSON array of "node" object (name, prefixes, suffixes)
- `graph.json` : JSON object of company names to an array of following company names
- `units.json` : JSON array of "unit" objects (id, chainPrefix)
- `chains/[UNIT-ID].json` : JSON object of results from work unit
- `best.json` : Processed result of best chains

Commands
--------

- `node names/crunchbase.js` : Scrapes names from crunchbase into names.json
- `node words/dict.js` : Loads words from /usr/share/dict/words into words.json
- `node nodes/words.js` : Creates nodes by finding prefix/suffixes that are in words.json
- `node nodes/hyphens.js` : Creates nodes by using a hyphenation engine
- `node graph/build.js` : Builds nodes into a graph
- `node units/chunk.js` : Builds a list of work units from graph
- `node chains/cache.js` : Processes work units using a relatively simple result caching optimization
- `node best.js` : Combine results to find the best chain
