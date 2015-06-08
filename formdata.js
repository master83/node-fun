var http = require("http"),
	qs = require("querystring");

function handleRequest(req, res){
	console.log("Incoming Request: ("+ req.method +") "+req.url);

	var formData = "";

	req.on("readable", function() {
		var d = req.read();

		if ( typeof d == 'string' ) {
			formData
	 += d;
		} else if ( typeof d == 'object' && d instanceof Buffer) {
			formData
	 += d.toString("utf8");
		}
	});

	req.on("end", function() {
		var out = '';
		if( !formData ) {
			out = "I got no form data";
		} else {
			var obj = qs.parse(formData);
			if (!obj) {
				out = "Form data didn't parse";
			} else {
				out = "I got from data: " + JSON.stringify(obj);
			}
		}
		res.end(out);
	});
}

var s = http.createServer(handleRequest);
s.listen(8080);