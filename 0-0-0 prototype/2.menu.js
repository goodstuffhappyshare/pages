/*******************************************************************************

  ~ Menu ~

  This script sets up a small menu which contains 3 items:
  - switch language
  - toggle full screen
  - visit page: "Physics Concepts resource list"
  
  Again, most of the script is just about positioning of blocks.

*******************************************************************************/

//----- Menu Layout -----//

// Fixed Values

var menu_item_pad = 10;
var menu_item_H = 60;
var menu_item_W = 350;

var menu_item_outerW = menu_item_W + menu_item_pad * 2;
var menu_item_outerH = menu_item_H + menu_item_pad * 2;

// Values to be calculated

var menu_L, menu_T, menu_W, menu_H;
var menu_icon_L, menu_icon_T, menu_icon_W, menu_icon_H;
var menu_item1_L, menu_item1_T, menu_item1_W, menu_item1_H;
var menu_item2_L, menu_item2_T, menu_item2_W, menu_item2_H;
var menu_item3_L, menu_item3_T, menu_item3_W, menu_item3_H;

var menu_show = 0; // 0 means hidden, 1 means shown,
                   // values between 0 and 1 means the menu is sliding

// Methods

function calc_menu_item_sizes(){
	if(doc_is_landscape){
		menu_W = menu_item_outerW + menu_icon_size;
		menu_H = doc_H;
		
		menu_icon_L = menu_item_outerW;
		menu_icon_T = 0;
		menu_icon_W = menu_icon_size;
		menu_icon_H = menu_icon_size;
		
		menu_item1_L = menu_item_pad;
		menu_item1_T = menu_item_pad;
		menu_item1_W = menu_item_W;
		menu_item1_H = menu_item_H;
		
		menu_item2_L = menu_item_pad;
		menu_item2_T = menu_item_outerH + menu_item_pad;
		menu_item2_W = menu_item_W;
		menu_item2_H = menu_item_H;
		
		menu_item3_L = menu_item_pad;
		menu_item3_T = menu_item_outerH * 2 + menu_item_pad;
		menu_item3_W = menu_item_W;
		menu_item3_H = menu_item_H;
	}else{
		menu_W = doc_W;
		menu_H = menu_item_outerH * 3 + menu_icon_size;
		
		menu_icon_L = menu_item_pad;
		menu_icon_T = menu_item_outerH * 3;
		menu_icon_W = menu_icon_size;
		menu_icon_H = menu_icon_size;
		
		menu_item1_L = menu_item_pad;
		menu_item1_T = menu_item_pad;
		menu_item1_W = menu_item_W;
		menu_item1_H = menu_item_H;
		
		menu_item2_L = menu_item_pad;
		menu_item2_T = menu_item_outerH + menu_item_pad;
		menu_item2_W = menu_item_W;
		menu_item2_H = menu_item_H;
		
		menu_item3_L = menu_item_pad;
		menu_item3_T = menu_item_outerH * 2 + menu_item_pad;
		menu_item3_W = menu_item_W;
		menu_item3_H = menu_item_H;
	}
}

function resize_menu_items(){
	$("#menu").W(menu_W);
	$("#menu").H(menu_H);
	
	$("#menu_icon").L(menu_icon_L);
	$("#menu_icon").T(menu_icon_T);
	$("#menu_icon").W(menu_icon_W);
	$("#menu_icon").H(menu_icon_H);
	
	$("#menu_switch_language").L(menu_item1_L);
	$("#menu_switch_language").T(menu_item1_T);
	$("#menu_switch_language").W(menu_item1_W);
	$("#menu_switch_language").H(menu_item1_H);
	
	$("#menu_enter_fullscreen").L(menu_item2_L);
	$("#menu_enter_fullscreen").T(menu_item2_T);
	$("#menu_enter_fullscreen").W(menu_item2_W);
	$("#menu_enter_fullscreen").H(menu_item2_H);
	
	$("#menu_exit_fullscreen").L(menu_item2_L);
	$("#menu_exit_fullscreen").T(menu_item2_T);
	$("#menu_exit_fullscreen").W(menu_item2_W);
	$("#menu_exit_fullscreen").H(menu_item2_H);
	
	$("#menu_view_all_topics").L(menu_item3_L);
	$("#menu_view_all_topics").T(menu_item3_T);
	$("#menu_view_all_topics").W(menu_item3_W);
	$("#menu_view_all_topics").H(menu_item3_H);
}

function set_menu_position(){
	if(doc_is_landscape){
		menu_L = (-1.0 + menu_show) * menu_item_outerW;
		menu_T = 0;
	}else{
		menu_L = 0;
		menu_T = (-1.0 + menu_show) * menu_item_outerH * 3;
	}
	$("#menu").L(menu_L);
	$("#menu").T(menu_T);
}

//----- Menu Animation -----//

// Values

var menu_is_sliding = false;
var menu_start_sliding_time;
var menu_total_slide_time = 500; // in milliseconds

// Methods

function menu_slide_out(timestamp){
	if(!menu_is_sliding){
		menu_is_sliding = true;
		menu_start_sliding_time = timestamp;
		requestAnimationFrame(menu_slide_out);
	}else{
		t = 1.0 * (timestamp - menu_start_sliding_time) / menu_total_slide_time;
		if(t >= 1){
			menu_show = 1;
			set_menu_position();
			menu_is_sliding = false;
		}else{
			menu_show = 1 - (t - 1) * (t - 1);
			set_menu_position();
			requestAnimationFrame(menu_slide_out);
		}
	}
}

function menu_slide_in(timestamp){
	if(!menu_is_sliding){
		menu_is_sliding = true;
		menu_start_sliding_time = timestamp;
		requestAnimationFrame(menu_slide_in);
	}else{
		t = 1.0 * (timestamp - menu_start_sliding_time) / menu_total_slide_time;
		if(t >= 1){
			menu_show = 0;
			set_menu_position();
			menu_is_sliding = false;
		}else{
			menu_show = (t - 1) * (t - 1);
			set_menu_position();
			requestAnimationFrame(menu_slide_in);
		}
	}
}

//----- Toggle Full Screen ------//

// Values

var is_fullscreen;

// Methods

function reset_menu_fullscreen_item(){
	if(is_fullscreen){
		$("#menu_exit_fullscreen").show();
		$("#menu_enter_fullscreen").hide();
	}else{
		$("#menu_enter_fullscreen").show();
		$("#menu_exit_fullscreen").hide();
	}
}

// Events

function init_fullscreen_option(){
	is_fullscreen = $.fullscreen.isFullScreen();
	reset_menu_fullscreen_item();
	$(document).on("fscreenchange", on_fullscreen_change);
}

function on_fullscreen_change(){
	/* Note that this "fscreenchange" event does not work perfectly on all
	   browsers so do not rely too much on it.                                */              
	is_fullscreen = $.fullscreen.isFullScreen();
	reset_menu_fullscreen_item();
}

function enter_fullscreen_on_click(){
	$("#doc").fullscreen();
	is_fullscreen = true;
	reset_menu_fullscreen_item();
}

function exit_fullscreen_on_click(){
	$.fullscreen.exit();
	is_fullscreen = false;
	reset_menu_fullscreen_item();
}

//----- Menu Events -----//

function menu_init(){
	calc_menu_item_sizes();
	resize_menu_items();
	set_menu_position();
	
	init_fullscreen_option();
	
	$("#menu_icon").click(menu_icon_on_click);
}

function menu_on_layout_change(){
	calc_menu_item_sizes();
	resize_menu_items();
	set_menu_position();
}

function menu_icon_on_click(){
	if(!menu_is_sliding){
		if(menu_show == 0) requestAnimationFrame(menu_slide_out);
		else requestAnimationFrame(menu_slide_in);
	}
}


