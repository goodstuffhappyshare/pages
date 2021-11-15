/*******************************************************************************

  ~ Control Area ~

  This script sets up the control area which receives user input.

*******************************************************************************/

////////// CONTROL AREA LAYOUT /////////////////////////////////////////////////

//----- Values -----//

// Fixed values

var ctrl_area_pad = 15;
var FE_slider_W_min = 150;

// Calculated values

var FE_title_L, FE_title_T, FE_title_W, FE_title_H;
var FE_slider_L, FE_slider_CY, FE_slider_W, FE_slider_H;
var jq_slider_L, jq_slider_W, jq_slider_H;
var slider_CY_interval;

var display_options_L, display_options_T, display_options_W, display_options_H;

//----- Methods -----//

function free_resize_ctrl_area_text(){
	/* put textboxs at positions where they are allowed to freely expand
	   (or shrink) to a size suitable for display, then read this size and
	   then fix it.                                                           */
	
	$("#FE_sliders_title").L(ctrl_area_pad*2).auto_size();
	FE_title_W = $("#FE_sliders_title").W();
	FE_title_H = $("#FE_sliders_title").H();
	$("#FE_sliders_title").W(FE_title_W);
	$("#FE_sliders_title").H(FE_title_H);
	
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
	FE_title_L = ctrl_area_pad;
	FE_title_T = ctrl_area_pad;
	
	FE_slider_L = ctrl_area_pad * 2 + font_size;
	FE_slider_CY = FE_title_T + FE_title_H + ctrl_area_pad + font_size * 0.6;
	FE_slider_W = ctrl_area_W - FE_slider_L - ctrl_area_pad;
	if(FE_slider_W < FE_slider_W_min) FE_slider_W = FE_slider_W_min;
	FE_slider_H = font_size * 1.2;
	
	slider_CY_interval = font_size * 1.2 + ctrl_area_pad;
	jq_slider_L = FE_slider_L + font_size * 0.6;
	jq_slider_W = FE_slider_W - font_size * 1.2;
	jq_slider_H = font_size * 0.6;
	
	display_options_L = ctrl_area_pad;
	display_options_T = FE_title_T + FE_title_H + ctrl_area_pad * 4 + font_size * 1.2 * 3;
}

function resize_ctrl_area_components(){
	$("#FE_sliders_title").L(FE_title_L);
	$("#FE_sliders_title").T(FE_title_T);
	
	$("#FE_label").L(ctrl_area_pad).CY(FE_slider_CY+slider_CY_interval*0);
	$("#rE_label").L(ctrl_area_pad).CY(FE_slider_CY+slider_CY_interval*1);
	$("#tE_label").L(ctrl_area_pad).CY(FE_slider_CY+slider_CY_interval*2);
	
	$("#FE_slider").W(FE_slider_W).H(FE_slider_H);
	$("#rE_slider").W(jq_slider_W).H(jq_slider_H);
	$("#tE_slider").W(jq_slider_W).H(jq_slider_H);
	
	$("#FE_slider").L(FE_slider_L).CY(FE_slider_CY+slider_CY_interval*0);
	$("#rE_slider").L(jq_slider_L).CY(FE_slider_CY+slider_CY_interval*1);
	$("#tE_slider").L(jq_slider_L).CY(FE_slider_CY+slider_CY_interval*2);
	
	$("#FE_btn").W(font_size * 1.2).H(font_size * 1.2);
	
	$("#display_options").L(display_options_L);
	$("#display_options").T(display_options_T);
	
	$("#FE_slider").border_W(1);
	$("#FE_btn").border_W(1);
}

function update_ctrl_area_layout(){
	free_resize_ctrl_area_text();
	calc_ctrl_area_sizes();
	resize_ctrl_area_components();
}

////////// CONTROL AREA MAIN EVENTS ////////////////////////////////////////////

function ctrl_area_init(){
	update_ctrl_area_layout();
	FE_slider_init();
	jq_sliders_init();
	checkradio_init();
}

function ctrl_area_on_enter_frame(dt){
	FE_slider_on_enter_frame(dt);
}

function ctrl_area_on_layout_change(){
	update_ctrl_area_layout();
	FE_slider_on_layout_change();
}

////////// OBJECTS INSIDE CONTROL AREA /////////////////////////////////////////

//----- FE Slider -----//

// Values

var FE_slider_value = 0; // varies from -1 to +1
var FE_btn_is_dragging = false;

// Objects

var FE_slider_svg;
var FE_slider_line;

// Methods (conversion between slider value and button position)

function FE_value_to_position(value){
	var max_X = FE_slider_W - font_size * 0.6;
	var min_X = font_size * 0.6;
	return (value/2.0+0.5) * (max_X - min_X) + min_X;
}

function FE_position_to_value(X){
	var max_X = FE_slider_W - font_size * 0.6;
	var min_X = font_size * 0.6;
	return (X - min_X) / (max_X - min_X) * 2 - 1;
}

// Methods (button object)

function set_FE_btn_position(){
	$("#FE_btn").CX( FE_value_to_position(FE_slider_value) );
}

function read_FE_btn_position(){
	FE_slider_value = FE_position_to_value( $("#FE_btn").CX() );
}

// Methods (line showing applied force)

function create_force_line(){
	FE_slider_svg = SVG().addTo("#FE_slider");
	FE_slider_line = FE_slider_svg.line(0,0,0,0);
	FE_slider_line.stroke({color: "#FF0000", linecap: "round"});
	
	redraw_force_line();
	resize_FE_slider_svg();
}

function redraw_force_line(){
	FE_slider_line.plot_XY([
		FE_slider_W/2, FE_slider_H/2,
		FE_value_to_position(FE_slider_value), FE_slider_H/2
	]);
	FE_slider_line.stroke_W(6);
}

function resize_FE_slider_svg(){
	FE_slider_svg.W(FE_slider_W);
	FE_slider_svg.H(FE_slider_H);
}

// Events

function FE_slider_init(){
	set_FE_btn_position();
	$("#FE_btn").draggable({"containment":"parent"});
	$("#FE_btn").on("dragstart", FE_btn_on_dragstart);
	$("#FE_btn").on("dragstop", FE_btn_on_dragstop);
	
	create_force_line();
}

function FE_slider_on_enter_frame(dt){
	if(FE_btn_is_dragging){
		read_FE_btn_position();
		FE = FE_slider_value * FE_max;
	}else{
		FE_slider_value *= Math.exp(-10 * dt);
		set_FE_btn_position();
		FE = 0;
	}
	redraw_force_line();
}

function FE_slider_on_layout_change(){
	resize_FE_slider_svg();
}

function FE_btn_on_dragstart(){
	FE_btn_is_dragging = true;
}

function FE_btn_on_dragstop(){
	FE_btn_is_dragging = false;
}

//----- jQuery Sliders -----//

function jq_sliders_init(){
	var rE_init = (rE - rE_min) / (rE_max - rE_min);
	$("#rE_slider").slider({min:0, max:1, step:0.01, value:rE_init});
	$("#rE_slider").on("slide", ctrl_on_rE_change);
	$("#rE_slider").on("slidestart", jq_sliders_on_slidestart);
	$("#rE_slider").on("slidestop", jq_sliders_on_slidestop);
	$("#rE_slider").css("position", "absolute");
	
	var tE_init = (tE - tE_min) / (tE_max - tE_min);
	$("#tE_slider").slider({min:0, max:1, step:1.0/36.0, value:tE_init});
	$("#tE_slider").on("slide", ctrl_on_tE_change);
	$("#tE_slider").on("slidestart", jq_sliders_on_slidestart);
	$("#tE_slider").on("slidestop", jq_sliders_on_slidestop);
	$("#tE_slider").css("position", "absolute");
}

function ctrl_on_rE_change(e, ui){
	var v = ui.value; //v is a value between 0 and 1
	rE = v * (rE_max - rE_min) + rE_min;
}

function ctrl_on_tE_change(e, ui){
	var v = ui.value;
	tE = v * (tE_max - tE_min) + tE_min;
}

function jq_sliders_on_slidestart(){
	is_dragging_slider = true;
}

function jq_sliders_on_slidestop(){
	is_dragging_slider = false;
}

//----- Checkbox and Radio Button -----//

function checkradio_init(){
	$("#check_LOA"  ).change(check_LOA_on_change);
	$("#check_rE"   ).change(check_rE_on_change);
	$("#check_FP"   ).change(check_FP_on_change);
	$("#check_ang_v").change(check_ang_v_on_change);
	$("#check_ang_a").change(check_ang_a_on_change);
	$("#check_CM_v" ).change(check_CM_v_on_change);
	$("#check_CM_a" ).change(check_CM_a_on_change);
	$('input[name="radio_speed"]').change(radio_speed_on_change);
}

function check_LOA_on_change(){
	show_LOA = $("#check_LOA").is(':checked');
}

function check_rE_on_change(){
	show_rE = $("#check_rE").is(':checked');
}

function check_FP_on_change(){
	show_FP = $("#check_FP").is(':checked');
}

function check_ang_v_on_change(){
	show_ang_v = $("#check_ang_v").is(':checked');
}

function check_ang_a_on_change(){
	show_ang_a = $("#check_ang_a").is(':checked');
}

function check_CM_v_on_change(){
	show_CM_v = $("#check_CM_v").is(':checked');
}

function check_CM_a_on_change(){
	show_CM_a = $("#check_CM_a").is(':checked');
}

function radio_speed_on_change(){
	var speed_percentage = $('input[name="radio_speed"]:checked').val();
	play_speed = parseFloat(speed_percentage) / 100.0;
}






