/*******************************************************************************

  ~ Control Area ~

  This script sets up the control area which receives user input.

*******************************************************************************/

////////// CONTROL AREA LAYOUT /////////////////////////////////////////////////

//----- Values -----//

// Fixed values

var ctrl_area_pad = 15;
var F_slider_W_min = 150;

// Calculated values

var F_slider_L, F_slider_CY, F_slider_W, F_slider_H;
var jq_slider_L, jq_slider_W, jq_slider_H;
var slider_CY_interval;

var display_options_L, display_options_T, display_options_W, display_options_H;

//----- Methods -----//

function free_resize_ctrl_area_text(){
	/* put textboxs at positions where they are allowed to freely expand
	   (or shrink) to a size suitable for display, then read this size and
	   then fix it.                                                           */
	
	$("#display_options").L(ctrl_area_pad*2).auto_size();
	
	display_options_W = $("#display_options").W();
	display_options_H = $("#display_options").H();
	
	$("#display_options").W(display_options_W);
	$("#display_options").H(display_options_H);
}

/* Note: The handle of the jQuery slider has dimensions 1.2 em * 1.2 em. When
   the handle is on the left-most of the slider, its upper-left corner is at
   0.6 em to the left and 0.3 em upwards from that of the slider.             */

function calc_ctrl_area_sizes(){
	F_slider_L = ctrl_area_pad * 2 + font_size;
	F_slider_CY = ctrl_area_pad + font_size * 0.6;
	F_slider_W = ctrl_area_W - F_slider_L - ctrl_area_pad;
	if(F_slider_W < F_slider_W_min) F_slider_W = F_slider_W_min;
	F_slider_H = font_size * 1.2;
	
	slider_CY_interval = font_size * 1.2 + ctrl_area_pad;
	jq_slider_L = F_slider_L + font_size * 0.6;
	jq_slider_W = F_slider_W - font_size * 1.2;
	jq_slider_H = font_size * 0.6;
	
	display_options_L = (ctrl_area_W - display_options_W) / 2.0;
	if(display_options_L < ctrl_area_pad) display_options_L = ctrl_area_pad;
	display_options_T = ctrl_area_pad * 5 + font_size * 1.2 * 4;
}

function resize_ctrl_area_components(){
	$("#F_label").L(ctrl_area_pad).CY(F_slider_CY+slider_CY_interval*0);
	$("#f_label").L(ctrl_area_pad).CY(F_slider_CY+slider_CY_interval*1);
	$("#t_label").L(ctrl_area_pad).CY(F_slider_CY+slider_CY_interval*2);
	$("#m_label").L(ctrl_area_pad).CY(F_slider_CY+slider_CY_interval*3);
	
	$("#F_slider").W( F_slider_W).H( F_slider_H);
	$("#f_slider").W(jq_slider_W).H(jq_slider_H);
	$("#t_slider").W(jq_slider_W).H(jq_slider_H);
	$("#m_slider").W(jq_slider_W).H(jq_slider_H);
	
	$("#F_slider").L( F_slider_L).CY(F_slider_CY+slider_CY_interval*0);
	$("#f_slider").L(jq_slider_L).CY(F_slider_CY+slider_CY_interval*1);
	$("#t_slider").L(jq_slider_L).CY(F_slider_CY+slider_CY_interval*2);
	$("#m_slider").L(jq_slider_L).CY(F_slider_CY+slider_CY_interval*3);
	
	$("#F_btn").W(font_size * 1.2).H(font_size * 1.2);
	
	$("#display_options").L(display_options_L);
	$("#display_options").T(display_options_T);
	
	$("#F_slider").border_W(1);
	$("#F_btn").border_W(1);
	$("#display_options").border_W(1);
}

function update_ctrl_area_layout(){
	free_resize_ctrl_area_text();
	calc_ctrl_area_sizes();
	resize_ctrl_area_components();
}

////////// CONTROL AREA MAIN EVENTS ////////////////////////////////////////////

function ctrl_area_init(){
	update_ctrl_area_layout();
	F_slider_init();
	jq_sliders_init();
	checkradio_init();
}

function ctrl_area_on_enter_frame(dt){
	F_slider_on_enter_frame(dt);
}

function ctrl_area_on_layout_change(){
	update_ctrl_area_layout();
	F_slider_on_layout_change();
}

////////// OBJECTS INSIDE CONTROL AREA /////////////////////////////////////////

//----- F Slider -----//

// Values

var F_slider_value = 0; // varies from -1 to +1
var F_btn_is_dragging = false;

// Objects

var F_slider_svg;
var F_slider_line;

// Methods (conversion between slider value and button position)

function F_value_to_position(value){
	var max_X = F_slider_W - font_size * 0.6;
	var min_X = font_size * 0.6;
	return (value/2.0+0.5) * (max_X - min_X) + min_X;
}

function F_position_to_value(X){
	var max_X = F_slider_W - font_size * 0.6;
	var min_X = font_size * 0.6;
	return (X - min_X) / (max_X - min_X) * 2 - 1;
}

// Methods (button object)

function set_F_btn_position(){
	$("#F_btn").CX( F_value_to_position(F_slider_value) );
}

function read_F_btn_position(){
	F_slider_value = F_position_to_value( $("#F_btn").CX() );
}

// Methods (line showing applied force)

function create_force_line(){
	F_slider_svg = SVG().addTo("#F_slider");
	F_slider_line = F_slider_svg.line(0,0,0,0);
	F_slider_line.stroke({color: "#FF0000", linecap: "round"});
	
	redraw_force_line();
	resize_F_slider_svg();
}

function redraw_force_line(){
	F_slider_line.plot_XY([
		F_slider_W/2, F_slider_H/2,
		F_value_to_position(F_slider_value), F_slider_H/2
	]);
	F_slider_line.stroke_W(6);
}

function resize_F_slider_svg(){
	F_slider_svg.W(F_slider_W);
	F_slider_svg.H(F_slider_H);
}

// Events

function F_slider_init(){
	set_F_btn_position();
	$("#F_btn").draggable({"containment":"parent"});
	$("#F_btn").on("dragstart", F_btn_on_dragstart);
	$("#F_btn").on("dragstop", F_btn_on_dragstop);
	
	create_force_line();
}

function F_slider_on_enter_frame(dt){
	if(F_btn_is_dragging){
		read_F_btn_position();
		F = F_slider_value * F_max;
	}else{
		F_slider_value *= Math.exp(-10 * dt);
		set_F_btn_position();
		F = 0;
	}
	redraw_force_line();
}

function F_slider_on_layout_change(){
	resize_F_slider_svg();
}

function F_btn_on_dragstart(){
	F_btn_is_dragging = true;
}

function F_btn_on_dragstop(){
	F_btn_is_dragging = false;
}

//----- jQuery Sliders -----//

function jq_sliders_init(){
	var f_k_init = (f_k - f_k_min) / (f_k_max - f_k_min);
	$("#f_slider").slider({min:0, max:1, step:0.01, value:f_k_init});
	$("#f_slider").on("slide", ctrl_on_f_change);
	$("#f_slider").on("slidestart", jq_sliders_on_slidestart);
	$("#f_slider").on("slidestop", jq_sliders_on_slidestop);
	$("#f_slider").css("position", "absolute");
	
	var t_init = (theta - theta_min) / (theta_max - theta_min);
	$("#t_slider").slider({min:0, max:1, step:0.01, value:t_init});
	$("#t_slider").on("slide", ctrl_on_t_change);
	$("#t_slider").on("slidestart", jq_sliders_on_slidestart);
	$("#t_slider").on("slidestop", jq_sliders_on_slidestop);
	$("#t_slider").css("position", "absolute");
	
	var m_init = (m - m_min) / (m_max - m_min);
	$("#m_slider").slider({min:0, max:1, step:0.01, value:m_init});
	$("#m_slider").on("slide", ctrl_on_m_change);
	$("#m_slider").on("slidestart", jq_sliders_on_slidestart);
	$("#m_slider").on("slidestop", jq_sliders_on_slidestop);
	$("#m_slider").css("position", "absolute");
}

function ctrl_on_f_change(e, ui){
	var v = ui.value; //v is a value between 0 and 1
	f_k = v * (f_k_max - f_k_min) + f_k_min;
}

function ctrl_on_t_change(e, ui){
	var v = ui.value;
	theta = v * (theta_max - theta_min) + theta_min;
}

function ctrl_on_m_change(e, ui){
	var v = ui.value;
	m = v * (m_max - m_min) + m_min;
}

function jq_sliders_on_slidestart(){
	is_dragging_slider = true;
}

function jq_sliders_on_slidestop(){
	is_dragging_slider = false;
}

//----- Checkbox and Radio Button -----//

function checkradio_init(){
	$("#check_s").change(check_s_on_change);
	$("#check_v").change(check_v_on_change);
	$("#check_a").change(check_a_on_change);
	$("#check_theta").change(check_theta_on_change);
	$("#check_forces").change(check_forces_on_change);
	$('input[name="radio_forces"]').change(radio_forces_on_change);
	$('input[name="radio_speed"]').change(radio_speed_on_change);
}

function check_s_on_change(){
	show_s = $("#check_s").is(':checked');
}

function check_v_on_change(){
	show_v = $("#check_v").is(':checked');
}

function check_a_on_change(){
	show_a = $("#check_a").is(':checked');
}

function check_theta_on_change(){
	show_theta = $("#check_theta").is(':checked');
}

var show_forces = true;
var force_mode = "xy";

function check_forces_on_change(){
	show_forces = $("#check_forces").is(':checked');
	show_forces_x = show_forces && (force_mode=="x" || force_mode=="xy");
	show_forces_y = show_forces && (force_mode=="y" || force_mode=="xy");
}

function radio_forces_on_change(){
	force_mode = $('input[name="radio_forces"]:checked').val();
	show_forces_x = show_forces && (force_mode=="x" || force_mode=="xy");
	show_forces_y = show_forces && (force_mode=="y" || force_mode=="xy");
}

function radio_speed_on_change(){
	var speed_percentage = $('input[name="radio_speed"]:checked').val();
	play_speed = parseFloat(speed_percentage) / 100.0;
}













