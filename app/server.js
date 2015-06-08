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
	req.coreUrl = req.parsedUrl.pathname;
	
	var coreUrl = req.coreUrl;

	if (coreUrl.indexOf('/pages/') == 0) {
		servePage(req, res);
	// } else if (coreUrl.substr(0, ) == '/album/') {}
	} else if (coreUrl.indexOf('/album/') == 0) {
		servePage(req, res, true);
	} else if (coreUrl.indexOf('/content/') == 0) {
		serveStaticContent('content/', coreUrl.substr(9), req, res);
	} else if (coreUrl.indexOf('/templates/') == 0) {
		serveStaticContent('templates/', coreUrl.substr(11), req, res);
	} else if (coreUrl.indexOf('/albums.json') == 0) {
		handleLoadAlbums(req, res);
	} 
	// else if (coreUrl.indexOf('/albums') == 0) {
	// 	handleGetAlbum(req, res);
	// } 
	else if (coreUrl.endsWith('.json')) {
		handleGetAlbumPhotos(req, res);
	} else {
		if(coreUrl.endsWith(".png") || coreUrl.endsWith(".jpg")) {
			getPhoto(req, res);
		} else {
			res.writeHead(404, { "Content-Type": "application/json" });
			res.end(JSON.stringify({ error: "unknown_resource" }));
		}
	}
};

function servePage(req, res, isAlbum) {
	var pageName = req.parsedUrl.pathname.substr(7);
	fs.readFile('basic.html', 'utf8', function (err, contents) {
		if (err) {
			res.writeHead(503, { "Content-Type": "text/html" });
			res.end("Server not responding");
			return;
		}

		res.writeHead(200, { "Content-Type": "text/html" });
		res.end(contents.replace("{{PAGE_NAME}}", isAlbum ? "album" : pageName, true));
	});
}

function getPhoto(req, res) {
	var fn = "albums/"+req.parsedUrl.pathname.substr(8);
	var rs = fs.createReadStream(fn);
	var ct = getContentType(fn);

	rs.on("error", function(err) {
		res.writeHead(404, { "Content-Type": "application/json" });
		res.end(JSON.stringify({ error: "resource_not_found", message: "What is that?" }));
	});

	res.writeHead(200, { "Conetnt-Type": getContentType(fn) });
	rs.pipe(res);
}

function serveStaticContent(folder, file, req, res) {
	var fn = folder + file;  //req.parsedUrl.pathname.substr(9);
	// var fn = req.parsedUrl.pathname.substr(9);
	var rs = fs.createReadStream(fn);
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

function handleGetAlbumPhotos (req, res) {
	var albumName = req.coreUrl.substr(7, req.coreUrl.length - 12),
		page = parseInt(req.parsedUrl.query.page) || 1,
		pageSize = parseInt(req.parsedUrl.query.pageSize) || 10;

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
				// var photos = filesOnly.splice(page*pageSize, pageSize);
				callback(null, filesOnly);
				return;
			}
			// stat is an async function
			fs.stat("albums/" + albumName + "/" + file_list[i], function(err, stats) {
				if(err) {
					callback(err);
			 		return;
				}

				var file = file_list[i];

				if(stats.isFile() && (file.endsWith(".jpg") || file.endsWith(".png")))
				{
					filesOnly.push(file_list[i]);
				}

				iterator(i + 1);
			});

		})(0);
		// callback(null, filesOnly);
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

				if(stats.isDirectory()) dirsOnly.push({
					albumName: file_list[i],
					title: file_list[i]
				});

				iterator(i + 1);
			});
		})(0);
		// callback(null, dirsOnly;
	});
};

var s = http.createServer(handle_incoming_request);
s.listen(s.get('port'), function() {
  console.log("Node app is running at localhost:" + s.get('port'))
});
 
String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

