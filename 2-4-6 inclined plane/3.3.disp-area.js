/*******************************************************************************

  ~ Display Area Layout ~

  This script sets up the display area for showing the processing results.

*******************************************************************************/

////////// DISPLAY AREA LAYOUT /////////////////////////////////////////////////

/* Well... There really is no layout. A single SVG object spans all over the
   area.                                                                      */

////////// DISPLAY AREA MAIN EVENTS ////////////////////////////////////////////

function disp_area_init(){
	svg_obj_init();
}

function disp_area_on_enter_frame(dt){
	svg_obj_on_enter_frame();
}

function disp_area_on_layout_change(){
	svg_obj_on_layout_change();
}

////////// OBJECTS INSIDE DISPLAY AREA /////////////////////////////////////////

/* Structure of the SVG object:
   Inside the SVG object is a "canvas" group which is rotated anti-clockwise
   by an angle of theta. Inside the group are (from top to bottom):
    - s_group
	- v_group
	- a_group
	- theta_group
    - F_group
	- f_group
	- W_group
	- W_x_group
	- W_y_group
	- N_group
	- N1_group
	- N2_group
    - block_group
    - track_group
   
   Coordinate conversion:
   First draw a square box that extends to the edge of the display area.
   Before rotation, the track spans 80% the width of this square.
   The origin of the "canvas" group is at the centre of the display area.     */

//----- SVG Object -----//

// Values

var f_scale = 25; // scale factor for force arrows
var v_scale = 100; // scale factor for velocity arrow
var a_scale = 50; // scale factor for acceleration arrow

// Objects

var disp_svg;
var canvas;
var track_group;
var block_group;
var N2_group;
var N1_group;
var N_group;
var W_y_group;
var W_x_group;
var W_group;
var f_group;
var F_group;
var theta_group;
var a_group;
var v_group;
var s_group;

var circle;
var line;

// Methods (conversion of coordinates)

/* Imagine a square box extending to the edges of the display area.
   When the track is horizontal, it spans 80% of this square box.             */

var track_span = 0.8;
var length_scale_factor;

function calc_length_scale_factor(){
	var side_W = Math.min(disp_area_W, disp_area_H);
	length_scale_factor = side_W * track_span / track_length;
}

function x_to_canvas(x){
	return (x - block_s_max / 2.0) * length_scale_factor;
}

function y_to_canvas(y){
	// y is upward-positive while Y is downward-positive
	return -y * length_scale_factor;
}

// Methods (canvas)

function create_canvas(){
	canvas = disp_svg.group();
	
	calc_length_scale_factor();
	
	create_track();
	create_block();
	create_N2();
	create_N1();
	create_N();
	create_W_y();
	create_W_x();
	create_W();
	create_f();
	create_F();
	create_theta();
	create_a();
	create_v();
	create_s();
}

function redraw_canvas(){
	disp_svg.W(disp_area_W);
	disp_svg.H(disp_area_H);
	canvas.set_translation_XY(disp_area_W / 2.0, disp_area_H / 2.0);
	canvas.set_rotation(-theta / Math.PI * 180);
	
	calc_length_scale_factor();
	
	redraw_track();
	redraw_block();
	redraw_N2();
	redraw_N1();
	redraw_N();
	redraw_W_y();
	redraw_W_x();
	redraw_W();
	redraw_f();
	redraw_F();
	redraw_theta();
	redraw_a();
	redraw_v();
	redraw_s();
}

function create_track(){
	track_group = canvas.group();
	var track_poly = track_group.polyline([0,0,0,0]);
	track_poly.stroke({color: "#FFFFFF"});
	track_poly.fill({opacity: 0});
}

function redraw_track(){
	var track_poly = track_group.get(0);
	var L = x_to_canvas(track_left);
	var R = x_to_canvas(track_right);
	var B = y_to_canvas(track_bottom);
	var T = y_to_canvas(track_top);
	track_poly.plot_XY([L,T,L,B,R,B,R,T]);
	track_poly.stroke_W(4);
}

function create_block(){
	block_group = canvas.group();
	var block_rect = block_group.rect(1,1);
	block_rect.stroke({color: "#FFFFFF"});
	block_rect.fill({color: "#FFFFFF"});
}

function redraw_block(){
	var block_rect = block_group.get(0);
	
	var W = block_width * length_scale_factor;
	var H = block_height * length_scale_factor;
	block_rect.W(W).H(H).CX(0).CY(0);
	
	var op = (m - m_min) / (m_max - m_min);
	block_rect.stroke_W(4);
	block_rect.fill({opacity: op});
	
	block_group.set_translation_XY( x_to_canvas(block_s), y_to_canvas(0) );
}

function create_N2(){
	N2_group = canvas.group();
	var N2_arrow = N2_group.arrow();
	N2_arrow.stroke({color: "#FF0000", linecap: "round", linejoin: "round"});
	N2_arrow.head_L(10);
	N2_arrow.set_rotation(180);
	var N2_label_container = N2_group.group();
	var N2_label = N2_label_container.text("");
	N2_label.fill("#FF0000");
}

function redraw_N2(){
	if(show_forces_x && N2!=0){
		var N2_arrow = N2_group.get(0);
		N2_arrow.body_L(-N2 * f_scale);
		N2_group.set_translation_XY( x_to_canvas(track_right), y_to_canvas(0)-2 );
		N2_arrow.stroke_W(4);
		var N2_label_container = N2_group.get(1);
		var N2_label = N2_label_container.get(0);
		N2_label.clear();
		N2_label.build(true);
		N2_label.tspan("N").font("style","italic").font_H(font_size * 0.8);
		N2_label.tspan("2").attr("baseline-shift","sub").font_H(font_size * 0.56);
		N2_label.CX(0).CY(0);
		N2_label_container.set_translation_XY( N2 * f_scale - font_size * 0.8, font_size * 0.15 );
		N2_label_container.set_rotation(theta / Math.PI * 180);
		N2_group.show();
	}else{
		N2_group.hide();
	}
}

function create_N1(){
	N1_group = canvas.group();
	var N1_arrow = N1_group.arrow();
	N1_arrow.stroke({color: "#FF0000", linecap: "round", linejoin: "round"});
	N1_arrow.head_L(10);
	var N1_label_container = N1_group.group();
	var N1_label = N1_label_container.text("");
	N1_label.fill("#FF0000");
}

function redraw_N1(){
	if(show_forces_x && N1!=0){
		var N1_arrow = N1_group.get(0);
		N1_arrow.body_L(N1 * f_scale);
		N1_group.set_translation_XY( x_to_canvas(track_left), y_to_canvas(0)-2 );
		N1_arrow.stroke_W(4);
		var N1_label_container = N1_group.get(1);
		var N1_label = N1_label_container.get(0);
		N1_label.clear();
		N1_label.build(true);
		N1_label.tspan("N").font("style","italic").font_H(font_size * 0.8);
		N1_label.tspan("1").attr("baseline-shift","sub").font_H(font_size * 0.56);
		N1_label.CX(0).CY(0);
		N1_label_container.set_translation_XY( N1 * f_scale + font_size * 0.8, font_size * 0.15 );
		N1_label_container.set_rotation(theta / Math.PI * 180);
		N1_group.show();
	}else{
		N1_group.hide();
	}
}

function create_N(){
	N_group = canvas.group();
	var N_arrow = N_group.arrow();
	N_arrow.stroke({color: "#FF0000", linecap: "round", linejoin: "round"});
	N_arrow.head_L(10);
	var N_label_container = N_group.group();
	var N_label = N_label_container.text("");
	N_label.fill("#FF0000");
}

function redraw_N(){
	if(show_forces_y){
		var N_arrow = N_group.get(0);
		N_arrow.body_L(N * f_scale);
		N_arrow.set_rotation(-90);
		N_group.set_translation_XY( x_to_canvas(block_s+N_offset)+1, y_to_canvas(track_bottom) );
		N_arrow.stroke_W(4);
		var N_label_container = N_group.get(1);
		var N_label = N_label_container.get(0);
		N_label.text("N").font("style","italic").font_H(font_size * 0.8);
		N_label.CX(0).CY(0);
		N_label_container.set_translation_XY( 0, - N * f_scale - font_size * 0.8 );
		N_label_container.set_rotation(theta / Math.PI * 180);
		N_group.show();
	}else{
		N_group.hide();
	}
}

function create_W_y(){
	W_y_group = canvas.group();
	var W_y_arrow = W_y_group.arrow();
	W_y_arrow.stroke({color: "#FF0000", linecap: "round", linejoin: "round"});
	W_y_arrow.head_L(10);
	var W_y_label_container = W_y_group.group();
	var W_y_label = W_y_label_container.text("");
	W_y_label.fill("#FF0000");
}

function redraw_W_y(){
	if(show_forces_y && !show_forces_x){
		var W_y_arrow = W_y_group.get(0);
		W_y_arrow.body_L( -W_y * f_scale);
		W_y_arrow.set_rotation(90);
		W_y_group.set_translation_XY( x_to_canvas(block_s)-1, y_to_canvas(0) );
		W_y_arrow.stroke_W(4);
		var W_y_label_container = W_y_group.get(1);
		var W_y_label = W_y_label_container.get(0);
		W_y_label.clear();
		W_y_label.build(true);
		W_y_label.tspan("W").font("style","italic");
		W_y_label.tspan(" sin");
		W_y_label.tspan("θ").font("style","italic");
		W_y_label.font_H(font_size * 0.8);
		W_y_label.CX(0).CY(0);
		W_y_label_container.set_translation_XY( 0, - W_y * f_scale + font_size * 0.8 );
		W_y_label_container.set_rotation(theta / Math.PI * 180);
		W_y_group.show();
	}else{
		W_y_group.hide();
	}
}

function create_W_x(){
	W_x_group = canvas.group();
	var W_x_arrow = W_x_group.arrow();
	W_x_arrow.stroke({color: "#FF0000", linecap: "round", linejoin: "round"});
	W_x_arrow.head_L(10);
	var W_x_label_container = W_x_group.group();
	var W_x_label = W_x_label_container.text("");
	W_x_label.fill("#FF0000");
}

function redraw_W_x(){
	if(show_forces_x && !show_forces_y && theta!=0){
		var W_x_arrow = W_x_group.get(0);
		W_x_arrow.body_L( Math.abs(W_x) * f_scale);
		W_x_arrow.set_rotation( W_x > 0 ? 0 : 180 );
		W_x_group.set_translation_XY( x_to_canvas(block_s), y_to_canvas(0)+2 );
		W_x_arrow.stroke_W(4);
		var W_x_label_container = W_x_group.get(1);
		var W_x_label = W_x_label_container.get(0);
		W_x_label.clear();
		W_x_label.build(true);
		W_x_label.tspan("W").font("style","italic");
		W_x_label.tspan(" cos");
		W_x_label.tspan("θ").font("style","italic");
		W_x_label.font_H(font_size * 0.8);
		W_x_label.CX(0).CY(0);
		W_x_label_container.set_translation_XY( W_x * f_scale + font_size * (W_x>0 ? 1.8 : -1.8), 0 );
		W_x_label_container.set_rotation(theta / Math.PI * 180);
		W_x_group.show();
	}else{
		W_x_group.hide();
	}
}

function create_W(){
	W_group = canvas.group();
	var W_arrow = W_group.arrow();
	W_arrow.stroke({color: "#FF0000", linecap: "round", linejoin: "round"});
	W_arrow.head_L(10);
	var W_label_container = W_group.group();
	var W_label = W_label_container.text("");
	W_label.fill("#FF0000");
}

function redraw_W(){
	if(show_forces_x && show_forces_y){
		var W_arrow = W_group.get(0);
		W_arrow.body_L( W * f_scale );
		W_arrow.set_rotation( 90 + theta / Math.PI * 180 );
		W_group.set_translation_XY( x_to_canvas(block_s)-1, y_to_canvas(0) );
		W_arrow.stroke_W(4);
		var W_label_container = W_group.get(1);
		var W_label = W_label_container.get(0);
		W_label.text("W").font("style","italic").font_H(font_size * 0.8);
		W_label.CX(0).CY(0);
		var d = W * f_scale + font_size * 0.8;
		W_label_container.set_translation_XY( -d * Math.sin(theta) , d * Math.cos(theta) );
		W_label_container.set_rotation(theta / Math.PI * 180);
		W_group.show();
	}else{
		W_group.hide();
	}
}

function create_f(){
	f_group = canvas.group();
	var f_arrow = f_group.arrow();
	f_arrow.stroke({color: "#FF0000", linecap: "round", linejoin: "round"});
	f_arrow.head_L(10);
	var f_label_container = f_group.group();
	var f_label = f_label_container.text("");
	f_label.fill("#FF0000");
}

function redraw_f(){
	if(show_forces_x && f!=0){
		var f_arrow = f_group.get(0);
		f_arrow.body_L( Math.abs(f) * f_scale);
		f_arrow.set_rotation( f > 0 ? 0 : 180 );
		f_group.set_translation_XY( x_to_canvas(block_s + block_width * (f > 0 ? 0.5 : -0.5) ), y_to_canvas(track_bottom) );
		f_arrow.stroke_W(4);
		var f_label_container = f_group.get(1);
		var f_label = f_label_container.get(0);
		f_label.text("f").font("style","italic").font_H(font_size * 0.8);
		f_label.CX(0).CY(0);
		f_label_container.set_translation_XY( f * f_scale / 2.0 , font_size * 0.6 );
		f_label_container.set_rotation(theta / Math.PI * 180);
		f_group.show();
	}else{
		f_group.hide();
	}
}

function create_F(){
	F_group = canvas.group();
	var F_arrow = F_group.arrow();
	F_arrow.stroke({color: "#FF0000", linecap: "round", linejoin: "round"});
	F_arrow.head_L(10);
	var F_label_container = F_group.group();
	var F_label = F_label_container.text("");
	F_label.fill("#FF0000");
}

function redraw_F(){
	if(show_forces_x && F!=0){
		var F_arrow = F_group.get(0);
		F_arrow.body_L( Math.abs(F) * f_scale);
		F_arrow.set_rotation( F > 0 ? 0 : 180 );
		F_group.set_translation_XY( x_to_canvas(block_s), y_to_canvas(0) );
		F_arrow.stroke_W(4);
		var F_label_container = F_group.get(1);
		var F_label = F_label_container.get(0);
		F_label.text("F").font("style","italic").font_H(font_size * 0.8);
		F_label.CX(0).CY(0);
		F_label_container.set_translation_XY( F * f_scale + font_size * (F > 0 ? 0.8 : -0.8) , 0 );
		F_label_container.set_rotation(theta / Math.PI * 180);
		F_group.show();
	}else{
		F_group.hide();
	}
}

function create_theta(){
	theta_group = canvas.group();
	var theta_arc = theta_group.path();
	theta_arc.stroke({color: "#99CCFF"});
	theta_arc.fill({opacity: 0});
	var theta_line = theta_group.line(0,0,0,0);
	theta_line.stroke({color: "#99CCFF"});
	var theta_label_container = theta_group.group();
	var theta_label = theta_label_container.text("");
	theta_label.fill("#99CCFF");
}

function redraw_theta(){
	if(show_theta){
		
		theta_group.set_translation_XY( x_to_canvas(track_left), y_to_canvas(track_bottom) );
		
		// Redraw arc
		
		/* Extending SVG.js to convert "document coordinates" is rather troublesome
		   in the case of path string so I will just do it manually here.         */
		
		var theta_arc = theta_group.get(0);
		var arc_R = 50;
		var arc_r = arc_R * doc_scale;
		var start_x = arc_r;
		var start_y = 0;
		var end_x = arc_R * Math.cos(theta) * doc_scale;
		var end_y = arc_R * Math.sin(theta) * doc_scale;
		var path_str = "M" + start_x + " " + start_y
		             + "A" + arc_r + " " + arc_r + " 0 0 1 " + end_x + " " + end_y;
		theta_arc.plot(path_str);
		theta_arc.stroke_W(4);
		
		// Redraw dashed line
		
		var theta_line = theta_group.get(1);
		var line_L = 104;
		theta_line.plot_XY([
			0,
			0,
			line_L * Math.cos(theta),
			line_L * Math.sin(theta)
		]);
		theta_line.stroke_W(2);
		theta_line.stroke_dasharray_L(8);
		
		// Redraw label
		
		var theta_label_container = theta_group.get(2);
		var theta_label = theta_label_container.get(0);
		theta_label.text("θ").font("style","italic").font_H(font_size * 0.8);
		theta_label.CX(0).CY(0);
		var d = arc_R + font_size * 0.8;
		theta_label_container.set_translation_XY( d * Math.cos(theta/2.0), d * Math.sin(theta/2.0) );
		theta_label_container.set_rotation(theta / Math.PI * 180);
		
		// Show group
		
		theta_group.show();
		
	}else{
		theta_group.hide();
	}
}

function create_a(){
	a_group = canvas.group();
	var a_arrow = a_group.accel_arrow();
	a_arrow.stroke({color: "#FFCCCC", linecap: "round", linejoin: "round"});
	a_arrow.head_L(10);
	var a_label_container = a_group.group();
	var a_label = a_label_container.text("");
	a_label.fill("#FFCCCC");
}

function redraw_a(){
	if(show_a && Math.abs(block_a)>0.01){
		var a_arrow = a_group.get(0);
		a_arrow.body_L( Math.abs(block_a) * a_scale);
		a_arrow.set_rotation( block_a > 0 ? 0 : 180 );
		a_arrow.set_translation_XY( x_to_canvas(block_s) - block_a * a_scale / 2.0, y_to_canvas(block_height) );
		a_arrow.stroke_W(4);
		var a_label_container = a_group.get(1);
		var a_label = a_label_container.get(0);
		a_label.text("a").font("style","italic").font_H(font_size * 0.8);
		a_label.CX(0).CY(0);
		a_label_container.set_translation_XY( x_to_canvas(block_s) , y_to_canvas(block_height) - font_size * 0.6 );
		a_label_container.set_rotation(theta / Math.PI * 180);
		a_group.show();
	}else{
		a_group.hide();
	}
}

function create_v(){
	v_group = canvas.group();
	var v_arrow = v_group.arrow();
	v_arrow.stroke({color: "#FFE57F", linecap: "round", linejoin: "round"});
	v_arrow.head_L(10);
	var v_label_container = v_group.group();
	var v_label = v_label_container.text("");
	v_label.fill("#FFE57F");
}

function redraw_v(){
	if(show_v && block_is_moving){
		var v_arrow = v_group.get(0);
		v_arrow.body_L( Math.abs(block_v) * v_scale);
		v_arrow.set_rotation( block_v > 0 ? 0 : 180 );
		v_group.set_translation_XY( x_to_canvas(block_s), y_to_canvas(0) );
		v_arrow.stroke_W(4);
		var v_label_container = v_group.get(1);
		var v_label = v_label_container.get(0);
		v_label.text("v").font("style","italic").font_H(font_size * 0.8);
		v_label.CX(0).CY(0);
		v_label_container.set_translation_XY( block_v * v_scale / 2.0 , -font_size * 0.6 );
		v_label_container.set_rotation(theta / Math.PI * 180);
		v_group.show();
	}else{
		v_group.hide();
	}
}

function create_s(){
	s_group = canvas.group();
	var s_arrow = s_group.arrow();
	s_arrow.stroke({color: "#FFFF99", linecap: "round", linejoin: "round"});
	s_arrow.head_L(10);
	var s_line1 = s_group.line();
	s_line1.stroke({color: "#A6CC8C"});
	var s_line2 = s_group.line();
	s_line2.stroke({color: "#A6CC8C"});
	var s_label_container = s_group.group();
	var s_label = s_label_container.text("");
	s_label.fill("#FFFF99");
}

function redraw_s(){
	if(show_s){
		
		var s_arrow = s_group.get(0);
		s_arrow.set_translation_XY( x_to_canvas(0), y_to_canvas( -block_height * 0.75) );
		s_arrow.body_L( block_s * length_scale_factor );
		s_arrow.stroke_W(4);
		
		var s_line1 = s_group.get(1);
		s_line1.plot_XY([
			x_to_canvas(0),
			y_to_canvas(block_height * 0.75),
			x_to_canvas(0),
			y_to_canvas(-block_height)
		]);
		s_line1.stroke_W(2);
		s_line1.stroke_dasharray_L(8);
		
		var s_line2 = s_group.get(2);
		s_line2.plot_XY([
			x_to_canvas(block_s),
			y_to_canvas(block_height * 0.75),
			x_to_canvas(block_s),
			y_to_canvas(-block_height)
		]);
		s_line2.stroke_W(2);
		s_line2.stroke_dasharray_L(8);
		
		var s_label_container = s_group.get(3);
		var s_label = s_label_container.get(0);
		s_label.text("s").font("style","italic").font_H(font_size * 0.8);
		s_label.CX(0).CY(0);
		s_label_container.set_translation_XY( x_to_canvas(block_s / 2.0) , y_to_canvas( -block_height * 0.75) + font_size * 0.4 );
		s_label_container.set_rotation(theta / Math.PI * 180);
		
		s_group.show();
		
	}else{
		s_group.hide();
	}
}

// Events

function svg_obj_init(){
	disp_svg = SVG().addTo("#disp_area");
	create_canvas();
	redraw_canvas();
}

function svg_obj_on_enter_frame(){
	redraw_canvas();
}

function svg_obj_on_layout_change(){
	redraw_canvas();
}




