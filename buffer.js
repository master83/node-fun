var b = new Buffer(10000);

var s = "Hello World";

b.write(s);

console.log(s.length);
console.log(b.length);
console.log(Buffer.byteLength(s));