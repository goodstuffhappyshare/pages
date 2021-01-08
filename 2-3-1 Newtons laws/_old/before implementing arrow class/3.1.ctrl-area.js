/*******************************************************************************

  ~ Control Area ~

  This script sets up the control area which receives user input.

*******************************************************************************/

////////// CONTROL AREA LAYOUT /////////////////////////////////////////////////

//----- Values -----//

var ctrl_area_pad = 15;

var f_box_size;
var f_box_size_min = 150;
var f_box_border_width = 1;

var f_btn_border_width = 1;

//----- Methods -----//

function free_resize_ctrl_area_text(){
	/* put textboxs at positions where they are allowed to freely expand
	   (or shrink) to a size suitable for display, then read this size and
	   then fix it.                                                           */
	
	$("#ctrl_instr").L(ctrl_area_pad*2);
	$("#ctrl_instr").css("width", "auto");
	$("#ctrl_instr").css("height", "auto");
	
	ctrl_instr_W = $("#ctrl_instr").W();
	ctrl_instr_H = $("#ctrl_instr").H();
	
	$("#ctrl_instr").W(ctrl_instr_W);
	$("#ctrl_instr").H(ctrl_instr_H);
}

function calc_ctrl_area_sizes(){
	var avail_width = ctrl_area_W - ctrl_area_pad * 2;
	var avail_height = ctrl_area_H - ctrl_area_pad * 3 - ctrl_instr_H;
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
	$("#f_box").border_W(f_box_border_width);
	
	$("#f_btn").W(f_box_size / 3.0);
	$("#f_btn").H(f_box_size / 3.0);
	$("#f_btn").border_W(f_btn_border_width);
}

function update_ctrl_area_layout(){
	free_resize_ctrl_area_text();
	calc_ctrl_area_sizes();
	resize_ctrl_area_components();
}

//----- Events -----//

function ctrl_area_init(){
	update_ctrl_area_layout();
	f_box_init();
}

function ctrl_area_on_enter_frame(dt){
	f_box_on_enter_frame(dt);
}

function ctrl_area_on_layout_change(){
	update_ctrl_area_layout();
	f_box_on_layout_change();
}

////////// OTHER THINGS ABOUT CONTROL AREA /////////////////////////////////////

//----- f_box -----//

// Values

var f_btn_x = 0; // This is the position of the force button,
var f_btn_y = 0; // but using "internal coordinates"
var f_btn_is_dragging = false;

// Objects

var f_box_svg;
var f_box_line;

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
	$("#f_btn").CX( x_to_f_box(f_btn_x) );
	$("#f_btn").CY( y_to_f_box(f_btn_y) );
}

function read_f_btn_position(){
	f_btn_x = x_from_f_box( $("#f_btn").CX() );
	f_btn_y = y_from_f_box( $("#f_btn").CY() );
}

// Methods (line showing applied force)

function create_force_line(){
	f_box_svg = SVG().addTo("#f_box");
	f_box_line = f_box_svg.line(0,0,0,0);
	f_box_line.stroke({color: "#FF0000", linecap: "round"});
	
	redraw_force_line();
	resize_f_box_svg();
}

function redraw_force_line(){
	f_box_line.plot_XY([
		f_box_size/2, f_box_size/2,
		x_to_f_box(f_btn_x), y_to_f_box(f_btn_y)
	]);
	f_box_line.stroke({width: 6 * doc_scale});
}

function resize_f_box_svg(){
	f_box_svg.size(f_box_size * doc_scale, f_box_size * doc_scale);
}

// Events

function f_box_init(){
	set_f_btn_position();
	$("#f_btn").draggable({"containment":"parent"});
	$("#f_btn").on("dragstart", f_btn_on_dragstart);
	$("#f_btn").on("dragstop", f_btn_on_dragstop);
	
	create_force_line();
}

function f_box_on_enter_frame(dt){
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
	redraw_force_line();
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






