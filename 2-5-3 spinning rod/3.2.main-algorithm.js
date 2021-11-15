/*******************************************************************************

  ~ Main Algorithm ~

  This script processes the data received from the control area.

*******************************************************************************/

////////// MAIN EVENTS /////////////////////////////////////////////////////////

function main_algorithm_init(){
	init_rod();
}

function main_algorithm_on_enter_frame(dt){
	move_rod(dt);
	update_forces();
}

////////// METHODS /////////////////////////////////////////////////////////////

//----- Rod Motion -----//

function init_rod(){
	ang_s = 0;
	ang_v = 0;
	ang_a = 0;
}

function move_rod(dt){
	ang_v += ang_a * dt * play_speed;
	ang_s += ang_v * dt * play_speed;
	
	while(ang_s < 0) ang_s += Math.PI*2.0;
	while(ang_s >= Math.PI*2.0) ang_s -= Math.PI*2.0;
}

function update_forces(){
	// Effect of external force
	var torque = rE * FE * Math.sin(tE);
	ang_a = torque / I;
	
	// Unit vectors in polar coordinates
	u_r_x = Math.cos(ang_s);
	u_r_y = Math.sin(ang_s);
	u_t_x = -Math.sin(ang_s);
	u_t_y = Math.cos(ang_s);
	
	// Motion of C.M.
	CM_s_x = CM_r * u_r_x;
	CM_s_y = CM_r * u_r_y;
	CM_v_x = CM_r * ang_v * u_t_x;
	CM_v_y = CM_r * ang_v * u_t_y;
	CM_a_x = CM_r * ang_a * u_t_x - CM_r * ang_v * ang_v * u_r_x;
	CM_a_y = CM_r * ang_a * u_t_y - CM_r * ang_v * ang_v * u_r_y;
	
	// External force
	rE_x = rE * Math.cos(ang_s);
	rE_y = rE * Math.sin(ang_s);
	FE_x = FE * Math.cos(ang_s + tE);
	FE_y = FE * Math.sin(ang_s + tE);
	
	// Force by pivot
	var F_N_x = CM_a_x / m;
	var F_N_y = CM_a_y / m;
	FP_x = F_N_x - FE_x;
	FP_y = F_N_y - FE_y;
}



