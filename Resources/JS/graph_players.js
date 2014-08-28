var playerChart = function(sel, w, h){
	self = this;
	this.polys = polyBuilder(20, false);
	this.winner;
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
	
	
	
	this.dotGroup = this.svg.append("g").attr("class","dots")
	
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
		
}

playerChart.prototype.draw = function(_d){
	var data = _d;
	var self = this;
	
	
	this.setScales = function(){
		this.scales = {
			x : d3.scale.linear(),
			y: d3.scale.linear()
		}
		
		this.scales.x.range([this.dimen.padding.left, this.dimen.inner.right])
			.domain(d3.extent( data.buyer.concat(data.seller).map(function(d,i,a){return d.transactions})))
			
		this.scales.y.range([this.dimen.inner.bottom, this.dimen.padding.top])
			.domain(d3.extent( data.buyer.concat(data.seller).map(function(d,i,a){return d.round_surplus})))
		
	}
	
	var noDec = function(i){
		return (i%1==0) ? i : null;
	}
	
	this.setAxes = function(){
		this.axes=	{
				x: d3.svg.axis().tickFormat(noDec).scale(this.scales.x),
				y : d3.svg.axis().tickFormat(noDec).scale(this.scales.y).orient("left")
			}
		
	}
	
	this.setScales();		this.setAxes();
	this.drawAxes();
	
	var concat = data.buyer.concat(data.seller);
	winner = concat.sort(function(a,b){return b.round_surplus - a.round_surplus})[0];
	self.winner = winner;
	data[winner.role][winner.position%4].winner = true;
	
	
	
	console.log(winner.role,winner.position%4);
	console.log(data[winner.role][winner.position%4]);
	this.scales.x.domain = d3.extent( concat.map(function(d,i,a){return d.transactions}) )
	this.axes.x.scale(this.scales.x);
	this.svg.select("g.axis.x").call(self.axes.x);
	
	var shapes = this.shapes;
	var scales = this.scales;
	
	var keys = Object.keys(data);

	var playerGroups = this.dotGroup.selectAll("g").data(keys).enter().append("g")
		.attr("class", function(d){return d})
		
	var players = playerGroups.selectAll("g").data(function(d){return data[d]}).enter().append("g").attr({
		class: function(d){
			var cl = (d.winner) ? "dot_group "+d.name+ " winner" : "dot_group "+d.name;
			return cl
		},
		transform: function(d){
			var _x = self.scales.x(d.transactions);
			var _y = self.scales.y(d.round_surplus)
			return "translate("+_x+","+_y+")"
		}	
		})
		
		d3.select(".winner").append("circle").attr({
			cx: 0, r: 25, class: "winner_circle"
		})
		
		players.append("polygon").attr({
			points: function(d){
				console.log("PLAYER",d);
				return self.polys[d.role][d.shape]
				}
		}).attr("class",function(d){return "dot "+d.role})
		
		players.append("text").attr({
			"text-anchor": "middle",
			class: "name",
			dy: 6
		}).text(function(d){
			text = d.name;
			return text;
		})
		
}

playerChart.prototype.drawWinner = function(sel){
	var self = this;
	var winnerGroup = d3.select(sel).append("svg").attr({width:100,height:100, class:"dot_group"})/*.append("g").attr("class","winnerGroup").attr({
	
	});*/
	console.log("WINNER",self.winner);
	var role = self.winner.role;
	var shape = self.winner.shape;
	winnerGroup.append("polygon").attr({
		transform: "translate(50,50) scale(2)",
		points: self.polys[role][shape]	
	}).attr("class",function(d){return "dot "+role})
	
	winnerGroup.append("text").attr({
		transform: "translate(50,50) scale(2)",
		"text-anchor": "middle",
		class: "name",
		dy: 6
	}).text(self.winner.name)	
}

playerChart.prototype.drawAxes = function(){
	this.svg.append("g")
	  .attr("class", "axis x")
	  .append("g")
	    .attr("transform", "translate(0,"+(self.dimen.inner.bottom+10)+ ")")
	    .call(this.axes.x);
	
		this.svg.append("g")
		  .attr("class", "axis y")
		  .append("g")
		    .attr("transform", "translate("+(self.dimen.padding.left-20)+ ",0)")
		    .call(this.axes.y)
}




