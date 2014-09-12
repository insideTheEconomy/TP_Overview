
var trans, dist, sess, connection;

function tick(a,t){
	var spacer = (t.seconds%2 == 0) ? " " : ":";
	$(".time").html(t.minutes+":"+t.seconds);
}
function setPhase(a,p){
	$(".phase").html(p.name);
}
function printPlayers(a,p){
	$("#log").html("<pre>"+JSON.stringify(p,null,3)+"</pre>");
}
function printOffers(a,o){
	$("#log").html("<pre>"+JSON.stringify(o,null,3)+"</pre>");
}

$(function(){
	connect("localhost")
	console.log("JQUERY CLOSURE");
		connection.open();
/*	$("#tpserver").change(function(){
			alert("Using "+$("#tpserver").val());
			connect($("#tpserver").val())
	})*/

})


var pstring = '{"buyer":[{"name":"YY","cardURI":"pit.pub.2978108324115046","offer":"none","shape":"circle","role":"buyer","transactions":0,"position":0,"round_surplus":13,"reserve":0,"surplus":0,"id":2978108324115046,"meat":"true"},{"name":"BUY","cardURI":"pit.pub.8493243085656114","offer":"none","shape":"square","role":"buyer","transactions":0,"position":1,"round_surplus":6,"reserve":0,"surplus":0,"id":8493243085656114,"meat":"true"},{"name":"POE","cardURI":"pit.pub.2978108324115046","offer":"none","shape":"triangle","role":"buyer","transactions":0,"position":2,"round_surplus":17,"reserve":0,"surplus":0,"id":2978108324115046,"meat":false},{"name":"APE","cardURI":"pit.pub.8493243085656114","offer":"none","shape":"pentagon","role":"buyer","transactions":0,"position":3,"round_surplus":8,"reserve":0,"surplus":0,"id":8493243085656114,"meat":"true"}],"seller":[{"name":"SEL","cardURI":"pit.pub.3828666902752256","offer":"none","shape":"circle","role":"seller","transactions":0,"position":4,"round_surplus":17,"reserve":0,"surplus":0,"id":3828666902752256,"meat":"true"},{"name":"EL","cardURI":"pit.pub.6362857482593107","offer":"none","shape":"square","role":"seller","transactions":0,"position":5,"round_surplus":12,"reserve":0,"surplus":0,"id":6362857482593107,"meat":"true"},{"name":"TRE","cardURI":"pit.pub.3828666902752256","offer":"none","shape":"triangle","role":"seller","transactions":0,"position":6,"round_surplus":18,"reserve":0,"surplus":0,"id":3828666902752256,"meat":"false"},{"name":"PO","cardURI":"pit.pub.6362857482593107","offer":"none","shape":"pentagon","role":"seller","transactions":0,"position":7,"round_surplus":19,"reserve":0,"surplus":0,"id":6362857482593107,"meat":"true"}]}'
var players = JSON.parse(pstring);
function makeTransactions(d){
	d.transactions = ~~(Math.random()*10+1);
}
players.buyer.forEach(makeTransactions);
players.seller.forEach(makeTransactions);


function connect(host){
	
	connection = null;
	trans = null;
	dist = null;
	
	$("#trans").empty();
	$("#dist").empty();
	
	//trans = new transactionChart("#trans", 875,645);
	//dist = new distChart("#trans", 825,665);
	pChart = new playerStatusChart("#trans", 825,665);

	pChart.drawPlayers(players);
//	pChart.drawWinner(".qt");
	connection = new autobahn.Connection({
		url: 'ws://'+host+':8080/ws',
		realm: 'tradingpit'
	});

	// Set up 'onopen' handler
	connection.onopen = function(session) {
		console.log("connected to wamp server");
		sess = session;
		var currentSubscription = null;
	//	sess.subscribe("pit.pub.clock", tick);
	//	sess.subscribe("pit.pub.phase", setPhase);
	//	sess.subscribe("pit.pub.players", printPlayers);
	//	sess.subscribe("pit.pub.offers", printOffers);
		sess.subscribe("pit.pub.round", function(a,d){
			//console.log("TRANSACTIONS: ",d);
		//	pChart.draw(d.players);
		//	dist.draw(d.distribution);
			
			}); 
			sess.subscribe("pit.pub.transaction", function(a,d){
			//	console.log("TRANSACTIONS: ",d);
			//	trans.push(d);
				//dist.draw(d.distribution);
				//console.log(d.distribution);
				//pChart.transaction(d);
				pChart.push(d);
			}); 
	}

}
