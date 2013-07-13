var fs = require('fs');
var _ = require('lodash');

var words = fs.readFileSync('/usr/share/dict/words', 'utf-8').split('\n');
words = _.reject(words, function(word) { return /^[A-Z]/.test(word); });
fs.writeFileSync('./data/words.json', JSON.stringify(words));
