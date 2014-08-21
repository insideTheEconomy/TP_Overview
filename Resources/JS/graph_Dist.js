var distChart = function(sel, w, h){
	self = this;
	this.dimen = {
		padding: {
			top: 100,
			bottom:100,
			right: 100,
			left: 125
		},
		
		width:w,	height:h
	}
	
	this.dimen.inner = {
		width : this.dimen.width - this.dimen.padding.right - this.dimen.padding.right,
		height :  this.dimen.height - this.dimen.padding.top - this.dimen.padding.bottom,
		bottom: this.dimen.height - this.dimen.padding.bottom,
		right: this.dimen.width - this.dimen.padding.right
	}
	
	this.svg = d3.select(sel).append("svg").attr({
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
			.domain([0,20])
		this.scales.y.range([this.dimen.inner.bottom, this.dimen.padding.top])
			.domain([0,20])
		
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

distChart.prototype.draw = function(_d){
	console.log("DRAW DIST DOTS!",_d);
	var data = _d;


	var keys = Object.keys(_d);
	var sorted = [];
	var top = keys.sort(function(a,b){ return data[a].length - data[b].length  })[keys.length-1]
	data[top].eq_price = true;
	
	console.log("DISTRIBUTION KEYS", keys);
	
		function drawDots(_selection){
			_selection.attr({
				class: function(d){
					return (data[d].eq_price) ? "dot dist eq_price" : "dot dist";
				},	r: 10,
				cx: function(d,i){return self.scales.x(+d)},
				cy: function(d,i){return self.scales.y(data[d].length)}
			}).text("\u263A");
		}

		var oldDots = this.dotGroup.selectAll("circle")	
		var newDots = this.dotGroup.selectAll("circle").data(keys).enter().append("circle");
		this.dotGroup.selectAll("circle").data(keys).exit().remove();
		
		drawDots(oldDots);
		drawDots(newDots);
	
	
}

distChart.prototype.drawAxes = function(){
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




//////////////////////////////
//////////////////////////////
////End Distribution Chart ///
//////////////////////////////
//////////////////////////////



var dist, sess, connection;

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
	
	
	dist = null;
	
	$("#dist").empty();
	
	dist = new distChart();
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
			console.log("TRANSACTIONS: ",d);
			dist.draw(d.distribution);
			
			});
	}
	connection.open();
}
