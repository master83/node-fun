var fs = require('fs'),
	helpers = require("../handlers/helpers.js");

exports.version = "0.1.0";

exports.handleGetAlbumPhotos = function (req, res) {
	var albumName = req.params.albumname,
		page = req.query.page || 1,
		pageSize = req.query.pagesize || 10;

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

exports.getPhoto = function(req, res) {
	var fn = req.url.toString().substr(1);
	var rs = fs.createReadStream(fn);
	var ct = helpers.getContentType(fn);
	
	rs.on("error", function(err) {
		console.log("error...", fn);
		res.writeHead(404, { "Content-Type": "application/json" });
		res.end(JSON.stringify({ error: "resource_not_found", message: "What is that?" }));
	});

	res.writeHead(200, { "Conetnt-Type": ct });
	rs.pipe(res);
}

function load_album (albumName, page, pageSize, callback) {
	fs.readdir("../static/albums/"+albumName, function(err, file_list) {
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
			fs.stat("../static/albums/" + albumName + "/" + file_list[i], function(err, stats) {
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