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
   time, kg for mass, N for force, radian for angle. The origin of the
   coordinate system is at the pivot, and the x- and y- axes respectively
   point right and up.                                                        */

//----- Fixed Values -----//

var m = 1.0; // mass of rod
var rod_length = 1.0;
var I = 1.0 / 3.0 * m * rod_length * rod_length; // moment of inertia about pivot
var CM_r = 0.5 // distance of C.M. from pivot

//----- Inputs and Initial Values -----//

var FE = 0.0; // applied force
var FE_max = 2.0;

var rE = 1.0; // distance of point of action from pivot
var rE_min = 0.0;
var rE_max = 1.0;

var tE = Math.PI / 2.0; // angle of applied force
var tE_min = 0;
var tE_max = Math.PI;

//----- Motion-Related Values -----//

var ang_s, ang_v, ang_a; // angular motion

var u_r_x, u_r_y; // unit vectors in polar coordinates
var u_t_x, u_t_y;

var CM_s_x, CM_s_y; // motion of C.M. in Cartesian coordinates
var CM_v_x, CM_v_y;
var CM_a_x, CM_a_y;

//----- Force-Related Values -----//

var rE_x, rE_y; // position of point of action
var FE_x, FE_y; // components of external force
var FP_x, FP_y; // components of force by pivot

//----- Display Options -----//

var show_LOA = true;
var show_rE = true;
var show_FP = false;
var show_ang_v = false;
var show_ang_a = false;
var show_CM_v = false;
var show_CM_a = false;

//----- Others -----//

var play_speed = 1.0;





