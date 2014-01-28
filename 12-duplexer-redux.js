var duplexer = require('duplexer');
var Writable = require('stream').Writable;
var util = require('util');

var count = {};

function CountryStream() {
	Writable.call(this, { objectMode: true });
}

util.inherits(CountryStream, Writable);

CountryStream.prototype._write = function(json, encoding, callback) {
	count[json.country] = (count[json.country] || 0) + 1;
	callback();
};

module.exports = function(counter) {
	var countryStream = new CountryStream();
	countryStream.on('finish', function() {
		counter.setCounts(count);
	});

	return duplexer(countryStream, counter);
};