var fs = require("fs");

var f = fs.openSync("server.js", "r");
var b = new Buffer(10000);
var read_so_far = fs.readSync(f, b, 0, 10000);

console.log(b.toString('utf8', 0, read_so_far));