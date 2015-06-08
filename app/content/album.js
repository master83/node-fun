$(function(){
	var tmpl = "",
		tdata = {},
		url = document.URL,
		folder = url.substr(url.lastIndexOf("/"), url.length);

	var initPage = function(){

		$.get("/templates/album.html", function(d){
			tmpl = d;
		}, "text");

		$.getJSON("/albums"+folder+".json", function(d){
			$.extend(tdata, d);
		});

		$(document).ajaxStop(function() {
			var finalData = massage(tdata);
			var renderedPage = Mustache.to_html(tmpl, finalData);
			$("body").html(renderedPage);
		});

	}();
});

function massage (data) {
	data.haveAlbums = (data.data.album.photos && data.data.album.photos.length > 0);
	return data;
};