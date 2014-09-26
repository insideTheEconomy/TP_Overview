/* - */

//-- Variable Declarations  -- //

var goKiosk;
var hideMouse;

var role;
var opponent;
var position;
var ai;
var w; 
var url;
var curScreen;

var initHTML;
var initiated;
var curScreen;
var offerPrice;
var reserve;
var name;
var phase;

var distData;
var roundData;
var trans;
var pChart;
var dist;
var connection;

var headline;
// --------------------------- //

try{
	var user = process.env.USER;
	var homeDir = "/Users/"+user+"/exhibit/";
	var config = "tpoverview.json";
	settings = require(homeDir+config);
	console.log("Using tpoverview.json Settings: ", settings);
	

	url = settings.url;
	curScreen = settings.curScreen;
	phase = 0;
	goKiosk = settings.kiosk;
	hideMouse = settings.hideMouse;
}
catch(e){
	console.log("Using DEFAULT cfg: ", e);
	role = "seller";
	opponent = "buyer";
	position = 0;
	ai = false;
	phase = 0;
}

// --------------------------- //