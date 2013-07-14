var fs = require('fs');
var path = require('path');

var DATA_DIR = process.env.DATA_DIR || './data';

exports.graph = require(path.join(process.cwd(), DATA_DIR, 'graph.json'));
exports.units = require(path.join(process.cwd(), DATA_DIR, 'units.json'));

exports.nextUnit = function() {
  var unit = null;
  
  while(exports.units.length > 0 && unit === null) {
    unit = exports.units.shift();
    var jsonfile = path.join(DATA_DIR, 'chains', unit.id + '.json');
    var pidfile = path.join(DATA_DIR, 'chains', unit.id + '.pid');

    try {
      fs.writeFileSync(pidfile, process.pid, {flag: 'wx'});
    } catch (err) {
      console.log('Already running? : ' + unit.id);
      unit = null;
      continue;
    }

    if(fs.existsSync(jsonfile)) {
      unit = null;
      continue;
    }
  }

  if(unit) {
    unit.startTime = new Date().getTime();
    console.log('Starting unit: ' + unit.id + ' prefix: ' + JSON.stringify(unit.chain));
  }

  return unit;
};

exports.addResult = function(unit, category, chain) {
  unit.best = unit.best || {};
  var best = unit.best[category] || [];

  if(chain.length > best.length) {
    console.log('**** New best ' + category + ' : ' + chain.length + ' ****');
    console.log(JSON.stringify(chain));

    unit.best[category] = chain;
  }
};

exports.finishUnit = function(unit) {
  unit.finishTime = new Date().getTime();

  unit.runtime = (unit.finishTime - unit.startTime) / 1000;

  var jsonfile = path.join(DATA_DIR, 'chains', unit.id + '.json');
  var pidfile = path.join(DATA_DIR, 'chains', unit.id + '.pid');

  fs.writeFileSync(jsonfile, JSON.stringify(unit, null, '  '));
  fs.unlinkSync(pidfile);

  console.log('Finished unit: ' + unit.id)
  _.each(unit.best, function(chain, category) {
    console.log('best ' + category + ' of ' + JSON.stringify(chain));
  });
};
