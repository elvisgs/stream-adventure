var through = require('through');
var split = require('split');

var count = 1;
var tr = through(function(line) {
	line = line.toString()[count++ % 2 === 0 ? 'toUpperCase' : 'toLowerCase']();
	this.queue(line + '\n');
});

process.stdin.pipe(split()).pipe(tr).pipe(process.stdout);