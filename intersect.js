var arrays = require("./arrays.js");

setTimeout(function() {
	console.log("yo yo yo");
}, 300);

// function instersect(arr1, arr2) {
// 	var intersection = [];

// 	for (var i = 0; i < arr1.length; i++) {
// 		for (var j = 0; j < arr2.length; j++) {
// 			if(arr1[i] == arr2[j]) {
// 				intersection.push(arr1[i]);
// 				break;
// 			}
// 		}
// 	}

// 	return intersection;
// }

// console.log(instersect(arrays.arr1, arrays.arr2).length);

function instersect(arr1, arr2, callback) {
	var intersection = [];

	var i = 0;

	function sub_compute_intersection (){
		for (var j = 0; j < arr2.length; j++) {
			if(arr1[i] == arr2[j]) {
				intersection.push(arr1[i]);
				break;
			}
		}

		if(i < arr1.length) {
			i++;
			if(i%1000 === 0) console.log(i);
			setImmediate(sub_compute_intersection);
		} else {
			callback(intersection);
		}
	}

	sub_compute_intersection();

	return intersection;
}

instersect(arrays.arr1, arrays.arr2, function(result){
	console.log(result.length);
});