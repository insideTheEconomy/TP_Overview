 

/*var exec = require('child_process').exec,
	    child;*/
	
$(function () {
	//Happens only FIRST time program is run
	if (!initiated) {
		initHTML = $(document.body).html();
		initiated = true;
	

		child = exec('osascript -e "tell application \"TP_SharedScreen\" to activate"',
		  function (error, stdout, stderr) {
		    console.log('stdout: ' + stdout);
		    console.log('stderr: ' + stderr);
		    if (error !== null) {
		      console.log('exec error: ' + error);
		    }
		});
	}	
	
	//Happens on EVERY restart
	curScreen = 0;
	
	loadScreen();
});

var loadScreen = function(toLoad, onLoad) {
		$(document.body).load(toLoad, onLoad);
}