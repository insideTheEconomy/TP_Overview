
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
	$("#tpserver").change(function(){
			alert("Using "+$("#tpserver").val());
			connect($("#tpserver").val())
	})

})

function connect(host){
	
	
	trans = null;
	dist = null;
	
	$("#trans").empty();
	$("#dist").empty();
	
//	trans = new transactionChart("#trans", 825,665);
	dist = new distChart("#trans", 825,665);
	connection = new autobahn.Connection({
		url: 'ws://'+host+':8080/ws',
		realm: 'tradingpit'
	});

	// Set up 'onopen' handler
	connection.onopen = function(session) {
		console.log("connected to wamp server");
		sess = session;
		var currentSubscription = null;
		sess.subscribe("pit.pub.clock", tick);
		sess.subscribe("pit.pub.phase", setPhase);
		sess.subscribe("pit.pub.players", printPlayers);
		sess.subscribe("pit.pub.offers", printOffers);
		sess.subscribe("pit.pub.transactions", function(a,d){
			//console.log("TRANSACTIONS: ",d);
		//	trans.draw(d.transactions);
			dist.draw(d.distribution);
			
			});
	}
	connection.open();
}
