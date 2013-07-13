var async = require('async');
var cheerio = require('cheerio');
var request = require('request');
var fs = require('fs');
var characters = [ "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "other" ];

async.concat(characters, function(character, callback) {
  var url = 'http://www.crunchbase.com/companies?c=' + character;
  request(url, function(err, resp, body){

    var $ = cheerio.load(body);
    var names = [];

    links = $('.col2_table_listing a');
    $(links).each(function(i, link){
      names.push($(link).text());
    });

    console.log('Names fetched for: ', character);

    callback(null, names);
  });
}, function(err, names) {
  if(err) {
    console.warn(err);
    return;
  }

  fs.writeFile('./data/names.json', JSON.stringify(names, null, '  '), function(err) {
    if(err) {
      console.warn(err);
    } else {
      console.log('Startup names saved to data/names.json');
    }
  });
});
