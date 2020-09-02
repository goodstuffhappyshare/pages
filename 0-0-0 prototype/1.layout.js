/*******************************************************************************

  ~ Layout ~

  This script sets up the main layout. Everything is contained in the "doc"
  object, inside which all lengths are measured in "document coordinates".
  
  Inside "doc" is a menu and a main frame, which contains a control area and
  a display area, separated by a draggle bar. The menu will be set up in the
  next file.
  
  Most of this script just does the boring job of reading, calculating and
  changing positions and sizes of various blocks.

*******************************************************************************/

// Fixed values

var doc_side_length = 720;

var font_size = 40;
var menu_icon_size = 80;

var split_bar_thick = 20;
var split_bar_decor_length = 80;
var split_bar_decor_thick = 8;

// Values to be read from screen

var doc_width, doc_height; // in pixels
var split_bar_L, split_bar_T;

// Values to be calculated

var doc_W, doc_H;
var doc_is_landscape;
var main_frame_L, main_frame_T, main_frame_W, main_frame_H;

var ctrl_area_L, ctrl_area_T, ctrl_area_W, ctrl_area_H;
var disp_area_L, disp_area_T, disp_area_W, disp_area_H;

var split_bar_W, split_bar_H;
var split_bar_decor_L, split_bar_decor_T, split_bar_decor_W, split_bar_decor_H;

// Methods

function read_doc_size(){
	doc_width = $("#doc").width();
	doc_height = $("#doc").height();
	if(doc_width >= doc_height){
		doc_is_landscape = true;
		doc_scale = 1.0 * doc_height / doc_side_length;
	}else{
		doc_is_landscape = false;
		doc_scale = 1.0 * doc_width / doc_side_length;
	}
	doc_W = doc_width / doc_scale;
	doc_H = doc_height / doc_scale;
	$("*").css("font-size", font_size*doc_scale + "px");
}

function calc_main_frame_size(){
	if(doc_is_landscape){
		main_frame_L = menu_icon_size;
		main_frame_T = 0;
		main_frame_W = doc_W - menu_icon_size;
		main_frame_H = doc_H;
	}else{
		main_frame_L = 0;
		main_frame_T = menu_icon_size;
		main_frame_W = doc_W;
		main_frame_H = doc_H - menu_icon_size;
	}
}

function set_split_bar_default_position(){
	if(doc_is_landscape){
		split_bar_L = main_frame_W * 2.0 / 3.0;
		split_bar_T = 0;
	}else{
		split_bar_L = 0;
		split_bar_T = main_frame_H * 2.0 / 3.0;
	}
}

function read_split_bar_position(){
	split_bar_L = $("#split_bar").L();
	split_bar_T = $("#split_bar").T();
}

function calc_main_frame_component_sizes(){
	if(doc_is_landscape){
		split_bar_W = split_bar_thick;
		split_bar_H = main_frame_H;
		
		split_bar_decor_L = (split_bar_thick - split_bar_decor_thick) / 2.0;
		split_bar_decor_T = (main_frame_H - split_bar_decor_length) / 2.0;
		split_bar_decor_W = split_bar_decor_thick;
		split_bar_decor_H = split_bar_decor_length;
		
		disp_area_L = 0;
		disp_area_T = 0;
		disp_area_W = split_bar_L;
		disp_area_H = main_frame_H;
		
		ctrl_area_L = split_bar_L + split_bar_W;
		ctrl_area_T = 0;
		ctrl_area_W = main_frame_W - split_bar_L - split_bar_W;
		ctrl_area_H = main_frame_H;
	}else{
		split_bar_W = main_frame_W;
		split_bar_H = split_bar_thick;
		
		split_bar_decor_L = (main_frame_W - split_bar_decor_length) / 2.0;
		split_bar_decor_T = (split_bar_thick - split_bar_decor_thick) / 2.0;
		split_bar_decor_W = split_bar_decor_length;
		split_bar_decor_H = split_bar_decor_thick;
		
		disp_area_L = 0;
		disp_area_T = 0;
		disp_area_W = main_frame_W;
		disp_area_H = split_bar_T;
		
		ctrl_area_L = 0;
		ctrl_area_T = split_bar_T + split_bar_H;
		ctrl_area_W = main_frame_W;
		ctrl_area_H = main_frame_H - split_bar_T - split_bar_H;
	}
}

function resize_main_frame_components(){
	$("#main_frame").L(main_frame_L);
	$("#main_frame").T(main_frame_T);
	$("#main_frame").W(main_frame_W);
	$("#main_frame").H(main_frame_H);
	
	$("#split_bar").L(split_bar_L);
	$("#split_bar").T(split_bar_T);
	$("#split_bar").W(split_bar_W);
	$("#split_bar").H(split_bar_H);
	
	$("#split_bar_decor").L(split_bar_decor_L);
	$("#split_bar_decor").T(split_bar_decor_T);
	$("#split_bar_decor").W(split_bar_decor_W);
	$("#split_bar_decor").H(split_bar_decor_H);
	
	$("#disp_area").L(disp_area_L);
	$("#disp_area").T(disp_area_T);
	$("#disp_area").W(disp_area_W);
	$("#disp_area").H(disp_area_H);
	
	$("#ctrl_area").L(ctrl_area_L);
	$("#ctrl_area").T(ctrl_area_T);
	$("#ctrl_area").W(ctrl_area_W);
	$("#ctrl_area").H(ctrl_area_H);
}

// Events

function layout_init(){
	read_doc_size();
	calc_main_frame_size();
	set_split_bar_default_position();
	
	calc_main_frame_component_sizes();
	resize_main_frame_components();
	
	$("#split_bar").draggable({"containment":"parent"});
	
	$("#split_bar").on("drag", split_bar_on_drag);
	$("#split_bar").on("stop", split_bar_on_drag);
	$(window).resize(window_on_resize);
}

function split_bar_on_drag(){
	read_split_bar_position();
	calc_main_frame_component_sizes();
	resize_main_frame_components();
	main_on_layout_change(); // tell "main-config" that layout is changed
}

function window_on_resize(){
	split_ratio = doc_is_landscape ? 1.0 * split_bar_L / main_frame_W
	                               : 1.0 * split_bar_T / main_frame_H;
	read_doc_size();
	calc_main_frame_size();
	
	if(doc_is_landscape){
		split_bar_L = main_frame_W * split_ratio;
		split_bar_T = 0;
	}else{
		split_bar_L = 0;
		split_bar_T = main_frame_H * split_ratio;
	}
	calc_main_frame_component_sizes();
	resize_main_frame_components();
	main_on_layout_change(); // tell "main-config" that layout is changed
}
