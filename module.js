// console.log(module);

// console.log(exports);

var Greeter = require('./greeter');

// var g = greeter.createGreeter("it");

var g = new Greeter("fr");
console.log(g.greet());

// console.log(greeter.helloWorld("en"));
// console.log(greeter.goodbye("fr")); 