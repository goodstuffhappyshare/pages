/*******************************************************************************

  ~ My Library ~

  This script defines general clasess and functions.

*******************************************************************************/

// Define $("#object").left() and $("#object").top() for easy access

$.fn.left = function(L){
	if(typeof L !== "undefined"){
		this.css("left", L + "px");
		return this;
	}else{
		return this.position().left;
	}
};

$.fn.top = function(T){
	if(typeof T !== "undefined"){
		this.css("top", T + "px");
		return this;
	}else{
		return this.position().top;
	}
};
