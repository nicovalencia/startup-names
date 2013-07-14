var _ = require('lodash');
var fs = require('fs');
var path = require('path');

var DATA_DIR = process.env.DATA_DIR || './data';

var nodes = require(path.join(process.cwd, DATA_DIR, 'nodes.json'));

var byPrefix = {};
_.each(nodes, function(node) {
  _.each(node.prefixes, function(prefix) {
    if(!byPrefix[prefix]) byPrefix[prefix] = [];
    byPrefix[prefix].push(node.name);
  });
});

var graph = {};
_.each(nodes, function(node) {
  var next = _.map(node.suffixes, function(suffix) {
    return byPrefix[suffix];
  });

  graph[node.name] = _.chain(next).flatten().uniq().value().sort();
});

fs.writeFileSync(path.join(DATA_DIR, 'graph.json'), JSON.stringify(graph, null, '  '));
console.log('Graph written to graph.json');
