 


$(function () {
	//Happens only FIRST time program is run
	if (!initiated) {
		initHTML = $(document.body).html();
		initiated = true;
	}	
	
	//Happens on EVERY restart
	curScreen = 0;
	
	loadScreen();
});

var loadScreen = function(toLoad, onLoad) {
		$(document.body).load(toLoad, onLoad);
}