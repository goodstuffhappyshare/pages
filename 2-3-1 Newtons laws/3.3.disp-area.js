/*******************************************************************************

  ~ Display Area Layout ~

  This script sets up the display area for showing the processing results.

*******************************************************************************/

////////// DISPLAY AREA LAYOUT /////////////////////////////////////////////////

//----- Values -----//

var disp_area_pad = 15;
var p_box_size;
var p_box_size_min = 300;
var p_box_border_W = 4;

//----- Methods -----//

function calc_disp_area_sizes(){
	var avail_width = disp_area_W - disp_area_pad * 2;
	var avail_height = disp_area_H - disp_area_pad * 2;
	p_box_size = Math.min(avail_height, avail_width);
	p_box_size = Math.max(p_box_size, p_box_size_min);
}

function resize_disp_area_components(){
	$("#p_box").L((disp_area_W - p_box_size) / 2.0);
	$("#p_box").T(disp_area_pad);
	$("#p_box").W(p_box_size);
	$("#p_box").H(p_box_size);
	$("#p_box").border_W(p_box_border_W);
}

function update_disp_area_layout(){
	calc_disp_area_sizes();
	resize_disp_area_components();
}

////////// DISPLAY AREA MAIN EVENTS ////////////////////////////////////////////

function disp_area_init(){
	update_disp_area_layout();
	p_box_init();
}

function disp_area_on_enter_frame(dt){
	p_box_on_enter_frame(dt);
}

function disp_area_on_layout_change(){
	update_disp_area_layout();
	p_box_on_layout_change();
}

////////// OBJECTS INSIDE DISPLAY AREA /////////////////////////////////////////

//----- p_box -----//

// Variables

var particle_r = 20; // radius of the particle in "internal coordinates"
var v_scale = 0.3; // scale factor for velocity arrow
var f_scale = 0.2; // scale factor for force arrow

// Objects

var p_box_svg;
var p_box_particles = new Array(9);

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

// i, j : [-1, 0, 1]

function create_particle(i, j){
	
	var id = (i+1)*3 + (j+1);
	
	// A group containing a circle and two arrows
	
	var particle = p_box_svg.group();
	p_box_particles[id] = particle;
	
	var circle = particle.circle(1);
	circle.stroke({color: "#FFFFFF"});
	circle.fill({color: "#FFFFFF", opacity: 0});
	
	var v_arrow = particle.arrow();
	v_arrow.stroke({color: "#FFE57F", linecap: "round", linejoin: "round"});
	v_arrow.head_L(10);
	
	var f_arrow = particle.arrow();
	f_arrow.stroke({color: "#FF0000", linecap: "round", linejoin: "round"});
	f_arrow.head_L(10);
	
	redraw_particle(i, j);
}

function redraw_particle(i, j){
	
	var id = (i+1)*3 + (j+1);
	var particle = p_box_particles[id];
	
	// Position of particle
	
	var X = x_to_p_box(p_sx) + i * p_box_size;
	var Y = y_to_p_box(p_sy) + j * p_box_size;
	particle.set_translation_XY(X,Y);
	
	// Size of particle
	
	var circle = particle.get(0);
	circle.R( length_to_p_box(particle_r) );
	circle.stroke_W(4);
	
	// Colour of particle
	
	var p_opacity = (p_mass - p_mass_min) / (p_mass_max - p_mass_min);
	circle.fill({opacity: p_opacity});
	
	// Velocity arrow
	
	var v_arrow = particle.get(1);
	
	var v = Math.sqrt(p_vx*p_vx + p_vy*p_vy);
	var v_len = length_to_p_box(v) * v_scale;
	var v_angle = Math.atan2(p_vy, p_vx) * 180 / Math.PI;
	
	if(v > 1){
		v_arrow.body_L(v_len);
		v_arrow.set_rotation(v_angle);
		v_arrow.stroke_W(4);
		v_arrow.show();
	}else{
		v_arrow.hide();
	}
	
	// Force arrow
	
	var f_arrow = particle.get(2);
	
	if(f_btn_is_dragging){
		f_arrow.show();
		
		var f = Math.sqrt(f_x*f_x + f_y*f_y);
		var f_len = length_to_p_box(f) * f_scale;
		var f_angle = Math.atan2(f_y, f_x) * 180 / Math.PI;
		
		f_arrow.body_L(f_len);
		f_arrow.set_rotation(f_angle);
		f_arrow.stroke_W(4);
	}else{
		f_arrow.hide();
	}
}

// Methods (all particles)

function create_particles(){
	for(i=-1; i<=1; i++){
		for(j=-1; j<=1; j++){
			create_particle(i, j);
		}
	}
}

function redraw_particles(){
	for(i=-1; i<=1; i++){
		for(j=-1; j<=1; j++){
			redraw_particle(i, j);
		}
	}
}

// Methods (others)

function resize_p_box_svg(){
	p_box_svg.W(p_box_size);
	p_box_svg.H(p_box_size);
}

// Events

function p_box_init(){
	p_box_svg = SVG().addTo("#p_box");
	create_particles();
	resize_p_box_svg();
}

function p_box_on_enter_frame(dt){
	redraw_particles();
}

function p_box_on_layout_change(){
	redraw_particles();
	resize_p_box_svg();
}







