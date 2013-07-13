var fs = require('fs');
var _ = require('lodash');
var words = require('./data/words.json');
var names = require('./data/names.json');

var Hypher = require('hypher'),
    english = require('hyphenation.en-us'),
    h = new Hypher(english);

var wordsMap = {};

words.forEach(function(word) {
  wordsMap[word] = true;
});

var nodes = [];
_.each(names, function(name) {
  var words = name.split(/\s+/);
  var prefixSyllables = h.hyphenate(words[0]);
  var suffixSyllables = h.hyphenate(words[words.length - 1]);

  var prefixes = [], suffixes = [];

  for(var i = 1; i <= prefixSyllables.length; i++) {
    prefixes.push(prefixSyllables.slice(0, i).join('').toLowerCase());
  }

  for(var j = 0; j < suffixSyllables.length; j++) {
    suffixes.push(suffixSyllables.slice(j, suffixSyllables.length).join('').toLowerCase());
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
