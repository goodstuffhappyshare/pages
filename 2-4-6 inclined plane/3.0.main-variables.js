/*******************************************************************************

  ~ Main Variables ~

  The main program starts here.
  This script defines variables that will be shared among the next 3 files
  which describe:
  - Control Area   (input)
  - Main Algorithm (process)
  - Display Area   (output)

*******************************************************************************/

/* I am using SI units for internal calculations here. m for length, s for
   time, kg for mass, N for force, radian for angle.                          */

//----- Fixed Values -----//

var track_length = 0.8;
var track_wall_height = 0.1;
var block_width = 0.1, block_height = 0.075;
var block_s_max = track_length - block_width;

var g = 9.81;

//----- Inputs and Initial Values -----//

/* The user does not input the maximum magnitude of the friction,
   but instead the coefficient of friction, denoted by f_k.
   The maximum static friction is then N * f_k.
   Assume that kinetic friction is equal to maximum static friction.          */

var F = 0; // Applied force
var F_max = 5;

var f_k = 0.3; // Coefficient of friction
var f_k_max = 0.5;
var f_k_min = 0.0;

var theta = 0.0;
var theta_max = Math.PI / 6.0;
var theta_min = 0.0;

var m = 0.7; // Mass
var m_max = 1.0;
var m_min = 0.3;

//----- Motion-Related Values -----//

/* The x-axis points along the slope towards the right,
   the y-axis is perpendicular to the slope and points upwards.
   block_s, block_v and block_a refer to motion of the block along the x-axis.
   When the block is at the bottom of the slope, block_s = 0.
   All vector values below carry a sign (+x / -x / +y / -y) except f_max and W.
   Note that _x and _y refer to this coordinate system along the slope
   while _X and _Y refer to the coordinate system of the screen.              */

var block_s, block_v, block_a;
var f, f_max; // Friction
var N; // Normal force by the slope
var W, W_x, W_y; // Weight
var N1, N2; // Normal force by the two ends of the track

var block_is_moving;
var block_is_leftmost, block_is_rightmost;

//----- Display-Related Values -----//

var track_left = -block_width / 2.0;
var track_right = track_left + track_length;
var track_bottom = -block_height / 2.0;
var track_top = track_bottom + track_wall_height;

var N_offset; // position of N arrow

//----- Options -----//

var show_s = false;
var show_v = false;
var show_a = true;
var show_theta = false;
var show_forces_x = true;
var show_forces_y = true;

//----- Others -----//

var is_playing = true;
var play_speed = 1.0;
