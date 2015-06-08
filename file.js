var fs = require("fs");

fs.open("test/myfile2.html", "r", function (err, handle) {

	if (err == null) {
		var f = handle;
		var b = new Buffer(100000);

		fs.read(f, b, 0, 100000, null, function(err, bytes_read) {
			if (err == null) {
				console.log(b.toString("utf8", 0, bytes_read));
			} else {
				console.log("Failed to read, " + err.code + ", " + err.message);
			}
		});
	} else {
		console.log("Failed to open, " + err.code + ", " + err.message)
	}
});

console.log("Fgf");