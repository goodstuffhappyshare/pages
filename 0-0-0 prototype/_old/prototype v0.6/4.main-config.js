/*******************************************************************************

  ~ Configure Document ~

  This script is the central hub which:
  - calls appropriate functions when an event is triggered
  - sets up a time loop for animation
  - initializes all components when the document is loaded

*******************************************************************************/

//----- Event Triggers -----//

function main_on_load(){
	// call these functions when document is loaded
	layout_init();
	menu_init();
	input_UI_init();
	output_display_init();
}

function main_on_enter_frame(dt){
	// call these functions in every new frame
	// dt = time passed since last frame (in seconds)
	input_UI_on_enter_frame(dt);
	main_algorithm_on_enter_frame(dt);
	output_display_on_enter_frame(dt);
}

function main_on_layout_change(){
	// call these functions when the layout is changed
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
		main_on_enter_frame(dt);
		requestAnimationFrame(next_frame);
	}
}

//----- Power On -----//

$(document).ready(function(){
	main_on_load();
	requestAnimationFrame(next_frame);
});
