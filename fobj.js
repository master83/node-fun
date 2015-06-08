var fs = require("fs");

function FileObject() {
	this.filename = null;

	this.exists = function(callback) {
		var self = this;
		console.log("Check: "+ this.filename);
		fs.open(this.filename, "r", function(err, handle) {
			if (err) {
				console.log(self.filename + " doesn't exist.");
				callback(false);
			} else {
				console.log(self.filename + " does exist.");
				callback(true);
				fs.close(handle);
			}
		});
	}
};

var fo = new FileObject();
fo.filename = "sdsdsd.js";

fo.exists(function(doesExists) {
	console.log("results from exists: "+doesExists);
});	