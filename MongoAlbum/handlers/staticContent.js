var fs = require('fs'),
	helpers = require("../handlers/helpers.js");

exports.version = "1.0.2";

exports.serveStaticContent = function(folder, file, req, res) {
	var fn = folder + file;  //req.parsedUrl.pathname.substr(9);
	var rs = fs.createReadStream(fn);
	var ct = helpers.getContentType(fn);

	rs.on("error", function(err) {
		res.writeHead(404, { "Content-Type": "application/json" });
		res.end(JSON.stringify({ error: "resource_not_found", message: "What is that?" }));
	});

	res.writeHead(200, { "Conetnt-Type": ct });
	rs.pipe(res);
}