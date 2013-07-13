var _ = require('lodash');
var fs = require('fs');

function sample(items) {
  if(items.length < 1) { return null; }
  var i = _.random(items.length - 1);
  return items[i];
}

function loadNodes() {
  var nodes = require('./data/nodes-v2.json');
  var names = _.pluck(nodes, 'name');
  var byPrefix = {};

  _.chain(nodes).pluck('prefixes').flatten().uniq().each(function(prefix) { byPrefix[prefix] = []; });
  _.each(nodes, function(node) {
    _.each(node.prefixes, function(prefix) {
      byPrefix[prefix].push(node);
    });
  });

  var step = {};
  _.each(nodes, function(node) {
    step[node.name] = _.chain(node.suffixes)
    .map(function(suffix) { return byPrefix[suffix] || []; })
    .flatten().uniq().pluck('name').value().sort();
  });

  return step;
}

var step = loadNodes();
var names = Object.keys(step);
var cache = {};
var max = 0;

// fs.writeFileSync('./debug.json', JSON.stringify(step, null, '  '));

console.log('Data loaded and preped');
console.log(process.memoryUsage());

_.each(names, function(name) {
  console.log('--------------------------------');
  console.log('New starting name: ', name);

  var index = {};
  var pointer = null;
  var chain = [name];
  index[name] = 0;
  while(chain.length > 0) {
    var last = chain[chain.length - 1];
    var nexts = step[last] || [];

    var next = nexts[nexts.indexOf(pointer) + 1];

    if(cache[next] && cache[next].length > 0) {
      var intersection = _.intersection(cache[next], chain);

      if(intersection.length === 0) {
        // console.log('using cache')
        _.each(cache[next], function(item, i) {
          index[item] = chain.length + i;
        });

        chain = chain.concat(cache[next]);
        pointer = null;

        continue;
      }
    }

    if(next) {
      if(index[next] >= 0) {
        // LOOP!!!!
        if(chain.length > max) { console.log('loop', chain.length, chain); max = chain.length; }
        var loop = chain.slice(index[next], chain.length);
        _.each(loop, function(item, i) {
          if(!cache[item] || cache[item].length < loop.length) {
            cache[item] = loop.slice(i, loop.length).concat(loop.slice(0, i));
            // console.log('New longest loop for "' + item + '" :' + JSON.stringify(cache[item]));
          }
        });

        pointer = next;
      } else {
        // console.log('Push ', next);
        index[next] = chain.length;
        pointer = null;
        chain.push(next);
      }
    } else {
      if(chain.length > max) { console.log('dead-end', chain.length, chain); max = chain.length; }

      _.each(chain, function(item, i) {
        if(!cache[item] ||cache[item].length < chain.length - i) {
          cache[item] = chain.slice(i, chain.length);
          // console.log('New longest tail for "' + item + '" :' + JSON.stringify(cache[item]));
        }
      });

      pointer = chain.pop();
      index[pointer] = false;
    }
  }

  console.log('Best ', cache[name]);
});

console.log('Writing results');

fs.writeFileSync('./data/chains.json', JSON.stringify(cache, null, '  '));

var chains = _.sortBy(Object.values(cache), 'length');
var bestChain = chains[chains.length - 1];
console.log('Best chain has length ', bestChain.length);
console.log(JSON.stringify(bestChain, null, '  '));
