function polyBuilder(rad, buyerScale){
	var t = 2*Math.PI.toFixed(3);
	function poly(offset, r, steps,pad ){
   
	    var step = t/steps;

	    var points = [];
	    for (var i = 0; i <= steps-1; i++){
	
	        var pt = [(Math.sin( (i*step)+offset )*r)/*+r+pad*/, (Math.cos((i*step)+offset)*r)/*+r+pad*/];
	        points.push(pt);
        
	    }
	    return points.join(' ');
	}

	rad_buyer = (buyerScale) ? rad*0.5 : rad ;
	pad_buyer = 0;

	rad_seller = rad;
	pad_seller = 0;

	polys = {seller:null,buyer:null};

	polys.buyer = {
	    pentagon : poly(-t/2,rad_buyer,5,pad_buyer ),
	    triangle : poly(-t/2,rad_buyer,3,pad_buyer ),
	    square : poly(t/8,rad_buyer,4,pad_buyer ),
	    circle : poly(0,rad_buyer,128,pad_buyer )
	}

	polys.seller = {
	    pentagon : poly(-t/2,rad_seller,5,pad_seller ),
	    triangle : poly(-t/2,rad_seller,3,pad_seller ),
	    square : poly(t/8,rad_seller,4,pad_seller ),
	    circle : poly(0,rad_seller,128,pad_seller )
	}

	return polys;
}


