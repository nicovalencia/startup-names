var fs = require('fs');
var async = require('async');

var words = require('./data/words.json');
var names = require('./data/names.json');

var wordsMap = {};

words.forEach(function(word) {
  wordsMap[word] = true;
});

async.concat(names, function(name, callback) {
  var nodes = [];
  for(var i = 3; i < name.length - 2; i++) {
    var prefix = name.slice(0, i);
    if(wordsMap[prefix]) {
      for(var j = i + 3; j < name.length - 2; j++) {
        var suffix = name.slice(j, name.length);
        if(wordsMap[suffix]) {
          nodes.push({
            name: name,
            prefix: prefix,
            suffix: suffix
          });
        }
      }
    }
  }
  callback(null, nodes);
}, function(err, nodes) {
  if(err) {
    console.warn(err);
    return;
  }

  fs.writeFile('./data/nodes.json', JSON.stringify(nodes, null, '  '), function(err) {
    if(err) {
      console.warn(err);
    } else {
      console.log(nodes.length, ' nodes written to ./data/nodes.json');
    }
  });
});
