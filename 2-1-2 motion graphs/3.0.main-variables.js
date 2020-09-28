/*******************************************************************************

  ~ Main Variables ~

  The main program starts here.
  This script defines variables that will be shared among the next 3 files
  which describe:
  - Control Area   (input)
  - Main Algorithm (process)
  - Display Area   (output)

*******************************************************************************/

var t_start = 0.2;
var t_end = 0.5;

var s_graph_svg;
var v_graph_svg;
var a_graph_svg;

var s_graph_data = new Array(5);
var v_graph_data = new Array(5);
var a_graph_data = new Array(5);

var motion_id = 0;
var mode_id = 0;
