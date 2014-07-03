var transactionChart = function(){
	self = this;
	this.dimen = {
		padding: {
			top: 60,
			bottom:60,
			right: 60,
			left: 60
		},
		
		width:640,	height:480
	}
	
	this.dimen.inner = {
		width : this.dimen.width - this.dimen.padding.right - this.dimen.padding.right,
		height :  this.dimen.height - this.dimen.padding.top - this.dimen.padding.bottom,
		bottom: this.dimen.height - this.dimen.padding.bottom,
		right: this.dimen.width - this.dimen.padding.right
	}
	
	this.svg = d3.select("#chart").append("svg").attr({
		width: this.dimen.width,
		height: this.dimen.height
	});
	
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
	if(_d.length > 10) self.scales.x.domain([0,_d.length]) 
	
	
	console.log("DRAW DOTS!",_d);
	
	this.dotGroup.selectAll("circle")
		.attr({
			r: 4,	fill: "green",	
			cx: function(d,i){return self.scales.x(i)},
			cy: function(d,i){return self.scales.y(d.price)}
		});
	
	this.dotGroup.selectAll("circle").data(_d).enter().append("circle")
		.attr({
			r: 6,	fill: "red",
			cx: function(d,i){return self.scales.x(i)},
			cy: function(d,i){return self.scales.y(d.price)}
		});
	
}

transactionChart.prototype.drawAxes = function(){
	this.svg.append("g")
	  .attr("class", "axis x")
	  .append("g")
	    .attr("transform", "translate(0,"+self.dimen.inner.bottom+ ")")
	    .call(this.axes.x);
	
		this.svg.append("g")
		  .attr("class", "axis y")
		  .append("g")
		    .attr("transform", "translate("+self.dimen.padding.left+ ",0)")
		    .call(this.axes.y)
}

var c, sess, connection;

$(function(){


	c = new transactionChart();
	connection = new autobahn.Connection({
		url: 'ws://pylos.local:8080/ws',
		realm: 'tradingpit'
	});

	// Set up 'onopen' handler
	connection.onopen = function(session) {
		console.log("connected to wamp server");
		sess = session;
		var currentSubscription = null;
		sess.subscribe("pit.pub.transactions", function(a,d){c.draw(d.transactions)});
	}
	connection.open();
})
