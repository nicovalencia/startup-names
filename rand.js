var _ = require('lodash');

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
    .flatten().uniq().pluck('name').value();
  });

  return step;
}

var step = loadNodes();

console.log('Data loaded and preped');
console.log(process.memoryUsage());

var index = {};
var chain = ["Quick Left"];
var maxChain = [];
var total = 0, totalCount = 0;

var count = 0;
while(true) {
  if(chain.length < 1) {
    chain.push(sample(Object.keys(step)));
  }

  var last = chain[chain.length - 1];
  var next = sample(step[last]);

  if(next && !index[next]) {
    chain.push(next);
    index[next] = true;
  } else {
    count++;
    total += chain.length;

    if(chain.length > maxChain.length) {
      console.log('New best chain of length ' + chain.length);
      console.log(chain);
      maxChain = chain.slice(0);
    }

    chain = chain.slice(0, _.random(chain.length - 1));

    // Re-index chain
    index = {};
    _.each(chain, function(name) { index[name] = true; });
  }

  if(count % 1000 == 0) {
    count++;
    console.log('Chains: ', count);
    console.log('Average length: ', total / 999);
    total = 0;
  }
}
