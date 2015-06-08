exports.version = "0.1.0";

var fs = require('fs');

exports.servePage = function(req, res) {
	var pageName = req.params.pagename;
	fs.readFile('basic.html', 'utf8', function (err, contents) {
		if (err) {
			res.writeHead(503, { "Content-Type": "text/html" });
			res.end("Server not responding");
			return;
		}

		res.writeHead(200, { "Content-Type": "text/html" });
		res.end(contents.replace("{{PAGE_NAME}}", pageName, true));
	});
}