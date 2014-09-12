function WAMP(clientType) {
	var autobahn;
	
	self = this;
	self.callbacks = clientType.wampMethods;
	
	try {
		autobahn = require('autobahn');
	} catch (e) {
		// when running in browser, AutobahnJS fwill be included without a module system.
		console.log(e);
	}
	
		// Set up WAMP connection to router
		var sess;
		var connection = new autobahn.Connection({
			url: url,
			realm: 'tradingpit'
		});

		// Set up 'onopen' handler
		connection.onopen = function(session) {
			self.sess = session;
			var currentSubscription = null;
			
			
			// Subscribe to phases
			session.subscribe('pit.pub.phase', self.callbacks.onPhase).then(
				function(subscription) {
					// console.log("subscription successfull", subscription);
					currentSubscription = subscription;
				}, function(error) {
					//console.log("subscription failed", error);
				});
				
			session.subscribe('pit.pub.players', self.callbacks.storePlayers).then(
				function(subscription) {
					// console.log("subscription successfull", subscription);
					currentSubscription = subscription;
				}, function(error) {
					//console.log("subscription failed", error);
				});


			// Subscribe to a clock
			session.subscribe('pit.pub.clock', self.callbacks.onTick).then(
			function(subscription) {
				// console.log("subscription successfull", subscription);
				currentSubscription = subscription;
			},
			function(error) {
				//console.log("subscription failed", error);
			});
			
			session.subscribe('pit.pub.round', storeRound).then(

		      function(subscription) {
		         console.log("Round Subscription Successfull!", subscription);
		         currentSubscription = subscription;
		      },

		      function(error) {
		        //console.log("subscription failed", error);
		      }

		   );
		
		   session.subscribe("pit.pub.transaction", function(a,d){
				console.log("TRANSACTION: ",d);
				if (trans) {
					trans.push(d);
				}
			});
			
			/*session.subscribe("pit.pub.transactions", function(a,d){
				console.log("Distributiion Data: ", d.distribution);
				distData = d.distribution;
			}); */
			
			session.call("pit.rpc.getPhase", [], {}).then(function(r){
				console.log("SharedScreen Get Phase: ", r);
			});
		};

		// Open connection
		connection.open();
		
		
	}

	var sharedscreenwamp = function() {
		this.wampMethods = {
			// Add Check Phase
			// Collect End of Round Data
			// Recieve which news event to play
			
			test: function(){
				alert("I'm the shared screen!");
			},
			// Define an event handler
			onTick: function(args, kwargs, details) {
				//$(".idletime").html(kwargs.until_round.minutes+":"+kwargs.until_round.seconds);
				$("#time").html(kwargs.end_of_phase.minutes+":"+kwargs.end_of_phase.seconds);
			},
			rpcCall: function(call) {
				//console.log(call);
			},
			onPhase: function(args, kwargs, details) {
				console.log("onPhase: ", kwargs);
				if (kwargs.action == "enter") {
					switch(kwargs.name){
					
						case "Setup":
							phase = 0;
							loadScreen("shared_2.html", function() {
								$("#eorTrans").empty();
								pChart = new playerChart("#eorTrans", 875,705);
								pChart.draw(roundData.players);
								pChart.drawWinner("#winner");
							});
							break;
						
						case "Round":
							phase = 1;
							loadScreen("shared_1.html", function() {
								$("#trans").empty();
								trans = new transactionChart("#trans", 875,645);
								$("#eqprice").html(trans.eq_price);
								
								$("#status").empty();
								pChart = new playerStatusChart("#status", 830,390);
								//pChart.drawPlayers(roundData.players);
								//setInterval(push,1000);
							});
							break;
						
						case "Wrap-up":
							phase = 2;
							loadScreen("shared_2.html", function() {
								$("#eorTrans").empty();
								pChart = new playerChart("#eorTrans", 875,705);
								pChart.draw(roundData.players);
								pChart.drawWinner("#winner");
							});
							break;
						
						case "Player Recap":
							phase = 3;
							loadScreen("shared_0.html", function() {
								$("#dist").empty();
								dist = new distChart("#dist", 875,840);
								dist.draw(roundData.transactions.distribution);
							});
							break;
							
						case "World News":
							loadScreen("shared_news.html", function() {
								
							});
							break;
						
						}
				} else {
					switch(kwargs.name){
						case "Setup":
							pChart = null;
							break;
						
						case "Round":
							trans = null;
							break;
						
						case "Wrap-up":
							dist = null;
							break;
						
						case "Player Recap":
							pChart = null;
							break;
						
					}
				}
			
			}
		}

		this.wamp = new WAMP(this);
	}
	
	
w = new sharedscreenwamp();

function storeRound(args, kwargs, details) {
	console.log("storeRound(), roundData: ", kwargs);
	roundData = kwargs;
}

var curPlayers;

function storePlayers(args, kwargs, details) {
	curPlayers = kwargs;
}

