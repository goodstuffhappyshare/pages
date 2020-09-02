/*******************************************************************************

  ~ My Library ~

  This script defines general clasess and functions.

*******************************************************************************/

//----- Simple jQuery Extensions -----//

// Define $("#object").left() and $("#object").top() for easy access

$.fn.left = function(x){
	if(typeof x !== "undefined"){
		this.css("left", x + "px");
		return this;
	}else{
		return this.position().left;
	}
};

$.fn.top = function(x){
	if(typeof x !== "undefined"){
		this.css("top", x + "px");
		return this;
	}else{
		return this.position().top;
	}
};

//----- "Document Coordinates" -----//

/* I designed the interface on a screen with dimensions 1280*720. However,
   screen sizes vary greatly today so the interface may look very different
   on other screens if I use pixels to measure lengths. To solve this problem,
   I defined the so-called "document coordinates". Basically, on any screen,
   I measure the shorter side of the screen as "720 units". Then whenever
   I have to access the position or size of an object, I measure the length
   in this "unit".
   
   The following functions work exactly like .left(), .top(), .width() and
   .height() in jQuery, only lengths are measured in "document coordinates".
   For clarity, whenever a value has a name with suffix _L, _T, _W or _H,
   this value is measured in "document coordinates".                          */

var doc_scale; // to be calculated in "layout"

$.fn.L = function(x){
	if(typeof x !== "undefined"){
		this.left(x * doc_scale);
		return this;
	}else{
		return 1.0 * this.left() / doc_scale;
	}
}

$.fn.T = function(x){
	if(typeof x !== "undefined"){
		this.top(x * doc_scale);
		return this;
	}else{
		return 1.0 * this.top() / doc_scale;
	}
}

$.fn.W = function(x){
	if(typeof x !== "undefined"){
		this.width(x * doc_scale);
		return this;
	}else{
		return 1.0 * this.width() / doc_scale;
	}
}

$.fn.H = function(x){
	if(typeof x !== "undefined"){
		this.height(x * doc_scale);
		return this;
	}else{
		return 1.0 * this.height() / doc_scale;
	}
}

