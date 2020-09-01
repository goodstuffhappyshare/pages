/*******************************************************************************

  ~ Main Variables ~

  This script defines variables that will be shared among the next 3 scripts:
  - Input UI
  - Main Algorithm
  - Output Display

*******************************************************************************/

// Dimensions

/* I call this "internal coordinates" which are independent of the screen
   size. All kinematics calculations are performed under this coordinate
   system. In contrast, the coordinates used in the input and output UI are
   what I call "display coordinates" which change with the layout dimensions.
   To distinguish between them, I use lower case [x y w h] for "internal
   coordinates" and upper case [X Y W H L T] for "display coordinates".        */

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
