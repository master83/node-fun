var http = require("http"),
	url = require("url"),
	fs = require('fs'),
	path = require('path');

//	/albums.json
//	/albums/album1.json
// 	/content/blah.html

// curl -i -X GET http://localhost:8080

function handle_incoming_request(req, res) {

	console.log("Incoming request: (" + req.method + ")" + req.url);

	req.parsedUrl = url.parse(req.url, true); // parse URL, pass true to get query parameters as an object
	var coreUrl = req.parsedUrl.pathname;

	if (coreUrl.substr(0,9) == '/content/') {
		serveStaticContent(req, res);
	} else if (req.coreUrl == '/albums.json') {
		handleLoadAlbums(req, res);
	} else if (req.coreUrl.substr(0, 7) == '/albums' && req.coreUrl.substr(req.coreUrl.length - 5) == '.json') {
		handleGetAlbum(req, res);
	} else {
		res.writeHead(404, { "Content-Type": "application/json" });
		res.end(JSON.stringify({ error: "unknown_resource" }));
	}
};

function serveStaticContent(req, res) {
	var fn = req.parsedUrl.pathname.substr(9);
	var rs = fs.createReadStream('content/'+fn);
	var ct = getContentType(fn);

	// res.writeHead(200, { "Conetnt-Type": getContentType(fn) });

	// rs.on("readable", function() {
	// 	var d = rs.read();  
	// 	if(typeof d == 'string')
	// 		res.write(d);
	// 	else if (typeof d == 'object' && d instanceof Buffer)
	// 		if (getContentType(fn).substr(0, 6) == 'image/') res.write(d);
	// 		else res.write(d.toString('utf8'));
	// });	

	// rs.on("end", function() {
	// 	res.end();
	// }); 

	rs.on("error", function(err) {
		res.writeHead(404, { "Content-Type": "application/json" });
		res.end(JSON.stringify({ error: "resource_not_found", message: "What is that?" }));
	});

	res.writeHead(200, { "Conetnt-Type": getContentType(fn) });
	rs.pipe(res);
}

function getContentType (fileName) {
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
}

function handleLoadAlbums (req, res) {
	load_album_list(function(err, albums) {
		if( err != null ) {
			res.writeHead(503, { "Content-Type": "application/json" });
			res.end(JSON.stringify({ error: "file_error", message: err.message }) + "\n");
			return;
		}

		res.writeHead(200, { "Content-Type": "application/json" });
		res.end(JSON.stringify({ error: null, data: { albums: albums }}) + "\n");
	});
};

function handleGetAlbum (req, res) {
	var albumName = req.coreUrl.substr(7, req.coreUrl.length - 12),
		page = parseInt(req.parsedUrl.query.page),
		pageSize = parseInt(req.parsedUrl.query.pageSize);

	// Use Page and Page size query parameters

	load_album(albumName, page, pageSize, function(err, photos) {
		if( err != null ) {
			res.writeHead(503, { "Content-Type": "application/json" });
			res.end(JSON.stringify({ error: "file_error", message: err.message }) + "\n");
			return;
		}

		res.writeHead(200, { "Content-Type": "application/json" });
		res.end(JSON.stringify({ error: null, data: { album: { album_name: albumName, photos: photos }}}) + "\n");
	});
};

function load_album(albumName, page, pageSize, callback) {
	fs.readdir("albums/"+albumName, function(err, file_list) {
		if(err) {
			callback(err);
			return;
		} 

		var filesOnly = [];

		(function iterator(i){
		// for(var i = 0; i < file_list.length; i++) {

			if (i >= file_list.length) {	
				var phots = filesOnly.splice(page*pageSize, pageSize);
				callback(null, phots);
				return;
			}

			// stat is an async function
			fs.stat("albums/" + albumName + "/" + file_list[i], function(err, stats) {
				if(err) {
					callback(err);
			 		return;
				}

				if(stats.isFile()) filesOnly.push(file_list[i]);

				iterator(i + 1);
			});
		})(0);
		// callback(null, dirsOnly;
	});
};

function load_album_list(callback) {
	fs.readdir("albums/", function(err, file_list) {
		if(err) {
			callback(err);
			return;
		} 

		var dirsOnly = [];

		(function iterator(i){
		// for(var i = 0; i < file_list.length; i++) {

			if (i >= file_list.length) {	
				callback(null, dirsOnly);
				return;
			}

			// stat is an async function
			fs.stat("albums/" + file_list[i], function(err, stats) {
				if(err) {
					callback(err);
			 		return;
				}

				if(stats.isDirectory()) dirsOnly.push(file_list[i]);

				iterator(i + 1);
			});
		})(0);
		// callback(null, dirsOnly;
	});
};

var s = http.createServer(handle_incoming_request);
s.listen(8080);
 