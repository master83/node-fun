var fs = require("fs");

function loadFileContents(fileName, callback) {
	var rs = fs.createReadStream(fileName),
		fileContents = '';

	rs.on('readable', function(){
		var d = rs.read();
		if (d) {
			if(typeof d == 'string') {
				fileContents += d;
			} else if (typeof d == 'object' && d instanceof Buffer) {
				fileContents += d.toString('utf8');
			}
		}
	});

	rs.on('end', function(){
		callback(null, fileContents);
	});

	rs.on('error', function(err){
		console.log("whoops");
		callback(err);
	});
}

loadFileContents('test/myfile.html', function(err, results){
	if (err) console.log(err);
	else console.log(results);
});