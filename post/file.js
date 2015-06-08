var app = require("express")();
var multer  = require('multer');

//app.use(multer()); // for multipart data like files to upload. 
				   // no need to set any optional property here, multer will set everything itself

app.use(multer());

app.post("*", function (req, res) {
	res.end(JSON.stringify(req.files) + "\n");
});

app.listen(5000);