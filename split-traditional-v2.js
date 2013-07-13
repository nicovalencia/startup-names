var fs = require('fs');
var _ = require('lodash');
var words = require('./data/words.json');
var names = require('./data/names.json');

var wordsMap = {};

words.forEach(function(word) {
  wordsMap[word] = true;
});

var nodes = [];
_.each(names, function(name) {
  var words = name.split(/\s+/);

  var prefixes = [], suffixes = [];

  for(var i = 3; i <= name.length; i++) {
    var prefix = name.slice(0, i);
    if(wordsMap[prefix]) prefixes.push(prefix);
  }

  for(var i = 0; i <= name.length - 3; i++) {
    var suffix = name.slice(i, name.length);
    if(wordsMap[suffix]) suffixes.push(suffix);
  }

  var node = {
    name: name,
    prefixes: prefixes,
    suffixes: suffixes
  }

  nodes.push(node);
});

fs.writeFile('./data/nodes-v2.json', JSON.stringify(nodes, null, '  '), function(err) {
  if(err) {
    console.warn(err);
  } else {
    console.log(nodes.length, ' nodes written to ./data/nodes-v2.json');
  }
});
