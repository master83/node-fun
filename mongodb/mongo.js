var Db = require("mongodb").Db,
	Connection = require("mongodb").Connection,
	Server = require("mongodb").Server,
	async = require("async");

var host = "localhost";
var port = Connection.DEFAULT_PORT;

var db = new Db("PhotoAlbums", 
		new Server(host, port, { auto_reconnect: true, poolSize: 20 }),
		{ w: 1 });


// databases 	tables			records 	- normal DB
// databases	collections		documents	- mongo DB


var a1 = {
	_id: "album1",
	name: "album1",
	title: "my first album",
	description: "There are lots of italians",
	date: "2012-05-10"
},
a2 = {
	_id: "album2",
	name: "album2",
	title: "my second album",
	description: "There are lots of albums",
	date: "2013-01-01"
},
a3 = {
	_id: "album3",
	name: "album3",
	title: "my third album",
	description: "There are italians",
	date: "2011-01-12"
};

var pix = [{
	_id: "photo1.png",
	albumid: "album1",
	filename: "photo1.png",
	description: "first photo of the album",
	date: "2012-05-16"
},
{
	_id: "photo2.png",
	albumid: "album1",
	filename: "photo2.png",
	description: "second photo of the album",
	date: "2011-05-11"
},
{
	_id: "IMG.jpg",
	albumid: "album1",
	filename: "IMG.jpg",
	description: "another photo of the album",
	date: "2014-05-11"
},
{
	_id: "creatoMenu.png",
	albumid: "album2",
	filename: "creatoMenu.png",
	description: "first photo of the album2",
	date: "2012-05-15"
},
{
	_id: "IMG1.jpg",
	albumid: "album2",
	filename: "IMG.jpg",
	description: "another photo of the album2",
	date: "2012-05-11"
},
{
	_id: "menu.png",
	albumid: "album3",
	filename: "menu.png",
	description: "second photo of the album3",
	date: "2012-05-11"
}];

var albums, photos;

async.waterfall([
	function(cb) {
		db.collection("Albums", cb); // db.collections("Photos", {safe: true}, cb); this will return collections object if exists else will throuh error, safe is false by default and optional
	},

	function (albumsCollection, cb) {
		albums = albumsCollection;

		db.collection("Photos", cb);
	},

	function (photosCollection, cb) {
		photos = photosCollection;
		albums.insert([a1,a2,a3], { safe: true }, cb);
	},

	function (doc, cb) {
		console.log("I successfully wrote out:");
		console.log(doc);
		// cb(null);

		albums.remove({_id: "album1"}, cb);
	},

	function (docs, cb) {
		console.log("2. After delete:");
		console.log(docs);

		albums.update({ _id: "album2" },
						{ $set: { description: "this is the new description" } },
						{ safe: true },
						cb );
	},

	function (doc, stats, cb) {
		for (var i = 0; i < pix.length; i++) {
			pix[i]._id = pix[i].albumid + "_" + pix[i].filename;
		}

		photos.insert(pix, {safe: true}, cb);
	},

	function (doc, cb) { // update function provides stats
		console.log ("Inserted");
		console.log(doc);
		console.log("---------------")
		// cb(null);

		// albums.find().toArray(cb);  // instead of toArray() can also use each()

		// albums.find().each(function(err, item) { // or instead of using .each() can use stream
		// 	if (item == null) {
		// 		cb(null);
		// 		return;
		// 	}

		// 	console.log("Got an item:" + item.name);
		// }); 

		// var s = albums.find({ $or: [ { name: /^i/ }, { name: /^a/ } ] }).stream();

		var s = photos.find({albumid:'album1'})
				.sort({date: -1}) //descending order
				.skip(2)	// skip first 2 items
				.limit(3)	// limit to 3 items only
				.stream();

		s.on("data", function(item) {
			console.log(item);
		});

		s.on("end", function () {
			cb(null);
		});
	},

	// function (foundResults, cb) {
	// 	console.log("albums.find found:");
	// 	console.log(foundResults);
	// 	cb(null);
	// }

],function(err, results){

	if(err && err.code == 11000) {
		console.log("Dupe _id!!!");
	}
	db.close();
});

