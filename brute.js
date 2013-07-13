var _ = require('lodash');
var nodes = require('./data/nodes.json');

var names = _.uniq(_.pluck(nodes, 'name'));
var namesByPrefix = {}, suffixesByName = {};

_.each(nodes, function(node) {
  (namesByPrefix[node.prefix] = namesByPrefix[node.prefix] || []).push(node.name);
  (suffixesByName[node.name] = suffixesByName[node.name] || []).push(node.suffix);
});

_.each(namesByPrefix, function(names, prefix) {
  namesByPrefix[prefix] = _.uniq(names.sort());
});

_.each(suffixesByName, function(suffixes, name) {
  suffixesByName[name] = _.uniq(suffixes.sort());
});

var chain, pointer;
var bestChains = [];

_.each(names, function(name) {
  chain = [name];
  pointer = null;

  while(chain.length > 0) {
    var item = chain[chain.length - 1];

    var map, nextType;
    if(chain.length % 2 === 1) { // Current item is name, current pointer is suffix
      nextType = 'suffix';
      map = suffixesByName;
    } else {  // Current item is suffix, current pointer is name
      nextType = 'name';
      map = namesByPrefix;
    }

    var values = map[item];

    var value = _.isArray(values) && values[values.indexOf(pointer) + 1];

    if(value && (nextType !== 'name' || chain.indexOf(value) < 0)) {
      chain.push(value);
      pointer = null;
    } else {
      if(bestChains.length < 10 || chain.length / 2 >= bestChains[9].length) {
        var finalChain = _.reject(chain, function(item, i) { return i % 2 === 1; });

        console.log(JSON.stringify(finalChain));

        bestChains.push(finalChain);
        bestChains = _.sortBy(bestChains, 'length').reverse().slice(0, 10);
      }
      pointer = chain.pop();
    }
  }
});

console.log('****************************************************************');
console.log('BEST CHAINS!!!!!');
console.log('****************************************************************');

_.each(bestChains, function(chain) {
  console.log('Length: ', chain.length);
  console.log(JSON.stringify(chain));
});

