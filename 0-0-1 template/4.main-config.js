/*******************************************************************************

  ~ Configure Document ~

  This script is the central hub which:
  - calls appropriate functions when an event is triggered
  - sets up a time loop for animation
  - initializes all components when the document is loaded

*******************************************************************************/

//----- Event Triggers -----//

function trigger_on_load(){
	main_layout_init();
	menu_init();
	ctrl_area_init();
	disp_area_init();
}

function trigger_on_enter_frame(dt){
	// dt = time passed since last frame (in seconds)
	ctrl_area_on_enter_frame(dt);
	main_algorithm_on_enter_frame(dt);
	disp_area_on_enter_frame(dt);
}

function trigger_on_layout_change(){
	menu_on_layout_change();
	ctrl_area_on_layout_change();
	disp_area_on_layout_change();
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
		var dt = (time_now - time_prev) / 1000.0;
		trigger_on_enter_frame(dt);
		requestAnimationFrame(next_frame);
	}
}

//----- Power On -----//

$(document).ready(function(){
	trigger_on_load();
	requestAnimationFrame(next_frame);
});
