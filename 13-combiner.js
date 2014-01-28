var combine = require('stream-combiner');
var split = require('split');
var through = require('through');
var zlib = require('zlib');

var lastGenre = null;
var books = [];

function groupByGenre(line) {
	if (!line) return;

	var json = JSON.parse(line);
	
	if (json.type === 'genre') {
		var genre = json.name;

		if (lastGenre && (genre !== lastGenre)) {
			var res = { name: lastGenre, books: books };
			this.queue(JSON.stringify(res) + '\n');
		}

		lastGenre = json.name;
		books = [];
	}
	else books.push(json.name);
}

function end() {
	var res = { name: lastGenre, books: books };
	this.queue(JSON.stringify(res) + '\n');
	this.queue(null);
}

module.exports = function() {
	return combine(split(), through(groupByGenre, end), zlib.createGzip());
};