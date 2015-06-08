var Db = require("mongodb").Db,
	Connection = require("mongodb").Connection,
	Server = require("mongodb").Server,
	async = require("async"),
	local = require("../local.config.js");

var host = "localhost";
var port = Connection.DEFAULT_PORT;
var ps = 5;

var db = new Db("PhotoAlbums", 
		new Server(host, port, { auto_reconnect: true, poolSize: ps }),
		{ w: 1 });

exports.init = function(callback) {
	aync.waterfall([
		function(cb) {
			console.log("\n** 1. Open Db");
			db.open(cb);
		},

		function (dbConnection, cb) {
			console.log("\n** 2. create albums and photos collections");
			db.collection("albums", cb);
		},

		function (albumsCollection, cb) {
			exports.albums = albumsCollection;
			db.collection("photos", cb);
		},

		function (photosCollection, cb) {
			exports.photos = photosCollection;
			cb(null);
		}
	], callback);
};

exports.albums = null;
exports.photos = null;