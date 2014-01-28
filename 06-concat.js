var concat = require('concat-stream');

var reverse = function(str) {
	console.log(str.toString().split('').reverse().join(''));
} 

process.stdin.pipe(concat(reverse));