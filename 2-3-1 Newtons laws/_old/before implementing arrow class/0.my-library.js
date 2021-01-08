/*******************************************************************************

  ~ My Library ~

  This script defines general clasess and functions.

*******************************************************************************/

//----- Simple jQuery Extensions -----//

// Define $("#object").left() and $("#object").top() for easy access

$.fn.left = function(x){
	if(typeof x !== "undefined"){
		return this.css("left", x + "px");
	}else{
		return this.position().left;
	}
};

$.fn.top = function(x){
	if(typeof x !== "undefined"){
		return this.css("top", x + "px");
	}else{
		return this.position().top;
	}
};

//----- "Document Coordinates" for jQuery -----//

/* I designed the interface on a screen with dimensions 1280*720. However,
   screen sizes vary greatly today so the interface may look very different
   on other screens if I use pixels to measure lengths. To solve this problem,
   I defined the so-called "document coordinates". Basically, on any screen,
   I measure the shorter side of the screen as "720 units". Then whenever
   I have to access the position or size of an object, I measure the length
   in this "unit".
   
   The functions .L(), .T(), .T() and .H() work exactly like .left(), .top(),
   .width() and .height() in jQuery, only lengths are measured in "document
   coordinates". For clarity, whenever a value has a name with suffix _L, _T,
   _W or _H, this value is measured in "document coordinates".                          
   
   Additional functions .CX(), .CY() and .border_W() are defined to access
   the centre of an object and to set the border width.                       */

var doc_scale; // to be calculated in "layout"

$.fn.L = function(x){
	if(typeof x !== "undefined"){
		return this.left(x * doc_scale);
	}else{
		return 1.0 * this.left() / doc_scale;
	}
};

$.fn.T = function(x){
	if(typeof x !== "undefined"){
		return this.top(x * doc_scale);
	}else{
		return 1.0 * this.top() / doc_scale;
	}
};

$.fn.W = function(x){
	if(typeof x !== "undefined"){
		return this.width(x * doc_scale);
	}else{
		return 1.0 * this.width() / doc_scale;
	}
};

$.fn.H = function(x){
	if(typeof x !== "undefined"){
		return this.height(x * doc_scale);
	}else{
		return 1.0 * this.height() / doc_scale;
	}
};

$.fn.CX = function(x){
	var offset = this.W() / 2.0;
	if(typeof x !== "undefined"){
		return this.L(x - offset);
	}else{
		return this.L() + offset;
	}
};

$.fn.CY = function(x){
	var offset = this.H() / 2.0;
	if(typeof x !== "undefined"){
		return this.T(x - offset);
	}else{
		return this.T() + offset;
	}
};

$.fn.border_W = function(x){
	return this.css("border-width", x * doc_scale);
};

//----- Extension for SVG.js -----//

// Position and size

SVG.extend(SVG.Element, {
	L: function(x){
		if(typeof x !== "undefined"){
			return this.x(x * doc_scale);
		}else{
			return 1.0 * this.x() / doc_scale;
		}
	},
	T: function(x){
		if(typeof x !== "undefined"){
			return this.y(x * doc_scale);
		}else{
			return 1.0 * this.y() / doc_scale;
		}
	},
	W: function(x){
		if(typeof x !== "undefined"){
			return this.width(x * doc_scale);
		}else{
			return 1.0 * this.width() / doc_scale;
		}
	},
	H: function(x){
		if(typeof x !== "undefined"){
			return this.height(x * doc_scale);
		}else{
			return 1.0 * this.height() / doc_scale;
		}
	},
	CX: function(x){
		if(typeof x !== "undefined"){
			return this.cx(x * doc_scale);
		}else{
			return 1.0 * this.cx() / doc_scale;
		}
	},
	CY: function(x){
		if(typeof x !== "undefined"){
			return this.cy(x * doc_scale);
		}else{
			return 1.0 * this.cy() / doc_scale;
		}
	}
});

// Radius for circle, ellipse, rectangle

SVG.extend(SVG.Shape, {
	R: function(x){
		if(typeof x !== "undefined"){
			return this.radius(x * doc_scale);
		}else{
			return 1.0 * this.radius() / doc_scale;
		}
	}
});

// Stroke width, stroke dash array (assume input is a single number)

SVG.extend(SVG.Shape, {
	stroke_W: function(x){
		return this.stroke({width: x * doc_scale});
	},
	stroke_dasharray_L: function(x){
		return this.attr("stroke-dasharray", x * doc_scale);
	}
});

// plot() for line, polyline and polygon (assume input is a flat array)

SVG.extend(SVG.Shape, {
	plot_XY: function(a1){
		var i;
		var a2 = new Array(a1.length);
		for(i=0; i<a1.length; i++){
			a2[i] = a1[i] * doc_scale;
		}
		return this.plot(a2);
	}
});

// Set transformation

SVG.extend(SVG.Element, {
	set_translation_XY: function(x,y){
		var t1 = this.transform();
		var t2 = {
			translateX: x * doc_scale,
			translateY: y * doc_scale,
			scaleX: t1.scaleX,
			scaleY: t1.scaleY,
			rotate: t1.rotate,
			origin: [0,0]
		}
		return this.transform(t2);
	},
	set_scale: function(x,y){
		var t1 = this.transform();
		var t2 = {
			translateX: t1.translateX,
			translateY: t1.translateY,
			scaleX: x,
			scaleY: y,
			rotate: t1.rotate,
			origin: [0,0]
		}
		return this.transform(t2);
	},
	set_rotation: function(r){
		var t1 = this.transform();
		var t2 = {
			translateX: t1.translateX,
			translateY: t1.translateY,
			scaleX: t1.scaleX,
			scaleY: t1.scaleY,
			rotate: r,
			origin: [0,0]
		}
		return this.transform(t2);
	}
});













