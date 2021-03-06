/*******************************************************************************

  ~ Main Variables ~

  The main program starts here.
  This script defines variables that will be shared among the next 3 files
  which describe:
  - Control Area   (input)
  - Main Algorithm (process)
  - Display Area   (output)

*******************************************************************************/

var t_start = 0.0;
var t_end = 5.0/11.0;

var s_graph_svg;
var v_graph_svg;
var a_graph_svg;

var s_graph_data = new Array();
var v_graph_data = new Array();
var a_graph_data = new Array();

var motion_id = 0;
var mode_id = 0;
