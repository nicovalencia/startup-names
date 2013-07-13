var cheerio = require('cheerio');
var request = require('request');
var fs = require('fs');
var characters = [ "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "other" ];
var url, names;

characters.forEach(function(character) {

  url = 'http://www.crunchbase.com/companies?c=' + character;
  request(url, function(err, resp, body){

    var $ = cheerio.load(body);
    names = [];

    links = $('.col2_table_listing a');
    $(links).each(function(i, link){
      names.push($(link).text());
    });

    fs.writeFile("./data/names/"+character+".json", JSON.stringify(names), function(err) {
      if(err) {
        console.log(err);
      } else {
        console.log("Results saved to "+character+".json!");
      }
    });

  });

});
