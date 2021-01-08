/*******************************************************************************

  ~ Main Algorithm ~

  This script processes the data received from the control area.

*******************************************************************************/

////////// MAIN EVENTS /////////////////////////////////////////////////////////

function main_algorithm_init(){
	init_state_variables();
}

function main_algorithm_on_enter_frame(dt){
	move_particles(dt);
}

////////// METHODS /////////////////////////////////////////////////////////////

//----- Internal methods -----//

function init_state_variables(){
	p_sx = p_sx_max / 2;
	p_sy = p_sy_max / 2;
	p_vx = 0;
	p_vy = 0;
	f_x = 0;
	f_y = 0;
	p_mass = 2.0;
}

function move_particles(dt){
	if(is_playing){
		// move
		p_sx += p_vx * dt;
		p_sy += p_vy * dt;
		p_vx += f_x / p_mass * dt;
		p_vy += f_y / p_mass * dt;
		
		// periodic boundary
		while( p_sx > p_sx_max ) { p_sx -= p_sx_range; }
		while( p_sx < p_sx_min ) { p_sx += p_sx_range; }
		while( p_sy > p_sy_max ) { p_sy -= p_sy_range; }
		while( p_sy < p_sy_min ) { p_sy += p_sy_range; }
	}
}

//----- External methods -----//

function reset_state_variables(){
	p_sx = p_sx_max / 2;
	p_sy = p_sy_max / 2;
	p_vx = 0;
	p_vy = 0;
	f_x = 0;
	f_y = 0;
}
