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

//----- "Document Coordinates" Extensions for jQuery -----//

/* I designed the interface on a screen with dimensions 1280*720. However,
   screen sizes vary greatly today so the interface may look very different
   on other screens if I use pixels to measure lengths. To solve this problem,
   I defined the so-called "document coordinates". Basically, on any screen,
   I measure the shorter side of the screen as "720 units". Then whenever
   I have to access the position or size of an object, I measure the length
   in this "unit".
   
   If not specified, variables storing positions and sizes of objects on screen
   (such as font size, border width, padding width) are measured in "document
   coordinates" by default. In cases where it is necessary to indicate the same
   value in different coordinate systems, the suffices _L, _T, _W, _H, _X, _Y,
   _XY, _CX, _CY, _R, etc, are used for "document coordinates" while the
   suffices _x, _y, _w, _h, _cx, _cy, _r, etc, are used for other coordinate
   systems (such as lengths measured in pixels or in other internal coordinate
   systems). Note that _L may stand for "left" or "length".
   
   The functions .L(), .T(), .T(), .H() work exactly like .left(), .top(),
   .width(), .height() in jQuery. Additional functions .CX(), .CY(), .MX(),
   .MY() are defined to access the centre and lower-right corner of an object
   ("M" stands for "maximum").
   
   Two more functions .border_W() and .font_H() are defined to set the border
   width and font size.                                                       */

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

$.fn.MX = function(x){
	var W = this.W();
	if(typeof x !== "undefined"){
		return this.L(x - W);
	}else{
		return this.L() + W;
	}
};

$.fn.MY = function(x){
	var H = this.H();
	if(typeof x !== "undefined"){
		return this.T(x - H);
	}else{
		return this.T() + H;
	}
};

$.fn.border_W = function(x){
	return this.css("border-width", x * doc_scale);
};

$.fn.font_H = function(x){
	return this.css("font-size", x * doc_scale + "px");
};

//----- Other Extensions for jQuery -----//

$.fn.auto_size = function(){
	return this.css({
		"width": "auto",
		"height": "auto"
	});
};

//----- "Document Coordinates" Extensions for SVG.js -----//

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
	},
	MX: function(x){
		var W = this.W();
		if(typeof x !== "undefined"){
			return this.L(x - W);
		}else{
			return this.L() + W;
		}
	},
	MY: function(x){
		var H = this.H();
		if(typeof x !== "undefined"){
			return this.T(x - H);
		}else{
			return this.T() + H;
		}
	}
});

// Radius for circle, rectangle

SVG.extend(SVG.Shape, {
	R: function(x){
		if(typeof x !== "undefined"){
			return this.radius(x * doc_scale);
		}else{
			return 1.0 * this.radius() / doc_scale;
		}
	}
});

// Text: Override the original methods to get the bounding box dimensions

SVG.extend(SVG.Text, {
	width: function(){
		return this.bbox().width;
	},
	height: function(){
		return this.bbox().height;
	},
	cx: function(x){
		if(typeof x !== "undefined"){
			return this.x( x - this.bbox().width/2.0 );
		}else{
			return this.x() + this.bbox().width/2.0;
		}
	},
	cy: function(x){
		if(typeof x !== "undefined"){
			return this.y( x - this.bbox().height/2.0 );
		}else{
			return this.y() + this.bbox().height/2.0;
		}
	}
});

// Stroke width, stroke dash array (assume input is a single number)

SVG.extend(SVG.Element, {
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

// Transformations: translation, scale, rotation

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

//----- Other Extensions for SVG.js -----//

// "Arrow" class

SVG.Arrow = class extends SVG.G{
	create_arrow(){
		this.arrow_body = this.line(0,0,0,0);
		this.arrow_head = this.polyline([0,0,0,0,0,0]).fill({opacity: 0});
		this.LB = 0; // length of arrow body
		this.LH = 0; // length of arrow head
		return this;
	}
	redraw_arrow(){
		// Redraw arrow - for internal use
		var LB = this.LB;
		var LH = this.LH;
		this.arrow_body.plot_XY([0,0,LB,0]);
		this.arrow_head.plot_XY([
			LB - LH, -LH,
			LB     ,   0,
			LB - LH,  LH
		]);
		return this;
	}
	body_L(x){
		// Set length of arrow
		this.LB = x;
		return this.redraw_arrow();
	}
	head_L(x){
		// Set size of arrow head
		this.LH = x;
		return this.redraw_arrow();
	}
};

SVG.extend(SVG.Container, {
	arrow: function(){
		return this.put(new SVG.Arrow).create_arrow();
	}
});

// "Accel_arrow" class - a special kind of arrow with a "tail"

SVG.Accel_arrow = class extends SVG.Arrow{
	create_accel_arrow(){
		this.create_arrow();
		this.create_tail();
		return this;
	}
	create_tail(){
		this.tail_1 = this.line(0,0,0,0);
		this.tail_2 = this.line(0,0,0,0);
		return this;
	}
	redraw_accel_arrow(){
		this.redraw_arrow();
		this.redraw_tail();
		return this;
	}
	redraw_tail(){
		var D = this.LH * 0.8;
		this.tail_1.plot_XY([-D,D,D,D]);
		this.tail_2.plot_XY([-D,-D,D,-D]);
		return this;
	}
	body_L(x){
		this.LB = x;
		return this.redraw_accel_arrow();
	}
	head_L(x){
		this.LH = x;
		return this.redraw_accel_arrow();
	}
};

SVG.extend(SVG.Container, {
	accel_arrow: function(){
		return this.put(new SVG.Accel_arrow).create_accel_arrow();
	}
});

// "Cross" class

SVG.Cross = class extends SVG.G{
	create_cross(x){
		this.tl_br = this.line(0,0,0,0);
		this.bl_tr = this.line(0,0,0,0);
		if(typeof x !== "undefined"){
			return this.R(x);
		}else{
			return this;
		}
	}
	R(x){
		this.tl_br.plot_XY([-x,x,x,-x]);
		this.bl_tr.plot_XY([-x,-x,x,x]);
		return this;
	}
};

SVG.extend(SVG.Container, {
	cross: function(x){
		return this.put(new SVG.Cross).create_cross(x);
	}
});
