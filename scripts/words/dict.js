var path = require('path');
var fs = require('fs');
var _ = require('lodash');

var DATA_DIR = process.env.DATA_DIR || './data';

var words = fs.readFileSync('/usr/share/dict/words', 'utf-8').split('\n');
words = _.reject(words, function(word) { return /^[A-Z]/.test(word); });
fs.writeFileSync(path.join(DATA_DIR, 'words.json'), JSON.stringify(words, null, '  '));
