$(function(){
	var tmpl = "",
		tdata = {};

	var initPage = function(){

		$.get("/templates/home.html", function(d){
			tmpl = d;
		}, "text");

		$.getJSON("/v1/albums.json", function(d){
			$.extend(tdata, d.data);
		});

		$(document).ajaxStop(function() {
			var finalData = massage(tdata);
			var renderedPage = Mustache.to_html(tmpl, finalData);
			$("body").html(renderedPage);
		});

	}();
});

function massage (data) {
	data.haveAlbums = (data.albums && data.albums.length > 0);
	return data;
};