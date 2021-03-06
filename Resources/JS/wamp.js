function WAMP(clientType) {
	var myShape;
	var autobahn;
	
	self = this;
	self.clientType = clientType;
	self.callbacks = clientType.wampMethods;
	self.currentOffers = [];
	self.myPlayer;
	self.offer;
	
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
			self.sess.subscribe("pit.pub."+self.sess.id, self.callbacks.onCard);



			// Subscribe to a topic
			session.subscribe('pit.pub.offers', self.callbacks.onOffer).then(

			function(subscription) {
				// console.log("subscription successfull", subscription);
				currentSubscription = subscription;
				console.log("subbed to offers", subscription);
			},

			function(error) {
				//console.log("subscription failed", error);
			}

			);
			session.subscribe('pit.pub.clock', self.callbacks.onTick).then(

			function(subscription) {
				// console.log("subscription successfull", subscription);
				currentSubscription = subscription;
			},

			function(error) {
				//console.log("subscription failed", error);
			}

			);
		};

		// Open connection
		connection.open();
	}

	var aiwamp = function() {
		this.wampMethods = {
			test: function(){
				alert("I'm an AI!");
			},
			// Define an event handler
			onCard: function(args, kwargs, details){

			},
			onTick: function(args, kwargs, details) {

			},
			onOffer: function(args, kwargs, details) {

			},
			onAccept: function(args, kwargs, details) {

			}
		}

		this.wamp = new WAMP(this);
	}

	var playerwamp = function() {
		this.wampMethods = {
			test: function(){
				alert("I'm a Player!");
			},
			// Define an event handler
			onCard: function(args, kwargs, details){
				console.log("CARD", kwargs);
				$(".moneyCounter").html("$"+kwargs.surplus);
				$(".value").html(kwargs.reserve);
				reserve = kwargs.reserve;
				self.myPlayer = kwargs;
			},
			onTick: function(args, kwargs, details) {
				//console.log("Tick", args, kwargs, details);
				$("#time").html(kwargs.minutes+":"+kwargs.seconds);
			//	console.log("tick");
			},
			onOffer: function(args, kwargs, details) {
				$.get("offer_template.html", function(d){
					Mustache.parse(d);
					var render = Mustache.render(d,kwargs);
					$('#offers').html(render);
				});
			},
			submitOffer: function(price) {
				self.offer.owner = self.myPlayer;
				self.offer.price = price;
				console.log("self.offer= ", self.offer);	
				w.wampMethods.rpcCall("offer");	
			},
			accept: function(id) {
				self.acceptedOffer = self.currentOffers[id%4];
				w.wampMethods.rpcCall("accept");	
			},
			rpcCall: function(call) {
				console.log(call);
				if (call == "offer") {

					self.sess.call("pit.rpc.offer", [], {
						id: self.sess.id,
						offer: self.offer
					});
				} else if (call == "accept") {
					console.log("RPC CALL self.acceptedOffer= ", self.acceptedOffer);
					self.sess.call("pit.rpc.accept", [],
					{
						id: self.sess.id,
						offer: self.acceptedOffer 			//{offer object} 
					}).then(function(r) {
						console.log("onAccept return r: ", r);
					},
					function(e) {
						console.log("Error: ", e);
					});
				}
			}
		}

		this.wamp = new WAMP(this);
	}

	if (ai) {
		w = new aiwamp();
		//w.wamp.prototype.test();
	} else {
		w = new playerwamp();
		//w.wamp.prototype.test();
	}
