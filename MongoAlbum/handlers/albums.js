var fs = require('fs'),
	helpers = require("./helpers.js");

exports.version = "0.1.0";


exports.listAlbums = function (req, res) {
	
	load_album_list(function(err, albums) {
		if( err != null ) {
			helpers.sendFailure(res, 503, err);
			return;
		}

		helpers.sendSuccess(res, { albums: albums });
	});
};

exports.getAlbum = function(req, res) {
	fs.readFile('basic.html', 'utf8', function (err, contents) {
		if (err) {
			helpers.sendFailure(res, 503, err);
			return;
		}
		
		res.writeHead(200, { "Content-Type": "text/html" });
		res.end(contents.replace("{{PAGE_NAME}}", "album", true));
	});
};



function load_album_list (callback) {
	fs.readdir("../static/albums/", function(err, file_list) {
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
			fs.stat("../static/albums/" + file_list[i], function(err, stats) {
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



