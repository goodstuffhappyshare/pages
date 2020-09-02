/*******************************************************************************

  ~ Input UI ~

  This script sets up the UI in the control area and reads user input.

*******************************************************************************/

//----- Control Area Layout -----//

// Dimensions

var ctrl_area_pad = 15;

var f_box_size;
var f_box_size_min = 150;
var f_box_border_width = 1;

var f_btn_border_width = 1;

// Methods

function pretreat_ctrl_area_text(){
	/* put textboxs at positions where they are allowed to freely expand
	   (or shrink) to a size suitable for display, then read this size.       */
	$("#ctrl_instr").left(ctrl_area_pad*2);
	ctrl_instr_W = $("#ctrl_instr").W();
	ctrl_instr_H = $("#ctrl_instr").H();
}

function calc_ctrl_area_sizes(){
	avail_width = ctrl_area_W - ctrl_area_pad * 2;
	avail_height = ctrl_area_H - ctrl_area_pad * 3 - ctrl_instr_H;
	f_box_size = Math.min(avail_height, avail_width);
	f_box_size = Math.max(f_box_size, f_box_size_min);
}

function resize_ctrl_area_components(){
	$("#ctrl_instr").L( (ctrl_area_W - ctrl_instr_W) / 2.0 );
	$("#ctrl_instr").T(ctrl_area_pad);
	
	$("#f_box").L((ctrl_area_W - f_box_size) / 2.0);
	$("#f_box").T(ctrl_area_pad * 2 + ctrl_instr_H);
	$("#f_box").W(f_box_size);
	$("#f_box").H(f_box_size);
	$("#f_box").css("border-width", f_box_border_width * doc_scale);
	
	$("#f_btn").W(f_box_size / 3.0);
	$("#f_btn").H(f_box_size / 3.0);
	$("#f_btn").css("border-width", f_btn_border_width * doc_scale);
}

// Events

function ctrl_area_init(){
	pretreat_ctrl_area_text();
	calc_ctrl_area_sizes();
	resize_ctrl_area_components();
}

function ctrl_area_on_layout_change(){
	pretreat_ctrl_area_text();
	calc_ctrl_area_sizes();
	resize_ctrl_area_components();
}

//----- f_box -----//

// Variables

f_btn_x = 0; // This is the position of the force button,
f_btn_y = 0; // but using "internal coordinates"
f_btn_is_dragging = false;

// Methods (conversion between coordinates)

function x_to_f_box(x){
	return 1.0 * (x - f_x_min) / f_x_range * f_box_size;
}
function y_to_f_box(y){
	return 1.0 * (y - f_y_min) / f_y_range * f_box_size;
}
function x_from_f_box(X){
	return 1.0 * X / f_box_size * f_x_range + f_x_min;
}
function y_from_f_box(Y){
	return 1.0 * Y / f_box_size * f_y_range + f_y_min;
}

// Methods (button object)

function set_f_btn_position(){
	f_btn_L = x_to_f_box(f_btn_x) - $("#f_btn").W() / 2.0;
	f_btn_T  = y_to_f_box(f_btn_y) - $("#f_btn").H() / 2.0;
	$("#f_btn").L(f_btn_L);
	$("#f_btn").T(f_btn_T);
}

function read_f_btn_position(){
	f_btn_X = $("#f_btn").L() + $("#f_btn").W() / 2.0;
	f_btn_Y = $("#f_btn").T() + $("#f_btn").H() / 2.0;
	f_btn_x = x_from_f_box(f_btn_X);
	f_btn_y = y_from_f_box(f_btn_Y);
}

// Methods (line showing applied force)

function create_force_line(){
	svg = $("#f_box").svg("get");
	svg.line(
		0,0,0,0, {id: "f_line",
		fill: 'none', stroke: 'red', strokeWidth: 6});
	redraw_force_line();
	resize_f_box_svg();
}

function redraw_force_line(){
	svg = $("#f_box").svg("get");
	line = svg.getElementById("f_line");
	svg.change(line, {
		x1: f_box_size/2 * doc_scale,
		y1: f_box_size/2 * doc_scale,
		x2: x_to_f_box(f_btn_x) * doc_scale,
		y2: y_to_f_box(f_btn_y) * doc_scale,
		strokeWidth: 6 * doc_scale
	});
}

function resize_f_box_svg(){
	svg = $("#f_box").svg("get");
	svg.configure({"width": f_box_size * doc_scale, "height": f_box_size * doc_scale});
}

// Events

function f_box_init(){
	set_f_btn_position();
	$("#f_btn").draggable({"containment":"parent"});
	$("#f_btn").on("dragstart", f_btn_on_dragstart);
	$("#f_btn").on("dragstop", f_btn_on_dragstop);
	
	$("#f_box").svg(function(svg){
		create_force_line();
	});
}

function f_box_on_enter_frame(dt){
	redraw_force_line();
	
	if(f_btn_is_dragging){
		read_f_btn_position();
		f_x = f_btn_x;
		f_y = f_btn_y;
	}else{
		f_btn_x *= Math.exp(-10 * dt);
		f_btn_y *= Math.exp(-10 * dt);
		set_f_btn_position();
		f_x = 0;
		f_y = 0;
	}
}

function f_box_on_layout_change(){
	resize_f_box_svg();
}

function f_btn_on_dragstart(){
	f_btn_is_dragging = true;
}

function f_btn_on_dragstop(){
	f_btn_is_dragging = false;
}

//----- Input UI Events -----//

function input_UI_init(){
	ctrl_area_init();
	f_box_init();
}

function input_UI_on_enter_frame(dt){
	f_box_on_enter_frame(dt);
}

function input_UI_on_layout_change(){
	ctrl_area_on_layout_change();
	f_box_on_layout_change();
}
