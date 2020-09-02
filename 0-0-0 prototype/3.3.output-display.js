/*******************************************************************************

  ~ Output Display ~

  This script sets up the display area to display the processing results.

*******************************************************************************/

//----- Display Area -----//

// Dimensions

var disp_area_pad = 15;
var p_box_size;
var p_box_size_min = 300;

// Methods

function calc_disp_area_sizes(){
	avail_width = disp_area_W - disp_area_pad * 2;
	avail_height = disp_area_H - disp_area_pad * 2;
	p_box_size = Math.min(avail_height, avail_width);
	p_box_size = Math.max(p_box_size, p_box_size_min);
}

function resize_disp_area_components(){
	$("#p_box").L((disp_area_W - p_box_size) / 2.0);
	$("#p_box").T(disp_area_pad);
	$("#p_box").W(p_box_size);
	$("#p_box").H(p_box_size);
}

// Events

function disp_area_init(){
	calc_disp_area_sizes();
	resize_disp_area_components();
}

function disp_area_on_layout_change(){
	calc_disp_area_sizes();
	resize_disp_area_components();
}

//----- p_box -----//

// Variables

p_size = 30; // radius of the particle in "internal coordinates"
v_scale = 0.5; // scale factor for velocity arrow
f_scale = 0.3; // scale factor for force arrow

// Methods (conversion between coordinates)

function x_to_p_box(x){
	return 1.0 * (x - p_sx_min) / p_sx_range * p_box_size;
}
function y_to_p_box(y){
	return 1.0 * (y - p_sy_min) / p_sy_range * p_box_size;
}
function length_to_p_box(len){
	return 1.0 * len / p_sx_range * p_box_size;
}

// Methods (one particle)

/* There is only one particle in the box, but I make 8 idential
   copies (N, E, S, W, NE, SE, NW, SW) of it. For example, if the			   
   particle is approaching the east side of the p_box and part of
   it leaves the box, the copy on the west will partly show up on
   the other side of the box. "id" is for identifying the particle
   and its copies, while "offset_X" and "offset_Y" are for
   adjusting the positions of them.                               */

function create_particle(id, offset_X, offset_Y){
	
	// A group containing a circle and two arrows
	
	svg = $("#p_box").svg("get");
	p_container = svg.group("p_container_" + id);
	
	// Circle
	
	svg.circle(
		p_container, 0, 0, 1, {id: "particle_" + id,
		fill: "none", stroke: "white", strokeWidth: 4});
	
	// Velocity arrow: a group containing 3 lines
	
	v_arrow = svg.group(p_container, "v_arrow_" + id);
	svg.line(
		v_arrow, 0, 0, 0, 0, {id: "v_arrow_body_" + id,
		fill: "none", stroke: "#FFE57F", strokeWidth: 4});
	svg.line(
		v_arrow, 0, 0, 0, 0, {id: "v_arrow_head1_" + id,
		fill: "none", stroke: "#FFE57F", strokeWidth: 4});
	svg.line(
		v_arrow, 0, 0, 0, 0, {id: "v_arrow_head2_" + id,
		fill: "none", stroke: "#FFE57F", strokeWidth: 4});
	
	// Force arrow: a group containing 3 lines
	
	f_arrow = svg.group(p_container, "f_arrow_" + id);
	svg.line(
		f_arrow, 0, 0, 0, 0, {id: "f_arrow_body_" + id,
		fill: "none", stroke: "red", strokeWidth: 4});
	svg.line(
		f_arrow, 0, 0, 0, 0, {id: "f_arrow_head1_" + id,
		fill: "none", stroke: "red", strokeWidth: 4});
	svg.line(
		f_arrow, 0, 0, 0, 0, {id: "f_arrow_head2_" + id,
		fill: "none", stroke: "red", strokeWidth: 4});
	
	// Draw the initial shapes
	
	redraw_particle(id, offset_X, offset_Y);
}

function redraw_particle(id, offset_X, offset_Y){
	
	// Position of particle
	
	X = x_to_p_box(p_sx) + offset_X;
	Y = y_to_p_box(p_sy) + offset_Y;
	$("#p_container_" + id).attr(
		"transform", "translate(" + X * doc_scale + " " + Y * doc_scale + ")");
	
	// Size of particle
	
	radius = length_to_p_box(p_size);
	$("#particle_" + id).attr("r", radius * doc_scale);
	
	// Velocity arrow
	
	v = Math.sqrt(p_vx*p_vx + p_vy*p_vy);
	v_len = length_to_p_box(v) * v_scale;
	v_angle = Math.atan2(p_vy, p_vx) * 180 / Math.PI;
	$("#v_arrow_body_" + id).attr({
		x1: 0,                 y1: 0,
		x2: v_len * doc_scale, y2: 0
	});
	$("#v_arrow_head1_" + id).attr({
		x1: (v_len     ) * doc_scale, y1: ( 0 ) * doc_scale,
		x2: (v_len - 10) * doc_scale, y2: (-10) * doc_scale
	});
	$("#v_arrow_head2_" + id).attr({
		x1: (v_len     ) * doc_scale, y1: ( 0) * doc_scale,
		x2: (v_len - 10) * doc_scale, y2: (10) * doc_scale
	});
	$("#v_arrow_" + id).attr({
		transform: "rotate(" + v_angle + ")"
	});
	
	// Force arrow
	
	f = Math.sqrt(f_x*f_x + f_y*f_y);
	f_len = length_to_p_box(f) * f_scale;
	f_angle = Math.atan2(f_y, f_x) * 180 / Math.PI;
	$("#f_arrow_body_" + id).attr({
		x1: 0,                 y1: 0,
		x2: f_len * doc_scale, y2: 0
	});
	$("#f_arrow_head1_" + id).attr({
		x1: (f_len     ) * doc_scale, y1: ( 0 ) * doc_scale,
		x2: (f_len - 10) * doc_scale, y2: (-10) * doc_scale
	});
	$("#f_arrow_head2_" + id).attr({
		x1: (f_len     ) * doc_scale, y1: (0 ) * doc_scale,
		x2: (f_len - 10) * doc_scale, y2: (10) * doc_scale
	});
	$("#f_arrow_" + id).attr({
		transform: "rotate(" + f_angle + ")"
	});
	if(f_btn_is_dragging){
		$("#f_arrow_" + id).attr("opacity", 1);
	}else{
		$("#f_arrow_" + id).attr("opacity", 0);
	}
}

// Methods (all particles)

function create_particles(){
	for(i=-1; i<=1; i++){
		for(j=-1; j<=1; j++){
			id = "" + (i+2) + (j+2);
			create_particle(id, i*p_box_size, j*p_box_size);
		}
	}
}

function redraw_particles(){
	for(i=-1; i<=1; i++){
		for(j=-1; j<=1; j++){
			id = "" + (i+2) + (j+2);
			redraw_particle(id, i*p_box_size, j*p_box_size);
		}
	}
}

// Methods (others)

function resize_p_box_svg(){
	svg = $("#p_box").svg("get");
	svg.configure({"width": p_box_size * doc_scale, "height": p_box_size * doc_scale});
}

// Events

function p_box_init(){
	$("#p_box").svg(function(svg){
		create_particles();
		resize_p_box_svg();
	});
}

function p_box_on_enter_frame(dt){
	redraw_particles();
}

function p_box_on_layout_change(){
	redraw_particles();
	resize_p_box_svg();
}

//----- Output Display Events -----//

function output_display_init(){
	disp_area_init();
	p_box_init();
}

function output_display_on_enter_frame(dt){
	p_box_on_enter_frame(dt);
}

function output_display_on_layout_change(){
	disp_area_on_layout_change();
	p_box_on_layout_change();
}
