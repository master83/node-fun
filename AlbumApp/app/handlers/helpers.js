var path = require('path');

exports.version = "0.5.0";

exports.sendFailure = function(res, httpCode, err) {
	var code = err.code || err.name;

	res.writeHead(httpCode, { "Content-Type": "application/json" });
	res.end(JSON.stringify({ error: code, message: err.message }));
};

exports.sendSuccess = function (res, data) {
	res.writeHead(200, { "Content-Type": "application/json" });
	res.end(JSON.stringify({ error: null, data: data }) + "\n");
};

exports.getContentType = function (fileName) {
	var ext = path.extname(fileName).toLowerCase();
	switch (ext) {
		case '.jpg': case '.jpeg':
			return "image/jpeg";
		case '.gif':
			return "image/gif";
		case '.png':
			return "image/png";
		case '.js':
			return "text/javascript";
		case '.css':
			return "text/css";
		case '.html':
			return "text/html";
		default: 
			return "text/plain";
	}
};

