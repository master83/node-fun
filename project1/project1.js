var rpn = require('rpn');
console.log("RPN:", rpn.computeRPN([2, 300, 4, '+', '-']));
console.log("MAX:", rpn.getMax([12,23,22,1]));