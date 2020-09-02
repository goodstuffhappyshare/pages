/*******************************************************************************

  ~ Main Variables ~

  The main program starts here.
  This script defines variables that will be shared among the next 3 files:
  - Input UI
  - Main Algorithm
  - Output Display

*******************************************************************************/

// Dimensions

/* I call this "internal coordinates" which is independent of the screen
   layout. All kinematics calculations are performed under this coordinate
   system. The input and output interface will provide conversion functions
   between "internal coordinates" and "document coordinates".
   
   Note:
   "Internal coordinates" are indicated with suffices [_x _y _w _h] while
   "document coordinates" are indicated with suffices [_X _Y _L _T _W _H].    */

f_x_min = -300;
f_x_max = 300;
f_y_min = -300;
f_y_max = 300;

f_x_range = f_x_max - f_x_min;
f_y_range = f_y_max - f_y_min;

p_sx_min = 0;
p_sx_max = 400;
p_sy_min = 0;
p_sy_max = 400;

p_sx_range = p_sx_max - p_sx_min;
p_sy_range = p_sy_max - p_sy_min;

// State variables

p_sx = p_sx_max / 2;
p_sy = p_sy_max / 2;
p_vx = 100;
p_vy = 0;
f_x = 0;
f_y = 0;
