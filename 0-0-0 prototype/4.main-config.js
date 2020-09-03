/*******************************************************************************

  ~ Configure Document ~

  This script is the central hub which:
  - calls appropriate functions when an event is triggered
  - sets up a time loop for animation
  - initializes all components when the document is loaded

*******************************************************************************/

//----- Event Triggers -----//

function trigger_on_load(){
	layout_init();
	menu_init();
	input_UI_init();
	output_display_init();
}

function trigger_on_enter_frame(dt){
	// dt = time passed since last frame (in seconds)
	input_UI_on_enter_frame(dt);
	main_algorithm_on_enter_frame(dt);
	output_display_on_enter_frame(dt);
	
	// Log for debug
	// $("#log").scrollTop($("#log")[0].scrollHeight);
	// $("#log").css("font-size", font_size*doc_scale/2.0 + "px");
}

function trigger_on_layout_change(){
	menu_on_layout_change();
	input_UI_on_layout_change();
	output_display_on_layout_change();
}

//----- Configure Main Time Loop -----//

var time_prev = null;
var time_now = null;

function next_frame(timestamp){
	if(!time_now){
		time_now = timestamp;
		requestAnimationFrame(next_frame);
	}else{
		time_prev = time_now;
		time_now = timestamp;
		dt = (time_now - time_prev) / 1000.0;
		trigger_on_enter_frame(dt);
		requestAnimationFrame(next_frame);
	}
}

//----- Power On -----//

$(document).ready(function(){
	trigger_on_load();
	requestAnimationFrame(next_frame);
});
