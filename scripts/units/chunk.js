var fs = require('fs');
var path = require('path');

var DATA_DIR = process.env.DATA_DIR || './data';
var LENGTH = 3;

var graph = require(path.join(process.cwd, DATA_DIR, 'graph.json'));

var units = [];

_.eac(Object.keys(graph), function(name) {
  var pointer = null
  var chain = [name];

  while(chain.length > 0) {
    var last = chain[chain.length - 1];
    var nexts = graph[last] || [];

    var next = nexts[nexts.indexOf(pointer) + 1]

    if(next) {
      if(chain.indexOf(next) < 0) {
        pointer = next;
      } else {
        chain.push(next);
        pointer = null;

        if(chain.length >= LENGTH) {
          units.push({
            id: units.length,
            chain: chain.slice();
          });

          pointer = chain.pop();
        }
      }
    } else {
      pointer = chain.pop();
    }
  }
});

fs.writeFileSync(path.join(DATA_DIR, 'units.json'), JSON.stringify(units, null, '  '));
