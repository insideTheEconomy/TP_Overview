function runNews(){
	$('video').remove();
	$.get("news_template.html", function(d){
		Mustache.parse(d);
		var render = Mustache.render(d,headline); //added headline to global vars in config.js
		$('#newswrapper').html(render);
	});
}
var runBumper = true; 
/*var headline = {
	"headline":"Wheat Prices Expected to Tumble",
	"image" : "export.jpg",
	"description":"Many exporting countries report record harvests",
	"region": "The Midwest",
	"deck":{
	"buyer" : [
		10,10,9,8,7,6,6,6,4
	],
	"seller" : [
		2,2,3,4,5,6,6,7,8
	]
	}*/

$(videoEnd())

function videoEnd(){
	console.log("VIDEO ENDED"); 
	$('video').on('ended', runNews);
}