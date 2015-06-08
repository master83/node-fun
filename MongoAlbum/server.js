var express = require("express"),
fs = require('fs'),
path = require('path'),
albumHandler = require('./handlers/albums.js'),
helpers = require("./handlers/helpers.js"),
pageHandler = require("./handlers/pageHandler.js"),
photoHandler = require("./handlers/albumPhoto.js"),
staticContent = require("./handlers/staticContent.js");

//	/albums.json
//	/albums/album1.json

// 	/content/blah.html

// curl -i -X GET http://localhost:8080

var app = express();
app.use(express.logger('dev')); //auto logger
app.use(express.responseTime()); // response time in the header of the request
app.use(express.static(__dirname + "/../static")); // will automatically serve all the requests for static content

// app.use(function (req, res, next) {
// 	//console.log("Don't want it"); //middleware, first log, then next()

// 	if (req.url == "/foo") {
// 		res.end("wooo!!!");
// 		return;
// 	} 

// 	next();
// });


app.get("/v1/albums.json", albumHandler.listAlbums);

app.get("/v1/album/:albumname", albumHandler.getAlbum);

app.get("/albums/:albumname", photoHandler.handleGetAlbumPhotos);


// Don't need code to serve static content since we are using middleware now
/*
app.get("/content/:filename", function(req, res){
	staticContent.serveStaticContent('content/', req.params.filename, req, res);
});

app.get("/templates/:filename", function(req, res){
	staticContent.serveStaticContent('templates/', req.params.filename, req, res);
});
*/

app.get("/pages/:pagename", pageHandler.servePage);
app.get("/pages/admin/home", checkAuthentication, pageHandler.servePage);

function checkAuthentication(req, res, next) {
	if (loggedInAsSuperUser()) {
		next();
	} else {
		res.end("You can't do that");
	}
}

function loggedInAsSuperUser(){
	return false;
}

app.get("*", function(req, res) {
	var url = req.url
	
	if(url.endsWith(".png") || url.endsWith(".jpg")) {
		photoHandler.getPhoto(req, res);
	} else {
		helpers.sendFailure(res, 404, { error: "unknown_resource" });
	}
})

function handleGetAlbum (req, res) {
	var albumName = req.params.albumname,
		page = req.query.page,
		pageSize = req.query.pagesize;

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


app.listen(5000);
 
String.prototype.endsWith = function(suffix) {
    return this.indexOf(suffix, this.length - suffix.length) !== -1;
};