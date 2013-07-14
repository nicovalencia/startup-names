var _ = require('lodash');
var fs = require('fs');
var path = require('path');

var DATA_DIR = process.env.DATA_DIR || './data';
var LENGTH = 3;

var graph = require(path.join(process.cwd(), DATA_DIR, 'graph.json'));

var units = [];

var names = Object.keys(graph);
var count = names.length;
_.each(Object.keys(graph), function(name, i) {
  units.push({
    id: units.length,
    chain: [name]
  });
});

fs.writeFileSync(path.join(DATA_DIR, 'units.json'), JSON.stringify(units, null, '  '));
