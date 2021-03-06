var path = require('path');
var fs = require('fs');
var _ = require('lodash');

var DATA_DIR = process.env.DATA_DIR || './data';

var words = require(path.join(process.cwd(), DATA_DIR, 'words.json'));
var names = require(path.join(process.cwd(), DATA_DIR, 'names.json'));

var wordsMap = {};

words.forEach(function(word) {
  wordsMap[word] = true;
});

var nodes = [];
_.each(names, function(original) {
  var name = original.toLowerCase();
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
    name: original,
    prefixes: prefixes,
    suffixes: suffixes
  }

  if(node.prefixes.length > 0 && node.suffixes.length > 0) nodes.push(node);
});

fs.writeFile(path.join(DATA_DIR, 'nodes.json'), JSON.stringify(nodes, null, '  '), function(err) {
  if(err) {
    console.warn(err);
  } else {
    console.log(nodes.length, ' nodes written to nodes.json');
  }
});
