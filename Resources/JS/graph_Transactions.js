var transactionChart = function(){
	self = this;

	this.dimen = {
		padding: {
			top: 90,
			bottom:100,
			right: 100,
			left: 130
		},
		
		width:825,	height:665
	}
	
	this.dimen.inner = {
		width : this.dimen.width - this.dimen.padding.right - this.dimen.padding.right,
		height :  this.dimen.height - this.dimen.padding.top - this.dimen.padding.bottom,
		bottom: this.dimen.height - this.dimen.padding.bottom,
		right: this.dimen.width - this.dimen.padding.right
	}
	
	this.svg = d3.select("#trans").append("svg").attr({
		width: this.dimen.width,
		height: this.dimen.height
	});
	
	this.shapes = {
		seller: {
			circle: "\u25CB",
			square: "\u25A2",
			triangle: "\u25B3",
			pentagon: "\u2B20",
			
		},	buyer: {
				circle: "\u25CF",
				square: "\u25A0",
				triangle: "\u25B2",
				pentagon: "\u2B1F",

			}
	}
	
	this.svg.selectAll('g');
	
	this.setScales = function(){
		this.scales = {
			x : d3.scale.linear(),
			y: d3.scale.linear()
		}
		
		this.scales.x.range([this.dimen.padding.left, this.dimen.inner.right])
			.domain([0,10])
		this.scales.y.range([this.dimen.inner.bottom, this.dimen.padding.top])
			.domain([0,12])
		
	}
	
	this.setAxes = function(){
		this.axes=	{
				x: d3.svg.axis().scale(this.scales.x),
				y : d3.svg.axis().scale(this.scales.y).orient("left")
			}
		
	}
	
	this.setScales();		this.setAxes();
	this.drawAxes();
	
	this.dotGroup = this.svg.append("g").attr("class","dots")
		
}

transactionChart.prototype.draw = function(_d){
	if(_d.length > 10){
		self.scales.x.domain([0,_d.length]) 
		self.axes.x.scale(self.scales.x);
		this.xAxis.call(this.axes.x)
	} 
	
	
	console.log("DRAW DOTS!",_d);
	var shapes = this.shapes;
/*	this.dotGroup.selectAll("text")
		.attr({
			fill: "green",	
			x: function(d,i){return self.scales.x(i)},
			y: function(d,i){return self.scales.y(d.price)}
		}).text(this.shapes.seller[d.seller.shape]); */
	
	this.dotGroup.selectAll("text").data(_d).enter().append("text")
		.attr({
			fill: "red",
			x: function(d,i){return self.scales.x(i)},
			y: function(d,i){return self.scales.y(d.price)}
		}).text(function(d){
			console.log("shapes",shapes)
			//return d.seller.shape;
			return shapes.seller[d.seller.shape]
			});
	
}

transactionChart.prototype.drawAxes = function(){
	this.xAxis = this.svg.append("g")
	  .attr("class", "axis x")
	  .append("g")
	    .attr("transform", "translate(0,"+self.dimen.inner.bottom+ ")")
	    .call(this.axes.x);
	
		this.yAxix = this.svg.append("g")
		  .attr("class", "axis y")
		  .append("g")
		    .attr("transform", "translate("+self.dimen.padding.left+ ",0)")
		    .call(this.axes.y)
}



//////////////////////////////
//////////////////////////////
////End Distribution Chart ///
//////////////////////////////
//////////////////////////////



var trans, sess, connection;

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
	
	$("#trans").empty();
	
	trans = new transactionChart();
	connection = new autobahn.Connection({
		url: url,
		realm: 'tradingpit'
	});

	// Set up 'onopen' handler
	connection.onopen = function(session) {
		console.log("connected to wamp server");
		sess = session;
		var currentSubscription = null;
		//sess.subscribe("pit.pub.clock", tick);
		//sess.subscribe("pit.pub.phase", setPhase);
		//sess.subscribe("pit.pub.players", printPlayers);
		//sess.subscribe("pit.pub.offers", printOffers);
		sess.subscribe("pit.pub.transactions", function(a,d){
			console.log("TRANSACTIONS: ",d);
			trans.draw(d.transactions);
		});
	}
	connection.open();
}
