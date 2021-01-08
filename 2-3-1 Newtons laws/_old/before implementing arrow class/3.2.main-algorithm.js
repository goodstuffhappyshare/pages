/*******************************************************************************

  ~ Main Algorithm ~

  This script processes the data received from the control area.

*******************************************************************************/

function main_algorithm_on_enter_frame(dt){
	// move
	p_sx += p_vx * dt;
	p_sy += p_vy * dt;
	p_vx += f_x * dt;
	p_vy += f_y * dt;
	
	// periodic boundary
	while( p_sx > p_sx_max ) { p_sx -= p_sx_range; }
	while( p_sx < p_sx_min ) { p_sx += p_sx_range; }
	while( p_sy > p_sy_max ) { p_sy -= p_sy_range; }
	while( p_sy < p_sy_min ) { p_sy += p_sy_range; }
}
