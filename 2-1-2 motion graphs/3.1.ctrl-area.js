/*******************************************************************************

  ~ Control Area ~

  This script sets up the control area which receives user input.

*******************************************************************************/

////////// CONTROL AREA LAYOUT /////////////////////////////////////////////////

//----- Values -----//

var ctrl_area_pad = 15;

//----- Methods -----//

/* Note: Each handle of the slider has dimensions 1.2 em * 1.2 em. When a
   handle is on the left-most of the slider, its upper-left corner is at
   0.6 em to the left and 0.3 em upwards from that of the slider.             */

function update_ctrl_area_layout(){
	var avail_W = ctrl_area_W - ctrl_area_pad*2;
	
	$("#time_slider").L(ctrl_area_pad + font_size * 0.6);
	$("#time_slider").T(ctrl_area_pad + font_size * 0.3);
	$("#time_slider").W(avail_W - font_size * 1.2);
	$("#time_slider").H(font_size * 0.6);
	
	$("#options_form").L(ctrl_area_pad);
	$("#options_form").T(ctrl_area_pad * 2 + font_size * 1.5);
	$("#options_form").W(avail_W);
}

//----- Events -----//

function ctrl_area_init(){
	update_ctrl_area_layout();
	time_slider_init();
	options_form_init();
}

function ctrl_area_on_layout_change(){
	update_ctrl_area_layout();
}

////////// OTHER THINGS ABOUT CONTROL AREA /////////////////////////////////////

//----- Slider -----//

function time_slider_init(){
	$("#time_slider").slider({min:0, max:1, step:0.005, values:[t_start,t_end]});
	$("#time_slider").on("slide", ctrl_on_t_change);
}

function ctrl_on_t_change(){
	var t1 = $("#time_slider").slider("values", 0);
	var t2 = $("#time_slider").slider("values", 1);
	t_start = Math.min(t1, t2);
	t_end   = Math.max(t1, t2);
	disp_on_t_change();
}

//----- Options Form -----//

function options_form_init(){
	$("#motion_select").change(ctrl_on_motion_change);
	$("#mode_select").change(ctrl_on_mode_change);
}

function ctrl_on_motion_change(){
	motion_id = parseInt( $("#motion_select").val() );
	disp_on_motion_change();
}

function ctrl_on_mode_change(){
	mode_id = parseInt( $("#mode_select").val() );
	disp_on_mode_change();
}


