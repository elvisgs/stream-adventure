var http = require('http');
var through = require('through');

var tr = through(function(buf) {
	this.queue(buf.toString().toUpperCase());
});

var server = http.createServer(function(req, res) {
	if (req.method === 'POST') {
		req.pipe(tr).pipe(res);
	}
});

server.listen(8001);