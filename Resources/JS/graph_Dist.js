var distChart = function(sel, w, h){
	var self = this;
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
	
	this.svg = d3.select(sel).append("svg").attr({
		width: this.dimen.width,
		height: this.dimen.height
	});
	
	
	this.eq_price;
	
	this.dotGroup = this.svg.append("g").attr("class","dots")
		
}

distChart.prototype.draw = function(_d){
	var self = this;
	var data = _d;
	var keys = Object.keys(_d).map(function(d){
		return +d;
	})
		
	//console.log("DISTRIBUTION KEYS", keys);

	
	


	
	var top = keys.sort(function(a,b){ return data[a].length - data[b].length  })[keys.length-1];
	this.eq_price = top;
	data[top].eq_price = true;
	
	var minx = keys[0];
	var maxx = keys[keys.length-1];
	var maxy = data[top].length+1;
	
	var xdom = d3.extent(keys);

	
	this.setScales = function(){
		this.scales = {
			x : d3.scale.linear(),
			y: d3.scale.linear()
		}
		
	
		
		this.scales.x.range([this.dimen.padding.left, this.dimen.inner.right])
			.domain(xdom)
		
		//console.log(this.scales.x.domain())
			
		this.scales.y.range([this.dimen.inner.bottom, this.dimen.padding.top])
			.domain([0,maxy])
		
	}
	
	this.setAxes = function(){
		this.axes=	{
				x: d3.svg.axis().tickFormat(function(d){ return(d%1==0) ? d : null  }).scale(this.scales.x),
				y : d3.svg.axis().tickFormat(function(d){ return(d%1==0) ? d : null  }).scale(this.scales.y).orient("left")
			}
		
	}
	
	this.setScales();		this.setAxes();
	this.drawAxes();
	
	
	
	console.log("DRAWing DISTRIBUTIOM",_d);

	
	
	
	
	
	
	
	
	
	
	
	
	
		function drawDots(_selection){
			_selection.attr({cx: function(d,i){return self.scales.x(+d)}})
			.transition()
			.attr({
				opacity: 1,
				class: function(d){
					return (data[d].eq_price) ? "dot dist eq_price" : "dot dist";
				},	r: 10,
				
				cy: function(d,i){return self.scales.y(data[d].length)}
			}).text("\u263A");
		}

		var oldDots = this.dotGroup.selectAll("circle")	
		var newDots = this.dotGroup.selectAll("circle").data(keys).enter().append("circle");
		this.dotGroup.selectAll("circle").data(keys).exit().remove();
		
		drawDots(oldDots);
		drawDots(newDots.attr("opacity",0).attr("cy",self.scales.y(0)));
		
		var label = this.dotGroup.append("text").attr({
			class:"name",
			y:self.scales.y(data[self.eq_price].length)-33
		}).selectAll("tspan").data(["\u00A0\u00A0\u00A0 Market","\u25C0\u00A0Clearing","\u00A0\u00A0\u00A0\u00A0Price"])
			.enter().append("tspan").text(function(d){return d}).attr({
				dy: 20,
				x:self.scales.x(self.eq_price)+10
			
		})
	
	
}

distChart.prototype.drawAxes = function(){
	var self = this;
	this.svg.selectAll(".axis").remove();
	this.svg.append("g")
	  .attr("class", "axis x")
	  .append("g")
	    .attr("transform", "translate(0,"+(self.dimen.inner.bottom+20)+ ")")
	    .call(this.axes.x);
	
	this.svg.append("g")
	  .attr("class", "axis y")
	  .append("g")
	    .attr("transform", "translate("+(self.dimen.padding.left-20)+ ",0)")
	    .call(this.axes.y)
	
	this.svg.append("text").attr("class","axis label").text("Transaction Price").attr({
		transform: "translate("+this.dimen.width/2+", "+(this.dimen.inner.bottom+70)+")",
		"text-anchor": "middle",
	});

	this.svg.append("text").attr("class","axis label").text("Number of Transactions").attr({
		transform: "translate("+(this.dimen.padding.right-50)+", "+(this.dimen.height/2)+") rotate(-90)",
		"text-anchor": "middle",
	});
}




//////////////////////////////
//////////////////////////////
////End Distribution Chart ///
//////////////////////////////
//////////////////////////////

