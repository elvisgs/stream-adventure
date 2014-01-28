var crypto = require('crypto');
var tar = require('tar');
var through = require('through');
var zlib = require('zlib');

var parser = tar.Parse();
parser.on('entry', function(entry) {
	if (entry.type !== 'File') return;

	var md5 = crypto.createHash('md5', { encoding: 'hex'});

	var write = function(data) {
		md5.update(data);
	};

	var end = function() {
		var encrypted = md5.digest('hex');
		
		this.queue(encrypted + ' ' + entry.path + '\n');
	}

	entry.pipe(through(write, end)).pipe(process.stdout);
});

var decipher = crypto.createDecipher(process.argv[2], process.argv[3]);

process.stdin
	.pipe(decipher)
	.pipe(zlib.createGunzip())
	.pipe(parser)