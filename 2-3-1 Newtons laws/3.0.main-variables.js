/*******************************************************************************

  ~ Main Variables ~

  The main program starts here.
  This script defines variables that will be shared among the next 3 files
  which describe:
  - Control Area   (input)
  - Main Algorithm (process)
  - Display Area   (output)

*******************************************************************************/

// Dimensions

/* I call this "internal coordinates" which is independent of the screen
   layout. All kinematics calculations are performed under this coordinate
   system. The input and output interface will provide conversion functions
   between "internal coordinates" and "document coordinates".                 */

var f_x_min = -750;
var f_x_max = 750;
var f_y_min = -750;
var f_y_max = 750;

var f_x_range = f_x_max - f_x_min;
var f_y_range = f_y_max - f_y_min;

var p_sx_min = 0;
var p_sx_max = 400;
var p_sy_min = 0;
var p_sy_max = 400;

var p_sx_range = p_sx_max - p_sx_min;
var p_sy_range = p_sy_max - p_sy_min;

var p_mass_min = 1.0;
var p_mass_max = 5.0;
var p_mass_step = 1.0;

// State variables

var p_sx;
var p_sy;
var p_vx;
var p_vy;
var f_x;
var f_y;
var p_mass;

// Others

var is_playing = true;
