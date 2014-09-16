var transactionChart = function(sel, w, h){
	var self = this;
	this.polys = polyBuilder(18, true);
	this.transactions = [];
	this.dimen = {
		padding: {
			top: 110,
			bottom:120,
			right: 110,
			left: 120
		},
		
		width:w,	height:h
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
			y: d3.scale.linear(),
			xt: d3.time.scale()
		}
		
		this.scales.x.range([this.dimen.padding.left, this.dimen.inner.right])
			.domain([0,10])
			
		this.scales.y.range([this.dimen.inner.bottom, this.dimen.padding.top])
			.domain([0,20])
		
		this.scales.xt.range([this.dimen.padding.left, this.dimen.inner.right])
		
	}
	
	this.setAxes = function(){
		this.axes=	{
				x: d3.svg.axis().scale(this.scales.x),
				y : d3.svg.axis().scale(this.scales.y).orient("left"), 
				xt : d3.svg.axis().scale(this.scales.xt)
			}
		
	}
	
	this.setScales();	
	this.setAxes();
	this.drawAxes();
	
	this.dotGroup = this.svg.append("g").attr("class","dots")
		
}




transactionChart.prototype.draw = function(_d){
	var self = this;
	var shapes = this.shapes;
	var drawDots = function(_dots){
		_dots.attr({
			transform : function(d,i){
				return "translate("+self.scales.x(i)+","+self.scales.y(d.price)+")"
				}
			}).selectAll("text").data(function(d){
				return[d.seller, d.buyer]
			}).enter().append("text")
			.attr({
				class: function(d,i){return ["dot seller","dot buyer"][i]},
				"text-anchor":"middle",
				dy: function(d,i){return [0,1][i]}
			})
			.text(function(d){return shapes[d.role][d.shape]})
	}
//	console.log("DRAW TRANSACTION DOTS!",_d);
		
	if(_d.length > self.scales.x.domain()[1]){
		self.scales.x.domain([0,_d.length]) 
		self.axes.x.scale(self.scales.x);
		this.xAxis.call(this.axes.x);
		var dots = this.dotGroup.selectAll("g");
		drawDots(dots);
		
	} 
	var newDots = this.dotGroup.selectAll("g").data(_d).enter().append("g");

	drawDots(newDots);
	
}

transactionChart.prototype.push = function(_d){
	var self = this;
	//console.log("TRANSACTION",_d);
	this.transactions.push(_d);
	var shapes = this.shapes;
	var drawDots = function(_dots){
		_dots.attr({
			transform : function(d,i){
				return "translate("+self.scales.x(i)+","+self.scales.y(d.price)+")"
				}
			})
			.selectAll("polygon").data(function(d){
				return[d.seller, d.buyer]
			}).enter().append("polygon")
			.attr({
				class: function(d,i){return ["dot seller","dot buyer"][i]},
				"points":function(d){
					var pts = self.polys[d.role][d.shape]
					//console.log(pts);
					 return pts }
			})
	}
	
	
		if(self.transactions.length > self.scales.x.domain()[1]){
			self.scales.x.domain([0,self.transactions.length]) 
			self.axes.x.scale(self.scales.x);
			this.xAxis.call(this.axes.x);
			var dots = this.dotGroup.selectAll("g");
			drawDots(dots);

		}
		
	var newDots = this.dotGroup.selectAll("g").data(this.transactions).enter().append("g");

	drawDots(newDots);
	
}

/*transactionChart.prototype.push = function(_d){
	var self = this;
	console.log("TRANSACTION",_d);
	this.transactions.push(_d);
	var shapes = this.shapes;
	var drawDots = function(_dots){
		_dots.attr({
			transform : function(d,i){
				return "translate("+self.scales.x(i)+","+self.scales.y(d.price)+")"
				}
			}).selectAll("text").data(function(d){
				return[d.seller, d.buyer]
			}).enter().append("text")
			.attr({
				class: function(d,i){return ["dot seller","dot buyer"][i]},
				"text-anchor":"middle",
				dy: function(d,i){return [0,1][i]}
			})
			.text(function(d){return shapes[d.role][d.shape]})
	}
	
	
		if(self.transactions.length > self.scales.x.domain()[1]){
			self.scales.x.domain([0,self.transactions.length]) 
			self.axes.x.scale(self.scales.x);
			this.xAxis.call(this.axes.x);
			var dots = this.dotGroup.selectAll("g");
			drawDots(dots);

		}
		
	var newDots = this.dotGroup.selectAll("g").data(this.transactions).enter().append("g");

	drawDots(newDots);
	
} */


transactionChart.prototype.drawAxes = function(){
	var self = this;
	this.xAxis = this.svg.append("g")
	  .attr("class", "axis x")
	  .append("g")
	    .attr("transform", "translate(0,"+(self.dimen.inner.bottom+20)+ ")")
	    .call(this.axes.x);
	
	this.yAxix = this.svg.append("g")
	  .attr("class", "axis y")
	  .append("g")
	    .attr("transform", "translate("+(self.dimen.padding.left-20)+ ",0)")
	    .call(this.axes.y)
	
	this.svg.append("text").attr("class","axis label").text("Transactions").attr({
		transform: "translate("+this.dimen.width/2+", "+(this.dimen.inner.bottom+70)+")",
		"text-anchor": "middle",
	});

	this.svg.append("text").attr("class","axis label").text("Transaction price").attr({
		transform: "translate("+(this.dimen.padding.right-50)+", "+(this.dimen.height/2)+") rotate(-90)",
		"text-anchor": "middle",
	});
}
