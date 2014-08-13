 


$(function () {
	//Happens only FIRST time program is run
	if (!initiated) {
		console.log("Init");
		initHTML = $(document.body).html();
		initiated = true;
	}	
	
	//Happens on EVERY restart
	curScreen = 0;
	
	loadScreen();
});

var loadScreen = function(toLoad) {
		$(document.body).load(toLoad, function() {
		});
}