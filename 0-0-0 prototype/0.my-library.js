/*******************************************************************************

  ~ My Library ~

  This script defines general clasess and functions.

*******************************************************************************/

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

// Define "document coordinates"

var doc_scale;

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

