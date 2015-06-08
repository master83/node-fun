var fs = require("fs"),
	async = require("async");

function loadFileContent(path, callback) {
	var f;
	async.waterfall([
		function (cb) {
			fs.open(path, 'r', cb);
		},

		function (handle, cb) {
			f = handle;
			fs.fstat(f, cb);
		},

		function (stats, cb) {
			if (stats.isFile()) {
				// to read content unless there are, whilst from async is a nice solution
				// async.whilst - takes 3 parameters
				// 1. function -  test function which says "should I continue?"
				// 2. function - function call which takes callback after 1
				// 3. final Last function call 
				var content = '';
				var b = new Buffer(10000);
				var bytes_read = -1;

				async.whilst(
					function () { 
						return bytes_read != 0;
					},
					function (cb) { 
						fs.read(f, b, 0, 10000, null, function(err, br, buffer){
							if (err) {
								cb(err);
								return;
							}
							bytes_read = br;
							if (br > 0) {
								content += b.toString("utf8", 0, br);
							}
							cb(null); 
						});
					},
					function (err, results) { 
						cb (err, content);
					}
				);

			} else {
				cb(makeError("not_a_file", "can't read it"));
			}
		},

		function (fileContents, cb) {
			fs.close(f, function(err) {
				if(err) {
					callback(err);
				} else {
					callback(null, fileContents);
				}
			})
		}

	],
	function (err, results){
		callback(err, results);
	});
}

loadFileContent("test/myfile2.html", function(err, content){
	if (err) console.log(err);
	else console.log(content);
});

function makeError(err, msg) {
	var e = new Error(msg);
	e.code = msg;
	return e;
}
