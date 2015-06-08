
Array.prototype.max = function() {
  return Math.max.apply(null, this);
};

Array.prototype.min = function() {
  return Math.min.apply(null, this);
};

var do_op = function (stack, operator) {
	var b = stack.pop();
	var a = stack.pop();

	switch (operator) {
		case '*': stack.push(a*b); break;
		case '-': stack.push(a-b); break;
		case '+': stack.push(a+b); break;
		case '/': stack.push(a/b); break;
		default: throw new Error("Unexpected operator");
	}
},
rpn = function (parts) {
	var stack = [];

	for(var i = 0; i < parts.length; i++) {
		switch (parts[i]) {
			case '+': case '-': case '*': case '/':
				if (stack.length < 2) return false;
				do_op(stack, parts[i]);
				break;
			default:
				var num = parseFloat(parts[i]);
				if (isNaN (num)) return false;
				stack.push(num);
				break;
		}
	}
	
	if (stack.length != 1) return false;
	return stack.pop();
},

getMax = function (parts) {
	return Math.max.apply(null, parts);
},

getMin = function (parts) {
	return Math.min.apply(null, parts);
};


exports.version = "0.5.0";

exports.computeRPN = function(parts) { return rpn(parts); };

exports.getMax = function(parts) { return getMax(parts); };

exports.getMin = function(parts) { return getMin(parts); };

exports.compute = function(parts) { return rpn(parts); };