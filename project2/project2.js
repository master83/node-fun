var rpn = require('rpn');
console.log("RPN:", rpn.compute([112, 3, 4, '+', '-']));
console.log("MIN:", rpn.getMin([12,23,22,1]));
