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

//----- SVG Object -----//

/* Structure of the SVG object:
   Inside the SVG object is a "canvas" group whose origin is located at the
   centre of the display area. Inside the group are (from bottom to top):
    - rod_group
	- LOA_group
	- rE_group
	- FE_group
	- FP_group
	- ang_v_group
	- ang_a_group
	- CM_v_group
	- CM_a_group
	- pivot_group
   
   Coordinate conversion:
   Imagine a square box extending to the edges of the display area.
   The length of the rod is 40% of the side of this square box.               */

// Values

var side_W;
var rod_span = 0.4;
var rod_thickness = 0.025; // thickness of the rod is 2.5% of side of square box
var pivot_diameter = 0.015; // diameter of pivot is 1.5%

var f_scale = 80; // scale factor for force arrows
var v_scale = 100; // scale factor for velocity arrow
var a_scale = 50; // scale factor for acceleration arrow
var ang_v_scale = 20; // scale factor for angular velocity arrow
var ang_a_scale = 50; // scale factor for angular acceleration arrow

var ang_v_arrow_R = 25; // radius of angular velocity arrow
var ang_a_arrow_R = 50; // radius of angular acceleration arrow

// Objects

var disp_svg;
var canvas;

var rod_group;
var LOA_group;
var rE_group;
var FE_group;
var FP_group;
var ang_v_group;
var ang_a_group;
var CM_v_group;
var CM_a_group;
var pivot_group;

// Methods (conversion of coordinates)

/* Note: ang_s, ang_v, ang_a take anti-clockwise as positive and use radian as
   the unit. The set_rotation() function takes clockwise as positive and use
   degree as the unit. Angles in "document coordinates" take clockwise as
   positive.                                                                  */

var length_scale_factor;

function calc_length_scale_factor(){
	side_W = Math.min(disp_area_W, disp_area_H);
	length_scale_factor = side_W * rod_span / rod_length;
}

function x_to_canvas(x){
	return x * length_scale_factor;
}

function y_to_canvas(y){
	// y is upward-positive while Y is downward-positive
	return -y * length_scale_factor;
}

// Methods (drawing)

function create_canvas(){
	canvas = disp_svg.group();
	calc_length_scale_factor();
	
	create_rod_group();
	create_LOA_group();
	create_rE_group();
	create_FE_group();
	create_FP_group();
	create_ang_v_group();
	create_ang_a_group();
	create_CM_v_group();
	create_CM_a_group();
	create_pivot_group();
}

function redraw_canvas(){
	disp_svg.W(disp_area_W);
	disp_svg.H(disp_area_H);
	canvas.set_translation_XY(disp_area_W / 2.0, disp_area_H / 2.0);
	calc_length_scale_factor();
	
	redraw_rod_group();
	redraw_LOA_group();
	redraw_rE_group();
	redraw_FE_group();
	redraw_FP_group();
	redraw_ang_v_group();
	redraw_ang_a_group();
	redraw_CM_v_group();
	redraw_CM_a_group();
	redraw_pivot_group();
}

function create_rod_group(){
	rod_group = canvas.group();
	var rod_poly = rod_group.polygon([0,0,0,0]);
	rod_poly.stroke({color: "#FFFFFF"});
	rod_poly.fill({opacity: 0});
}

function redraw_rod_group(){
	var rod_poly = rod_group.get(0);
	var X1 = rod_span * side_W;
	var X2 = rod_thickness * side_W / 2.0;
	var L = -X2;
	var R = X1 + X2;
	var B = X2;
	var T = -X2;
	rod_poly.plot_XY([L,B,R,B,R,T,L,T]);
	rod_poly.set_rotation(-ang_s / Math.PI * 180);
	rod_poly.stroke_W(4);
	/* Opacity is 1 by default, will be changed to 0.5 if any of the following
	   is visible:
		- rE
	    - Line of action
		- CM_v
		- CM_a                                                                */
	rod_poly.stroke({opacity: 1.0});
}

function create_LOA_group(){
	LOA_group = canvas.group();
	var LOA_line_group = LOA_group.group();
	var LOA_line = LOA_line_group.line([0,0,0,0]);
	LOA_line.stroke({color: "#99CCFF"});
	var tE_line_group = LOA_group.group();
	var tE_line = tE_line_group.line([0,0,0,0]);
	tE_line.stroke({color: "#FFFF99"});
	var tE_arrow = LOA_group.arc_arrow();
	tE_arrow.head_L(6);
	tE_arrow.stroke({color: "#FFFF99"});
	var tE_label_container = LOA_group.group();
	var tE_label = tE_label_container.text("");
	tE_label.fill("#FFFF99");
}

function redraw_LOA_group(){
	if(show_LOA){
		var L = disp_area_W + disp_area_H;
		
		var LOA_line_group = LOA_group.get(0);
		var LOA_line = LOA_line_group.get(0);
		LOA_line.plot([0,L,0,-L]);
		LOA_line.stroke_W(2);
		LOA_line.stroke_dasharray_L(8);
		LOA_line_group.set_translation_XY( x_to_canvas(rE_x), y_to_canvas(rE_y) );
		LOA_line_group.set_rotation(-(ang_s+tE-Math.PI/2.0) / Math.PI * 180);
		
		var tE_line_group = LOA_group.get(1);
		var tE_line = tE_line_group.get(0);
		tE_line.plot([0,0,L,0]);
		tE_line.stroke_W(2);
		tE_line.stroke_dasharray_L(8);
		tE_line_group.set_rotation(-ang_s / Math.PI * 180);
		
		var tE_corr = (FE>=0) ? tE : tE-Math.PI;
		var tE_arrow = LOA_group.get(2);
		tE_arrow.R(20);
		tE_arrow.angles(-ang_s/Math.PI*180.0, -(ang_s+tE_corr)/Math.PI*180.0);
		tE_arrow.set_translation_XY( x_to_canvas(rE_x), y_to_canvas(rE_y) );
		tE_arrow.stroke_W(2);
		var tE_label_container = LOA_group.get(3);
		var tE_label = tE_label_container.get(0);
		tE_label.clear();
		tE_label.build(true);
		tE_label.tspan("θ").font("style","italic").font_H(font_size * 0.8);
		tE_label.CX(0).CY(0);
		tE_label_container.set_translation_XY( x_to_canvas(rE_x) + (20+font_size*0.8)*Math.cos(-ang_s-tE_corr/2.0), y_to_canvas(rE_y) + (20+font_size*0.8)*Math.sin(-ang_s-tE_corr/2.0) );
		tE_label.tspan("E").attr("baseline-shift","sub").font("style","italic").font_H(font_size * 0.56);
		
		LOA_group.show();
		
		var rod_poly = rod_group.get(0);
		rod_poly.stroke({opacity: 0.5});
	}else{
		LOA_group.hide();
	}
}

function create_rE_group(){
	rE_group = canvas.group();
	var rE_arrow = rE_group.arrow();
	rE_arrow.stroke({color: "#FFFF99", linecap: "round", linejoin: "round"});
	rE_arrow.head_L(10);
	var rE_label_container = rE_group.group();
	var rE_label = rE_label_container.text("");
	rE_label.fill("#FFFF99");
}

function redraw_rE_group(){
	if(show_rE){
		var rE_L = rE * length_scale_factor;
		var rE_arrow = rE_group.get(0);
		rE_arrow.body_L(rE_L);
		rE_arrow.set_rotation(-ang_s / Math.PI * 180);
		rE_arrow.stroke_W(4);
		var rE_label_container = rE_group.get(1);
		var rE_label = rE_label_container.get(0);
		rE_label.clear();
		rE_label.build(true);
		rE_label.tspan("r").font("style","italic").font_H(font_size * 0.8);
		rE_label.CX(0).CY(0);
		rE_label_container.set_translation_XY( rE_L*0.5*Math.cos(-ang_s) - font_size*0.8*Math.sin(-ang_s), rE_L*0.5*Math.sin(-ang_s) + font_size*0.8*Math.cos(-ang_s) );
		rE_label.tspan("E").attr("baseline-shift","sub").font("style","italic").font_H(font_size * 0.56);
		rE_group.show();
		
		var rod_poly = rod_group.get(0);
		rod_poly.stroke({opacity: 0.5});
	}else{
		rE_group.hide();
	}
}

function create_FE_group(){
	FE_group = canvas.group();
	var FE_arrow = FE_group.arrow();
	FE_arrow.stroke({color: "#FF0000", linecap: "round", linejoin: "round"});
	FE_arrow.head_L(10);
	var FE_label_container = FE_group.group();
	var FE_label = FE_label_container.text("");
	FE_label.fill("#FF0000");
}

function redraw_FE_group(){
	if(FE){
		var rE_L = rE * length_scale_factor;
		var FE_L = Math.abs(FE * f_scale);
		var FE_ang = ang_s + tE + (FE>0 ? 0 : Math.PI);
		var FE_arrow = FE_group.get(0);
		FE_arrow.body_L(FE_L);
		FE_group.set_translation_XY( rE_L*Math.cos(-ang_s), rE_L*Math.sin(-ang_s) );
		FE_arrow.set_rotation(-FE_ang / Math.PI * 180);
		FE_arrow.stroke_W(4);
		var FE_label_container = FE_group.get(1);
		var FE_label = FE_label_container.get(0);
		FE_label.clear();
		FE_label.build(true);
		FE_label.tspan("F").font("style","italic").font_H(font_size * 0.8);
		FE_label.CX(0).CY(0);
		FE_label_container.set_translation_XY( (FE_L+font_size*0.8)*Math.cos(-FE_ang), (FE_L+font_size*0.8)*Math.sin(-FE_ang) );
		FE_label.tspan("E").attr("baseline-shift","sub").font("style","italic").font_H(font_size * 0.56);
		FE_group.show();
	}else{
		FE_group.hide();
	}
}

function create_FP_group(){
	FP_group = canvas.group();
	var FP_arrow = FP_group.arrow();
	FP_arrow.stroke({color: "#FF0000", linecap: "round", linejoin: "round"});
	FP_arrow.head_L(10);
	var FP_label_container = FP_group.group();
	var FP_label = FP_label_container.text("");
	FP_label.fill("#FF0000");
}

function redraw_FP_group(){
	var FP_L = Math.sqrt(FP_x*FP_x + FP_y*FP_y) * f_scale;
	if(show_FP && FP_L){
		var FP_ang = Math.atan2(FP_y, FP_x);
		var FP_arrow = FP_group.get(0);
		FP_arrow.body_L(FP_L);
		FP_arrow.set_rotation(-FP_ang / Math.PI * 180);
		FP_arrow.stroke_W(4);
		var FP_label_container = FP_group.get(1);
		var FP_label = FP_label_container.get(0);
		FP_label.clear();
		FP_label.build(true);
		FP_label.tspan("F").font("style","italic").font_H(font_size * 0.8);
		FP_label.CX(0).CY(0);
		FP_label_container.set_translation_XY( (FP_L+font_size*0.8)*Math.cos(-FP_ang), (FP_L+font_size*0.8)*Math.sin(-FP_ang) );
		FP_label.tspan("P").attr("baseline-shift","sub").font("style","italic").font_H(font_size * 0.56);
		FP_group.show();
	}else{
		FP_group.hide();
	}
}

function create_ang_v_group(){
	ang_v_group = canvas.group();
	var ang_v_arrow = ang_v_group.arc_arrow();
	ang_v_arrow.stroke({color: "#FFE57F", linecap: "round", linejoin: "round"});
	ang_v_arrow.head_L(6);
	var ang_v_label_container = ang_v_group.group();
	var ang_v_label = ang_v_label_container.text("");
	ang_v_label.fill("#FFE57F");
}

function redraw_ang_v_group(){
	if(show_ang_v){
		var ang_v_arrow = ang_v_group.get(0);
		ang_v_arrow.R(ang_v_arrow_R);
		ang_v_arrow.angles(0, -ang_v * ang_v_scale);
		ang_v_arrow.stroke_W(2);
		var ang_v_label_container = ang_v_group.get(1);
		var ang_v_label = ang_v_label_container.get(0);
		ang_v_label.clear();
		ang_v_label.build(true);
		ang_v_label.tspan("ω").font("style","italic").font_H(font_size * 0.6);
		ang_v_label.CX(0).CY(0);
		ang_v_label_container.set_translation_XY( ang_v_arrow_R, font_size*0.4*(ang_v>=0 ? 1 : -1) );
		ang_v_group.show();
	}else{
		ang_v_group.hide();
	}
}

function create_ang_a_group(){
	ang_a_group = canvas.group();
	var ang_a_arrow = ang_a_group.arc_accel_arrow();
	ang_a_arrow.stroke({color: "#FFCCCC", linecap: "round", linejoin: "round"});
	ang_a_arrow.head_L(6);
	var ang_a_label_container = ang_a_group.group();
	var ang_a_label = ang_a_label_container.text("");
	ang_a_label.fill("#FFCCCC");
}

function redraw_ang_a_group(){
	if(show_ang_a && FE){
		var ang_a_arrow = ang_a_group.get(0);
		ang_a_arrow.R(ang_a_arrow_R);
		ang_a_arrow.angles(0, -ang_a * ang_a_scale);
		ang_a_arrow.stroke_W(2);
		var ang_a_label_container = ang_a_group.get(1);
		var ang_a_label = ang_a_label_container.get(0);
		ang_a_label.clear();
		ang_a_label.build(true);
		ang_a_label.tspan("α").font("style","italic").font_H(font_size * 0.6);
		ang_a_label.CX(0).CY(0);
		ang_a_label_container.set_translation_XY( ang_a_arrow_R, font_size*0.4*(ang_a>=0 ? 1 : -1) );
		ang_a_group.show();
	}else{
		ang_a_group.hide();
	}
}

function create_CM_v_group(){
	CM_v_group = canvas.group();
	var CM_v_arrow = CM_v_group.arrow();
	CM_v_arrow.stroke({color: "#FFE57F", linecap: "round", linejoin: "round"});
	CM_v_arrow.head_L(10);
	var CM_v_label_container = CM_v_group.group();
	var CM_v_label = CM_v_label_container.text("");
	CM_v_label.fill("#FFE57F");
}

function redraw_CM_v_group(){
	var CM_v_L = Math.sqrt(CM_v_x*CM_v_x + CM_v_y*CM_v_y) * v_scale;
	if(show_CM_v && CM_v_L){
		var CM_r_L = CM_r * length_scale_factor;
		var CM_v_ang = Math.atan2(CM_v_y, CM_v_x);
		var CM_v_arrow = CM_v_group.get(0);
		CM_v_arrow.body_L(CM_v_L);
		CM_v_group.set_translation_XY( CM_r_L*Math.cos(-ang_s) ,CM_r_L*Math.sin(-ang_s) );
		CM_v_arrow.set_rotation(-CM_v_ang / Math.PI * 180);
		CM_v_arrow.stroke_W(4);
		var CM_v_label_container = CM_v_group.get(1);
		var CM_v_label = CM_v_label_container.get(0);
		CM_v_label.clear();
		CM_v_label.build(true);
		CM_v_label.tspan("v").font("style","italic").font_H(font_size * 0.8);
		CM_v_label.CX(0).CY(0);
		CM_v_label_container.set_translation_XY( (CM_v_L+font_size*0.8)*Math.cos(-CM_v_ang), (CM_v_L+font_size*0.8)*Math.sin(-CM_v_ang) );
		CM_v_label.tspan("CM").attr("baseline-shift","sub").font("style","italic").font_H(font_size * 0.56);
		CM_v_group.show();
		
		var rod_poly = rod_group.get(0);
		rod_poly.stroke({opacity: 0.5});
	}else{
		CM_v_group.hide();
	}
}

function create_CM_a_group(){
	CM_a_group = canvas.group();
	var CM_a_arrow = CM_a_group.accel_arrow();
	CM_a_arrow.stroke({color: "#FFCCCC", linecap: "round", linejoin: "round"});
	CM_a_arrow.head_L(10);
	var CM_a_label_container = CM_a_group.group();
	var CM_a_label = CM_a_label_container.text("");
	CM_a_label.fill("#FFCCCC");
}

function redraw_CM_a_group(){
	var CM_a_L = Math.sqrt(CM_a_x*CM_a_x + CM_a_y*CM_a_y) * a_scale;
	if(show_CM_a && CM_a_L){
		var CM_r_L = CM_r * length_scale_factor;
		var CM_a_ang = Math.atan2(CM_a_y, CM_a_x);
		var CM_a_arrow = CM_a_group.get(0);
		CM_a_arrow.body_L(CM_a_L);
		CM_a_group.set_translation_XY( CM_r_L*Math.cos(-ang_s) ,CM_r_L*Math.sin(-ang_s) );
		CM_a_arrow.set_rotation(-CM_a_ang / Math.PI * 180);
		CM_a_arrow.stroke_W(4);
		var CM_a_label_container = CM_a_group.get(1);
		var CM_a_label = CM_a_label_container.get(0);
		CM_a_label.clear();
		CM_a_label.build(true);
		CM_a_label.tspan("a").font("style","italic").font_H(font_size * 0.8);
		CM_a_label.CX(0).CY(0);
		CM_a_label_container.set_translation_XY( (CM_a_L+font_size*0.8)*Math.cos(-CM_a_ang), (CM_a_L+font_size*0.8)*Math.sin(-CM_a_ang) );
		CM_a_label.tspan("CM").attr("baseline-shift","sub").font("style","italic").font_H(font_size * 0.56);
		CM_a_group.show();
		
		var rod_poly = rod_group.get(0);
		rod_poly.stroke({opacity: 0.5});
	}else{
		CM_a_group.hide();
	}
}

function create_pivot_group(){
	pivot_group = canvas.group();
	var pivot_circle = pivot_group.circle(1);
	pivot_circle.stroke({color: "#FFFFFF"});
	pivot_circle.fill({color: "#548234", opacity: 1});
}

function redraw_pivot_group(){
	var pivot_circle = pivot_group.get(0);
	pivot_circle.R(pivot_diameter * side_W / 2.0);
	pivot_circle.stroke_W(4);
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




