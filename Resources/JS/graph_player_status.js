var playerStatusChart = function(sel, w, h){
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
	    r2 = self.dimen.inner.height/2;
		
		
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
	this.chordGroup = this.svg.append("g").attr("class","chords").attr("transform","translate("+self.dimen.width/2+","+self.dimen.height/2+")");
	this.dots = this.svg.append("g").attr("class","dots").attr("transform","translate("+self.dimen.width/2+","+self.dimen.height/2+")");
	
	this.setup();
	this.drawArcs();
		
}

playerStatusChart.prototype.setup = function(){
	
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
	this.teams = [_players.seller, _players.buyer];
	this.players = _players.buyer.concat(_players.seller);
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
}

playerStatusChart.prototype.drawArcs = function(){
	this.chords = this.chordGroup.selectAll("g").data(self.matrix).enter().append("g").attr("class",function(d,i,a){return "seller group"+i});
	this.chords.selectAll("path").data(function(d){
			var _d = d;
			return d
		}).enter().append("path").attr("d",	function(d,i){
			return self.arcFunction(d.points, d.height)
		}).attr("class","chord").attr("id",function(d){
			return "b_"+d.buyer+"-s_"+d.seller
		})
		.attr("stroke-width",function(d){return 1});
}

playerStatusChart.prototype.reDraw = function(_t){
	
	this.chords = this.chordGroup.selectAll("g").data(self.matrix)
	this.chords.selectAll("path").data(function(d){
			var _d = d;
			return d
		}).attr("stroke-width",function(d){return d.value});
	
	

}

playerStatusChart.prototype.push = function(t){
	var pB = t.buyer.position;
	var pS = t.seller.position-4;
	console.log("pushing", pB, pS);
	
	if(this.matrix[pB][pS]){
		this.matrix[pB][pS].value += 1;
		this.reDraw();
		var chord_id = "#b_"+t.buyer.position+"-s_"+t.seller.position;
		console.log(d3.selectAll(chord_id));

		this.chordGroup.append("circle").attr("r","10").append("animateMotion").attr({
			"dur":"1s", "repeatCount":"indefinite"
		}).append("mpath").attr("xlink:href",chord_id)
	}

}



















