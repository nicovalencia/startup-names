var fs = require('fs');
var _ = require('lodash');

var DATA_DIR = process.env.DATA_DIR || './data';

var names = require(path.join(process.cwd, DATA_DIR, 'names.json'));

var Hypher = require('hypher'),
    english = require('hyphenation.en-us'),
    h = new Hypher(english);

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

fs.writeFile(pth.join(DATA_DIR, 'nodes.json'), JSON.stringify(nodes, null, '  '), function(err) {
  if(err) {
    console.warn(err);
  } else {
    console.log(nodes.length, ' nodes written to nodes.json');
  }
});
