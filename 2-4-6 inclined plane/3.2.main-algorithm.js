/*******************************************************************************

  ~ Main Algorithm ~

  This script processes the data received from the control area.

*******************************************************************************/

////////// MAIN EVENTS /////////////////////////////////////////////////////////

function main_algorithm_init(){
	init_block();
}

function main_algorithm_on_enter_frame(dt){
	calc_forces();
	move_block(dt);
}

////////// METHODS /////////////////////////////////////////////////////////////

//----- Block Motion -----//

function init_block(){
	block_s = block_s_max / 2.0;
	block_v = 0;
	block_a = 0;
	block_is_moving = false;
	block_is_leftmost = false;
	block_is_rightmost = false;
}

function calc_forces(){
	W = m * g;
	W_x = -W * Math.sin(theta);
	W_y = -W * Math.cos(theta);
	N = -W_y;
	f_max = f_k * Math.abs(N);
	
	if(block_is_moving){
		f = (block_v > 0) ? -f_max : f_max;
		N1 = 0;
		N2 = 0;
	}else{
		block_a = 0; // See move_block(): code for displacement
		var FN0 = W_x + F; // Sum of all forces along x other than f, N1, N2
		if(block_is_leftmost){
			if(FN0 > f_max){
				f = -f_max;
				N1 = 0;
				N2 = 0;
				if(!is_dragging_slider && play_speed!=0){
					block_is_moving = true;
					block_is_leftmost = false;
				}
			}else if(FN0 > 0){
				f = -FN0;
				N1 = 0;
				N2 = 0;
			}else{
				f = 0;
				N1 = -FN0;
				N2 = 0;
			}
		}else if(block_is_rightmost){
			if(FN0 < -f_max){
				f = f_max;
				N1 = 0;
				N2 = 0;
				if(!is_dragging_slider && play_speed!=0){
					block_is_moving = true;
					block_is_rightmost = false;
				}
			}else if(FN0 < 0){
				f = -FN0;
				N1 = 0;
				N2 = 0;
			}else{
				f = 0;
				N1 = 0;
				N2 = -FN0;
			}
		}else{
			if(FN0 > f_max){
				f = -f_max;
				if(!is_dragging_slider && play_speed!=0){
					block_is_moving = true;
				}
			}else if(FN0 < -f_max){
				f = f_max;
				if(!is_dragging_slider && play_speed!=0){
					block_is_moving = true;
				}
			}else{
				f = -FN0;
			}
			N1 = 0;
			N2 = 0;
		}
	}
	
	var f_torque = f * block_height / 2.0;
	N_offset = -f_torque / N;
}

function move_block(dt){
	
	if(!is_dragging_slider && play_speed!=0 && block_is_moving){
		
		block_a = (F + W_x + f) / m;
		
		var prev_v = block_v;
		block_v += block_a * dt * play_speed;
		if(prev_v*block_v<0){
			block_v = 0;
			block_is_moving = false;
		}
		
		block_s += block_v * dt * play_speed;
		if(block_s < 0){
			/* acceleration will be set to an extremely large value for one
			   frame (for display), then will be set to zero at the beginning
			   of the next frame in calc_forces().                            */
			block_a = (0-block_v) / dt;
			block_v = 0;
			block_s = 0;
			N1 = m*block_a - F - W_x - f;
			block_is_moving = false;
			block_is_leftmost = true;
		}else if(block_s > block_s_max){
			block_a = (0-block_v) / dt;
			block_v = 0;
			block_s = block_s_max;
			N2 = m*block_a - F - W_x - f;
			block_is_moving = false;
			block_is_rightmost = true;
		}
	}
}









