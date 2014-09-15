
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
	d.meat = [false,true,false,false][~~(Math.random()*4)];
}
players.buyer.forEach(makeTransactions);
players.seller.forEach(makeTransactions);

var transactions = '[{"buyer":{"position":0,"shape":"circle","role":2,"name":"SLH","id":5063031920437114},"price":6,"seller":{"position":7,"shape":"triangle","role":4,"name":"JDS","id":146336874448735},"time":"2014-08-21T17:11:10.493Z"},{"buyer":{"position":2,"shape":"circle","role":1,"name":"SLH","id":5063031920437114},"price":8,"seller":{"position":5,"shape":"triangle","role":6,"name":"JDS","id":146336874448735},"time":"2014-08-21T17:11:14.691Z"},{"buyer":{"position":2,"shape":"square","role":1,"name":"WRN","id":349404973523761},"price":5,"seller":{"position":7,"shape":"triangle","role":4,"name":"JDS","id":146336874448735},"time":"2014-08-21T17:11:15.613Z"},{"buyer":{"position":0,"shape":"circle","role":1,"name":"SLH","id":5063031920437114},"price":6,"seller":{"position":7,"shape":"triangle","role":7,"name":"JDS","id":146336874448735},"time":"2014-08-21T17:11:19.162Z"},{"buyer":{"position":1,"shape":"square","role":1,"name":"WRN","id":349404973523761},"price":5,"seller":{"position":6,"shape":"triangle","role":5,"name":"JDS","id":146336874448735},"time":"2014-08-21T17:11:19.608Z"},{"buyer":{"position":1,"shape":"circle","role":2,"name":"SLH","id":5063031920437114},"price":5,"seller":{"position":7,"shape":"triangle","role":6,"name":"JDS","id":146336874448735},"time":"2014-08-21T17:11:20.323Z"},{"buyer":{"position":2,"shape":"circle","role":0,"name":"SLH","id":5063031920437114},"price":6,"seller":{"position":5,"shape":"triangle","role":4,"name":"JDS","id":146336874448735},"time":"2014-08-21T17:11:25.067Z"},{"buyer":{"position":2,"shape":"circle","role":0,"name":"SLH","id":5063031920437114},"price":5,"seller":{"position":6,"shape":"triangle","role":7,"name":"JDS","id":146336874448735},"time":"2014-08-21T17:11:28.515Z"},{"buyer":{"position":2,"shape":"square","role":3,"name":"WRN","id":349404973523761},"price":5,"seller":{"position":7,"shape":"triangle","role":6,"name":"JDS","id":146336874448735},"time":"2014-08-21T17:11:29.744Z"},{"buyer":{"position":1,"shape":"square","role":1,"name":"WRN","id":349404973523761},"price":9,"seller":{"position":4,"shape":"square","role":5,"name":"RAY","id":1919936511018012},"time":"2014-08-21T17:11:30.870Z"},{"buyer":{"position":1,"shape":"square","role":2,"name":"WRN","id":349404973523761},"price":3,"seller":{"position":6,"shape":"triangle","role":7,"name":"JDS","id":146336874448735},"time":"2014-08-21T17:11:32.259Z"},{"buyer":{"position":3,"shape":"circle","role":1,"name":"SLH","id":5063031920437114},"price":9,"seller":{"position":6,"shape":"triangle","role":5,"name":"JDS","id":146336874448735},"time":"2014-08-21T17:11:34.104Z"},{"buyer":{"position":3,"shape":"circle","role":1,"name":"SLH","id":5063031920437114},"price":7,"seller":{"position":7,"shape":"triangle","role":6,"name":"JDS","id":146336874448735},"time":"2014-08-21T17:11:38.805Z"},{"buyer":{"position":1,"shape":"square","role":2,"name":"WRN","id":349404973523761},"price":3,"seller":{"position":7,"shape":"triangle","role":5,"name":"JDS","id":146336874448735},"time":"2014-08-21T17:11:40.257Z"},{"buyer":{"position":0,"shape":"square","role":3,"name":"WRN","id":349404973523761},"price":10,"seller":{"position":7,"shape":"square","role":7,"name":"RAY","id":1919936511018012},"time":"2014-08-21T17:11:40.271Z"},{"buyer":{"position":3,"shape":"circle","role":2,"name":"SLH","id":5063031920437114},"price":6,"seller":{"position":5,"shape":"triangle","role":5,"name":"JDS","id":146336874448735},"time":"2014-08-21T17:11:43.567Z"},{"buyer":{"position":0,"shape":"circle","role":1,"name":"SLH","id":5063031920437114},"price":9,"seller":{"position":4,"shape":"square","role":6,"name":"RAY","id":1919936511018012},"time":"2014-08-21T17:11:47.037Z"},{"buyer":{"position":0,"shape":"circle","role":3,"name":"SLH","id":5063031920437114},"price":6,"seller":{"position":5,"shape":"triangle","role":6,"name":"JDS","id":146336874448735},"time":"2014-08-21T17:11:55.199Z"},{"buyer":{"position":2,"shape":"circle","role":1,"name":"SLH","id":5063031920437114},"price":9,"seller":{"position":4,"shape":"square","role":4,"name":"RAY","id":1919936511018012},"time":"2014-08-21T17:11:59.046Z"},{"buyer":{"position":0,"shape":"circle","role":2,"name":"SLH","id":5063031920437114},"price":6,"seller":{"position":7,"shape":"triangle","role":7,"name":"JDS","id":146336874448735},"time":"2014-08-21T17:12:01.298Z"},{"buyer":{"position":3,"shape":"circle","role":1,"name":"SLH","id":5063031920437114},"price":10,"seller":{"position":5,"shape":"square","role":4,"name":"RAY","id":1919936511018012},"time":"2014-08-21T17:12:01.794Z"}]';
transactions = JSON.parse(transactions);

function connect(host){
	
	connection = null;
	trans = null;
	dist = null;
	
	$("#trans").empty();
	$("#dist").empty();
	
	//trans = new transactionChart("#trans", 875,645);
	//dist = new distChart("#trans", 825,665);
	pChart = new playerStatusChart("#trans", 830,390);

	pChart.drawPlayers(players);
	setInterval(push,200);
	var ti = 0;
	
	function push(){
		pChart.push(transactions[ti])
		ti = (ti == transactions.length-1) ? 0 : ti+1;
	}
	
//	pChart.drawWinner(".qt");
	connection = new autobahn.Connection({
		url: 'ws://'+host+':8080/ws',
		realm: 'tradingpit'
	});

	// Set up 'onopen' handler
/*	connection.onopen = function(session) {
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
	}*/

}
