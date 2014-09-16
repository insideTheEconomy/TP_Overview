var playerStatusChart = function(sel, w, h){
	var self = this;
	this.polys = polyBuilder(40, false);
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
	this.matrix;
	
	
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
	
	
	this.circScale = d3.scale.linear().range([0,Math.PI]).domain([7,0]);

	this.position2point = function(v){
	    r1 = self.dimen.inner.width/2;
	    r2 = self.dimen.inner.height*1.25;
		
		
	    return {x:Math.cos(self.circScale(v))*r1, y:Math.sin(self.circScale(v))*r2}
	}
	
	this.arcScale = d3.scale.linear().range([this.dimen.height/4,-(this.dimen.height/4)]).domain([1,7])
	
	this.arcFunction = function(_pts, _h){
		console.log("H",_h)
	    var d = "M";
	    d+= (_pts[0].x).toString();
	    d+=","
	    d+= (_pts[0].y).toString();
	    d+=" Q0,"+( self.arcScale(_h) ).toString();
	    d+= (_pts[1].x).toString();
	    d+=","
	    d+= (_pts[1].y).toString();
	    return d;
	}
	
	

	
	this.players;
	this.chordGroup = this.svg.append("g").attr("class","chords").attr("transform","translate("+self.dimen.width/2+","+(self.dimen.height/3-20)+")");
	this.dots = this.svg.append("g").attr("class","dots").attr("transform","translate("+self.dimen.width/2+","+(self.dimen.height/3-20)+")");
	
	this.setup();
	this.drawArcs();
		
}

playerStatusChart.prototype.setup = function(){
	var self = this;
	var h = [50, 20, 0, 100 ];
	
	//make a matrix, buyers are rows
	this.matrix = Array.apply(null, Array(4)).map(function (x, i) { return i });
	
	this.matrix.forEach(function(dB,iB,aB){
		
		aB[iB] = Array.apply(null, Array(4)).map(function (x, iS) { return {
			
			buyer: iB, 		seller:iS+4, 		value:0,	height: (iS+4)-iB,
			points: [	self.position2point(iS+4), self.position2point(iB)	 ]
			} });
		
	})
	
	
	

}

playerStatusChart.prototype.drawPlayers = function(_players){
	var self = this;
	
	
	this.teams = [_players.seller, _players.buyer];
	this.players = _players.buyer.concat(_players.seller);
	var AIs = this.players.filter(function(d){
		if(!d.meat){
			d.point = self.position2point(d.position);
		}
		return !d.meat;
		
		})
	console.log("AIS",AIs)
	//this.drawArcs();
	var playerGroups = this.dots.selectAll("g").data(this.players).enter().append("g")
		.attr({
			transform: function(d,i){
				var pt = self.position2point(i);
				return "translate("+pt.x+","+pt.y+")"}
		});
	playerGroups.append("polygon").attr({
		points: function(d){
			console.log("PLAYER",d);
			return self.polys[d.role][d.shape]
			}
	}).attr("class",function(d){return "dot filled "+d.role})	
	
	this.dots.selectAll("image").data(AIs).enter().append("image").attr("xlink:href","./IMAGES/ai.svg")
		.attr({
			width: "50px", height: "50px", x:"-25px", y:"-25px",
			transform: function(d){return "translate(" + d.point.x + "," + d.point.y + ")";}
		})
}

playerStatusChart.prototype.drawArcs = function(){
	var self = this;
	this.chords = this.chordGroup.selectAll("g").data(self.matrix).enter().append("g").attr("class",function(d,i,a){return "seller group"+i});
	this.chords.selectAll("path").data(function(d){
			var _d = d;
			return d
		}).enter().append("path").attr("d",	function(d,i){
			return self.arcFunction(d.points, d.height)
		}).attr("class","chord").attr("id",function(d){
			return "b_"+d.buyer+"-s_"+d.seller
		}).attr("stroke-width",function(d){return 0});
}

playerStatusChart.prototype.reDraw = function(_t){
	var self = this;
	this.chords = this.chordGroup.selectAll("g").data(self.matrix)
	this.chords.selectAll("path").data(function(d){
			var _d = d;
			return d
		}).attr("stroke-width",function(d){return Math.min(d.value*d.value,40)});
	
	

}

playerStatusChart.prototype.push = function(t){
	var self = this;
	var pB = t.buyer.position;
	var pS = t.seller.position-4;
	console.log("pushing", pB, pS);
	
	function translateAlong(path) {
	  var l = path.getTotalLength();
	  return function(d, i, a) {
	    return function(t) {
	      var p = path.getPointAtLength(t * l);
	      return "translate(" + p.x + "," + p.y + ")";
	    };
	  };
	}
	
	
	
	if(this.matrix[pB][pS]){
		var self = this;
		this.matrix[pB][pS].value += 1;
		this.reDraw();
		var chord_id = "#b_"+t.buyer.position+"-s_"+t.seller.position;
		var circ_id = "b_"+t.buyer.position+"-s_"+t.seller.position;
		var chordPath = this.chordGroup.select(chord_id);
		
	
			
		this.chordGroup.append("image").attr("xlink:href","./IMAGES/wheat.svg").attr({
			width: "50px",	height: "50px", x:"-25px", y:"-25px"
		}).attr("class", circ_id+" wheat")
			.transition().ease("linear")
			      .duration(1000)
			      .attrTween("transform", translateAlong(chordPath.node()))
			      .each("end" , function(){
				d3.select("."+circ_id).remove();
			}); 
		
/*		this.chordGroup.append("circle").attr("r","10").append("animateMotion").attr({
			"dur":"1s", "repeatCount":"indefinite"
		}).append("mpath").attr("xlink:href",chord_id)*/
	} 

}



















