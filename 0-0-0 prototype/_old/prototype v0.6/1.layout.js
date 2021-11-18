/*******************************************************************************

  ~ Layout ~

  This script sets up the main layout which has a control area and a display
  area, separated by a draggle bar.

*******************************************************************************/

// Fixed values

var menu_icon_size = 80;

var split_bar_thick = 20;
var split_bar_decor_length = 80;
var split_bar_decor_thick = 8;

// Values to be read from screen

var doc_W, doc_H;
var split_bar_L, split_bar_T;

// Values to be calculated

var doc_is_landscape;
var main_frame_L, main_frame_T, main_frame_W, main_frame_H;

var ctrl_area_L, ctrl_area_T, ctrl_area_W, ctrl_area_H;
var disp_area_L, disp_area_T, disp_area_W, disp_area_H;

var split_bar_W, split_bar_H;
var split_bar_decor_L, split_bar_decor_T, split_bar_decor_W, split_bar_decor_H;

// Methods

function read_doc_size(){
	doc_W = $("#doc").width();
	doc_H = $("#doc").height();
	if(doc_W >= doc_H){
		doc_is_landscape = true;
	}else{
		doc_is_landscape = false;
	}
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
	split_bar_L = $("#split_bar").left();
	split_bar_T = $("#split_bar").top();
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
	$("#main_frame").left(main_frame_L);
	$("#main_frame").top(main_frame_T);
	$("#main_frame").width(main_frame_W);
	$("#main_frame").height(main_frame_H);
	
	$("#split_bar").left(split_bar_L);
	$("#split_bar").top(split_bar_T);
	$("#split_bar").width(split_bar_W);
	$("#split_bar").height(split_bar_H);
	
	$("#split_bar_decor").left(split_bar_decor_L);
	$("#split_bar_decor").top(split_bar_decor_T);
	$("#split_bar_decor").width(split_bar_decor_W);
	$("#split_bar_decor").height(split_bar_decor_H);
	
	$("#disp_area").left(disp_area_L);
	$("#disp_area").top(disp_area_T);
	$("#disp_area").width(disp_area_W);
	$("#disp_area").height(disp_area_H);
	
	$("#ctrl_area").left(ctrl_area_L);
	$("#ctrl_area").top(ctrl_area_T);
	$("#ctrl_area").width(ctrl_area_W);
	$("#ctrl_area").height(ctrl_area_H);
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
	$(window).resize(doc_on_resize);
}

function split_bar_on_drag(){
	read_split_bar_position();
	calc_main_frame_component_sizes()
	resize_main_frame_components();
	main_on_layout_change(); // tell "main-config" that layout is changed
}

function doc_on_resize(){
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
