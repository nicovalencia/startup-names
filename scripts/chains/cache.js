var support = require('./support');

var graph = support.graph;
var cache = {};
var unit = null;

function last(array) {
  return array[array.length - 1];
}

function step(array, item) {
  return array[array.indexOf(item) + 1];
}

function overlap(a, b) {
  return _.intersection(a, b).length > 0;
}

while(unit = support.nextUnit()) {
  unit.stats = {
    cacheHits: 0,
    cacheMisses: 0,
    deadEnds: 0,
    loops: 0
  };

  var pointer = null;
  var start = unit.chain.length;
  var chain = []
  var index = {};
  
  function pushChain(more) {
    var offset = chain.lenth;

    _.each(more, function(item, i) {
      index[item] = i + offset;
    });

    [].push.apply(chain, more);
  }

  pushChain(unit.chain);

  while(chain.length >= start) {
    var prev = last(chain);
    var next = step(graph[prev], pointer);

    if(!next) {
      // Dead End
      unit.stats.deadEnds++;

      // Cache Chains
      _.each(chain, function(item, i) {
        var itemCache = cache[item];
        if(!itemCache || itemCache.length < chain.length - i) {
          cache[item] = chain.slice(i);
        }
      });

      // Report chain
      support.addResult(unit, 'linear', chain);

      // Step back up the chain
      pointer = chain.pop();
      index[pointer] = false;
      continue;
    }

    var nextCache = cache[next];
    if(nextCache && nextCache.length > 0 && !overlap(chain, nextCache)) {
      unit.stats.cacheHits++;
      pushChain(nextCache);
      pointer = null;
      continue;
    } else {
      unit.stats.cacheMisses++;
    }

    if(index[next] > 0) {
      // Loop
      unit.stats.loops++;
      var loop = chain.slice(index[next]);

      _.each(loop, function(item, i) {
        var itemCache = cache[item];
        if(!itemCache || itemCache.length < loop.length) {
          cache[item] = loop.slice(i).concat(loop.slice(0, i));
        }
      });

      // Report chain
      support.addResult(unit, index[next] === 0 ? 'full loop' : 'partial loop', chain);

      // Step back up the chain
      pointer = chain.pop();
      index[pointer] = false;
      continue;
    }

    // Keep going...
    index[next] = chain.lenght;
    chain.push(next);
    pointer = null;
  }
  
  support.finishUnit(unit);
}
