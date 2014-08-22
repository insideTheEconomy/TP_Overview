function WAMP(clientType) {
	var autobahn;
	
	self = this;
	self.callbacks = clientType.wampMethods;
	
	try {
		autobahn = require('autobahn');
	} catch (e) {
		// when running in browser, AutobahnJS will be included without a module system.
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
			loadScreen("shared_1.html");
			
			// Subscribe to phases
			session.subscribe('pit.pub.phase', self.callbacks.onPhase).then(
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
				console.log(call);
			},
			onPhase: function(args, kwargs, details) {
				console.log("onPhase: ", kwargs);
				if (kwargs.action == "enter") {
					switch(kwargs.name){
					
						case "Setup":
							phase = 0;
							//loadScreen("shared_0.html");
							break;
						
						case "Round":
							phase = 1;
							//loadScreen("shared_1.html");
							break;
						
						case "Wrap-up":
							phase = 2;
							//loadScreen("shared_2.html");
							break;
						
						case "Player Recap":
							phase = 3;
							//loadScreen("shared_0.html");
							break;
						
						}
				} else {
					switch(kwargs.name){
						case "Setup":
							break;
						
						case "Round":
							break;
						
						case "Wrap-up":
							break;
						
						case "Player Recap":
							break;
						
					}
				}
			
			}
		}

		this.wamp = new WAMP(this);
	}
	
	
w = new sharedscreenwamp();
