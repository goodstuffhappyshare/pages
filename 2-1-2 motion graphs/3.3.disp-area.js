/*******************************************************************************

  ~ Display Area Layout ~

  This script sets up the display area for showing the processing results.

*******************************************************************************/

////////// DISPLAY AREA LAYOUT /////////////////////////////////////////////////

//----- Values -----//

var disp_area_pad = 15;
var graph_H = 300;
var graph_W;
var graph_W_min = 300;

var s_graph_caption_L, s_graph_caption_T, s_graph_caption_W, s_graph_caption_H;
var v_graph_caption_L, v_graph_caption_T, v_graph_caption_W, v_graph_caption_H;
var a_graph_caption_L, a_graph_caption_T, a_graph_caption_W, a_graph_caption_H;

var s_graph_L, s_graph_T;
var v_graph_L, v_graph_T;
var a_graph_L, a_graph_T;

//----- Methods -----//

function read_caption_size(){
	/* Read the height of the graph captions; width is set to 100%.           */
	
	$("#s_slope_caption").L(0);
	$("#s_slope_caption").auto_size();
	$("#v_slope_caption").L(0);
	$("#v_slope_caption").auto_size();
	$("#v_area_caption").L(0);
	$("#v_area_caption").auto_size();
	$("#a_area_caption").L(0);
	$("#a_area_caption").auto_size();
	
	s_graph_caption_W = disp_area_W;
	s_graph_caption_H = $("#s_slope_caption").H();
	v_graph_caption_W = disp_area_W;
	v_graph_caption_H = $("#v_slope_caption").H();
	a_graph_caption_W = disp_area_W;
	a_graph_caption_H = $("#a_area_caption").H();
	
	$("#s_slope_caption").W(s_graph_caption_W);
	$("#s_slope_caption").H(s_graph_caption_H);
	$("#v_slope_caption").W(v_graph_caption_W);
	$("#v_slope_caption").H(v_graph_caption_H);
	$("#v_area_caption").W(v_graph_caption_W);
	$("#v_area_caption").H(v_graph_caption_H);
	$("#a_area_caption").W(a_graph_caption_W);
	$("#a_area_caption").H(a_graph_caption_H);
}

function calc_disp_area_sizes(){
	// (Right side of graph has 1.5 padding)
	var avail_W = disp_area_W - disp_area_pad * 2.5;
	graph_W = Math.max(avail_W, graph_W_min);
	
	s_graph_caption_L = (avail_W - s_graph_caption_W) / 2.0 + disp_area_pad;
	s_graph_caption_T = disp_area_pad;
	s_graph_L = disp_area_pad;
	s_graph_T = s_graph_caption_T + s_graph_caption_H;
	
	v_graph_caption_L = (avail_W - v_graph_caption_W) / 2.0 + disp_area_pad;
	v_graph_caption_T = s_graph_T + graph_H + disp_area_pad;
	v_graph_L = disp_area_pad;
	v_graph_T = v_graph_caption_T + v_graph_caption_H;
	
	a_graph_caption_L = (avail_W - a_graph_caption_W) / 2.0 + disp_area_pad;
	a_graph_caption_T = v_graph_T + graph_H + disp_area_pad;
	a_graph_L = disp_area_pad;
	a_graph_T = a_graph_caption_T + a_graph_caption_H;
}

function resize_disp_area_components(){
	$("#s_slope_caption").L(s_graph_caption_L);
	$("#s_slope_caption").T(s_graph_caption_T);
	$("#s_slope_caption").W(s_graph_caption_W);
	$("#s_slope_caption").H(s_graph_caption_H);
	
	$("#s_graph").L(s_graph_L);
	$("#s_graph").T(s_graph_T);
	$("#s_graph").W(graph_W);
	$("#s_graph").H(graph_H);
	
	$("#v_slope_caption").L(v_graph_caption_L);
	$("#v_slope_caption").T(v_graph_caption_T);
	$("#v_slope_caption").W(v_graph_caption_W);
	$("#v_slope_caption").H(v_graph_caption_H);
	$("#v_area_caption").L(v_graph_caption_L);
	$("#v_area_caption").T(v_graph_caption_T);
	$("#v_area_caption").W(v_graph_caption_W);
	$("#v_area_caption").H(v_graph_caption_H);
	
	$("#v_graph").L(v_graph_L);
	$("#v_graph").T(v_graph_T);
	$("#v_graph").W(graph_W);
	$("#v_graph").H(graph_H);
	
	$("#a_area_caption").L(a_graph_caption_L);
	$("#a_area_caption").T(a_graph_caption_T);
	$("#a_area_caption").W(a_graph_caption_W);
	$("#a_area_caption").H(a_graph_caption_H);
	
	$("#a_graph").L(a_graph_L);
	$("#a_graph").T(a_graph_T);
	$("#a_graph").W(graph_W);
	$("#a_graph").H(graph_H);
}

function update_disp_area_layout(){
	$("#disp_area *").font_H(font_size * 0.75);
	$("#disp_area sup").font_H(font_size * 0.525);
	read_caption_size();
	calc_disp_area_sizes();
	resize_disp_area_components();
}

//----- Events -----//

function disp_area_init(){
	update_disp_area_layout();
	graphs_init();
}

function disp_area_on_layout_change(){
	update_disp_area_layout();
	graphs_on_layout_change();
}

////////// PLOTTING GRAPHS /////////////////////////////////////////////////////

//----- Fixed Values -----//

var label_pad_W = 12;
var label_pad_H = 3;
var tick_L = 12;

var axes_arrow_head_L = 10;
var axes_stroke_W = 4;

var plot_step_W = 4;
var curve_stroke_W = 4;

var slope_line_stroke_W = 4;

var end_points_R = 6;
var end_points_stroke_W = 4;
var dydx_arrow_head_L = 10;
var dydx_arrow_sroke_W = 4;
var dx_line_dasharray_L = 12;

//----- Temporary values shared between plotting functions -----//

// Identifiers of the axis labels

var axis_label_x;
var axis_label_y;

// Coordinate conversion

var x_to_graph;
var y_to_graph;

// Boundaries of the graph

var x_min, x_max, x_range;
var y_min, y_max, y_range;

var graph_X_min, graph_X_max, graph_X_range;
var graph_Y_min, graph_Y_max, graph_Y_range;

// Position of origin

var origin_X;
var origin_Y;

// Positions of the two indicated points

var x1, x2, y1, y2;
var X1, X2, Y1, Y2;

//----- External Methods -----//

function create_graph(graph_svg, graph_data){
	init_graph_svg(graph_svg, graph_data);
	update_graph(graph_svg, graph_data)
}

function update_graph(graph_svg, graph_data){
	graph_svg.W(graph_W);
	graph_svg.H(graph_H);
	
	calc_graph_dimensions(graph_svg, graph_data);
	redraw_axes(graph_svg, graph_data);
	redraw_curve(graph_svg, graph_data);
}

function update_marks(){
	if(mode_id == 0){
		// Slope of s-t graph
		
		calc_graph_dimensions(s_graph_svg, s_graph_data[motion_id]);
		show_slope           (s_graph_svg, s_graph_data[motion_id], v_graph_data[motion_id].fn(x1));
		hide_area            (s_graph_svg, s_graph_data[motion_id]);
		hide_change          (s_graph_svg);
		hide_average         (s_graph_svg);
		
		calc_graph_dimensions(v_graph_svg, v_graph_data[motion_id]);
		hide_slope           (v_graph_svg, v_graph_data[motion_id]);
		hide_area            (v_graph_svg, v_graph_data[motion_id]);
		hide_change          (v_graph_svg);
		show_average         (v_graph_svg, v_graph_data[motion_id], (x2==x1) ? v_graph_data[motion_id].fn(x1) : (s_graph_data[motion_id].fn(x2) - s_graph_data[motion_id].fn(x1))/(x2-x1));
		
		calc_graph_dimensions(a_graph_svg, a_graph_data[motion_id]);
		hide_slope           (a_graph_svg, a_graph_data[motion_id]);
		hide_area            (a_graph_svg, a_graph_data[motion_id]);
		hide_change          (a_graph_svg);
		hide_average         (a_graph_svg);
	}else if(mode_id == 1){
		// Area under v-t graph
		
		calc_graph_dimensions(s_graph_svg, s_graph_data[motion_id]);
		hide_slope           (s_graph_svg, s_graph_data[motion_id]);
		hide_area            (s_graph_svg, s_graph_data[motion_id]);
		show_change          (s_graph_svg, s_graph_data[motion_id]);
		hide_average         (s_graph_svg);
		
		calc_graph_dimensions(v_graph_svg, v_graph_data[motion_id]);
		hide_slope           (v_graph_svg, v_graph_data[motion_id]);
		show_area            (v_graph_svg, v_graph_data[motion_id], s_graph_data[motion_id].fn(x2) - s_graph_data[motion_id].fn(x1) );
		hide_change          (v_graph_svg);
		hide_average         (v_graph_svg);
		
		calc_graph_dimensions(a_graph_svg, a_graph_data[motion_id]);
		hide_slope           (a_graph_svg, a_graph_data[motion_id]);
		hide_area            (a_graph_svg, a_graph_data[motion_id]);
		hide_change          (a_graph_svg);
		hide_average         (a_graph_svg);
	}else if(mode_id == 2){
		// Slope of v-t graph
		
		calc_graph_dimensions(s_graph_svg, s_graph_data[motion_id]);
		hide_slope           (s_graph_svg, s_graph_data[motion_id]);
		hide_area            (s_graph_svg, s_graph_data[motion_id]);
		hide_change          (s_graph_svg);
		hide_average         (s_graph_svg);
		
		calc_graph_dimensions(v_graph_svg, v_graph_data[motion_id]);
		show_slope           (v_graph_svg, v_graph_data[motion_id], a_graph_data[motion_id].fn(x1));
		hide_area            (v_graph_svg, v_graph_data[motion_id]);
		hide_change          (v_graph_svg);
		hide_average         (v_graph_svg);
		
		calc_graph_dimensions(a_graph_svg, a_graph_data[motion_id]);
		hide_slope           (a_graph_svg, a_graph_data[motion_id]);
		hide_area            (a_graph_svg, a_graph_data[motion_id]);
		hide_change          (a_graph_svg);
		show_average         (a_graph_svg, a_graph_data[motion_id], (x1==x2) ? a_graph_data[motion_id].fn(x1) : (v_graph_data[motion_id].fn(x2) - v_graph_data[motion_id].fn(x1))/(x2-x1));
	}else if(mode_id == 3){
		// Area under a-t graph
		calc_graph_dimensions(s_graph_svg, s_graph_data[motion_id]);
		hide_slope           (s_graph_svg, s_graph_data[motion_id]);
		hide_area            (s_graph_svg, s_graph_data[motion_id]);
		hide_change          (s_graph_svg);
		hide_average         (s_graph_svg);
		
		calc_graph_dimensions(v_graph_svg, v_graph_data[motion_id]);
		hide_slope           (v_graph_svg, v_graph_data[motion_id]);
		hide_area            (v_graph_svg, v_graph_data[motion_id]);
		show_change          (v_graph_svg, v_graph_data[motion_id]);
		hide_average         (v_graph_svg);
		
		calc_graph_dimensions(a_graph_svg, a_graph_data[motion_id]);
		hide_slope           (a_graph_svg, a_graph_data[motion_id]);
		show_area            (a_graph_svg, a_graph_data[motion_id], v_graph_data[motion_id].fn(x2) - v_graph_data[motion_id].fn(x1));
		hide_change          (a_graph_svg);
		hide_average         (a_graph_svg);
	}
}

//----- Internal Methods -----//

function init_graph_svg(graph_svg, graph_data){
	
	var i;
	
	graph_svg.clear();
	
	// Fix size of axis labels
	
	axis_label_x = "#" + graph_data.id + "_label_x";
	axis_label_y = "#" + graph_data.id + "_label_y";
	
	$(axis_label_x).L(0).T(0).auto_size();
	$(axis_label_y).L(0).T(0).auto_size();
	
	$(axis_label_x).W( $(axis_label_x).W() );
	$(axis_label_x).H( $(axis_label_x).H() );
	$(axis_label_y).W( $(axis_label_y).W() );
	$(axis_label_y).H( $(axis_label_y).H() );
	
	// Axes with ticks and labels
	
	var axes = graph_svg.group();
	
	var x_axis = axes.group();
	var x_arrow = x_axis.arrow();
	x_arrow.stroke({color: "#A6CC8C", linecap: "round", linejoin: "round"});
	x_arrow.head_L(axes_arrow_head_L);
	var x_ticks = x_axis.group();
	for(i=0; i < graph_data.x_ticks.length; i++){
		var tick = x_ticks.group();
		tick.line(0,0,0,0).stroke({color: "#A6CC8C", linecap: "round"});
		tick.plain("" + graph_data.x_ticks[i]).fill("#A6CC8C");
	}
	
	var y_axis = axes.group();
	var y_arrow = y_axis.arrow();
	y_arrow.stroke({color: "#A6CC8C", linecap: "round", linejoin: "round"});
	y_arrow.head_L(axes_arrow_head_L);
	var y_ticks = y_axis.group();
	for(i=0; i < graph_data.y_ticks.length; i++){
		var tick = y_ticks.group();
		tick.line(0,0,0,0).stroke({color: "#A6CC8C", linecap: "round"});
		tick.plain("" + graph_data.y_ticks[i]).fill("#A6CC8C");
	}
	
	// Curve
	
	var curve = graph_svg.polyline([0,0,0,0,0,0]);
	
	curve.stroke({color: "#99CCFF", linecap: "round", linejoin: "round"});
	curve.fill({opacity: 0});
	
	// Slope group
	
	var slope_group = graph_svg.group();
	
	var slope_line = slope_group.line(0,0,0,0);
	slope_line.stroke({color: "#FFCCCC", linecap: "round"});
	
	var slope_end_points = slope_group.group();
	//slope_end_points.cross().R(end_points_R);
	//slope_end_points.cross().R(end_points_R);
	//slope_end_points.stroke({color: "#FFFF99", linecap: "round"});
	slope_end_points.circle().R(end_points_R);
	slope_end_points.circle().R(end_points_R);
	slope_end_points.stroke({opacity: 0});
	slope_end_points.fill("#FFFF99");
	
	var slope_dydx = slope_group.group();
	
	var slope_dx = slope_dydx.group();
	var slope_dx_line = slope_dx.line(0,0,0,0);
	slope_dx_line.stroke({color: "#FFE57F", linecap: "round", linejoin: "round"});
	var slope_dx_text = slope_dx.text("");
	slope_dx_text.fill("#FFE57F");
	
	var slope_dy = slope_dydx.group();
	var slope_dy_arrow = slope_dy.arrow();
	slope_dy_arrow.stroke({color: "#FFE57F", linecap: "round", linejoin: "round"});
	slope_dy_arrow.head_L(dydx_arrow_head_L);
	var slope_dy_text = slope_dy.text("");
	slope_dy_text.fill("#FFE57F");
	
	// Area group
	
	/* A clipPath for this group is defined at the end of init_graph_svg().   */
	
	var area_group = graph_svg.group();
	
	var area_rect = area_group.rect(0,0);
	area_rect.stroke({opacity:0});
	area_rect.fill({color:"#FFCCCC", opacity:0.5});
	
	// Change group
	
	var change_group = graph_svg.group();
	
	var change_end_points = change_group.group();
	//change_end_points.cross().R(end_points_R);
	//change_end_points.cross().R(end_points_R);
	//change_end_points.stroke({color: "#FFFF99", linecap: "round"});
	change_end_points.circle().R(end_points_R);
	change_end_points.circle().R(end_points_R);
	change_end_points.stroke({opacity: 0});
	change_end_points.fill("#FFFF99");
	
	var change_dydx = change_group.group();
	
	var change_dx = change_dydx.group();
	var change_dx_line = change_dx.line(0,0,0,0);
	change_dx_line.stroke({color: "#FFE57F", linecap: "round", linejoin: "round"});
	
	var change_dy = change_dydx.group();
	var change_dy_arrow = change_dy.arrow();
	change_dy_arrow.stroke({color: "#FFE57F", linecap: "round", linejoin: "round"});
	change_dy_arrow.head_L(dydx_arrow_head_L);
	var change_dy_text = change_dy.text("");
	change_dy_text.fill("#FFE57F");
	
	// Average group
	
	var average_group = graph_svg.group();
	
	var average_end_points = average_group.group();
	//average_end_points.cross().R(end_points_R);
	//average_end_points.cross().R(end_points_R);
	//average_end_points.stroke({color: "#FFFF99", linecap: "round"});
	average_end_points.circle().R(end_points_R);
	average_end_points.circle().R(end_points_R);
	average_end_points.stroke({opacity: 0});
	average_end_points.fill("#FFFF99");
	
	var average_dx = average_group.group();
	var average_dx_hline = average_dx.line(0,0,0,0);
	average_dx_hline.stroke({color: "#FFE57F", linecap: "round", linejoin: "round"});
	var average_dx_vline1 = average_dx.line(0,0,0,0);
	average_dx_vline1.stroke({color: "#FFE57F", linecap: "round", linejoin: "round"});
	var average_dx_vline2 = average_dx.line(0,0,0,0);
	average_dx_vline2.stroke({color: "#FFE57F", linecap: "round", linejoin: "round"});
	var average_dx_text = average_dx.text("");
	average_dx_text.fill("#FFE57F");
	
	// Area clip
	
	/* I don't know why, but if the following two lines -
	       var change_group = graph_svg.group();
	       var average_group = graph_svg.group();
	   - are executed after clipping, they somehow make the clipping invalid.
	   The workaround for now is to do the clipping after declaring
	   change_group and average_group, but the cause for this is still to be
	   investigated...                                                        */
	
	var area_clip = area_group.clip();
	var clip_polygon = area_clip.polygon([0,0,0,0,0,0]);
	area_rect.clipWith(area_clip);
}

function calc_graph_dimensions(graph_svg, graph_data){
	
	var i;
	
	axis_label_x = "#" + graph_data.id + "_label_x";
	axis_label_y = "#" + graph_data.id + "_label_y";
	
	// Boundaries of the graph
	
	var y_ticks_label_W = 0;
	for(i=0; i < graph_data.y_ticks.length; i++){
		var tick_label_W = graph_svg.get(0).get(1).get(1).get(i).get(1).W();
		y_ticks_label_W = Math.max(y_ticks_label_W, tick_label_W);
	}
	
	graph_X_min = y_ticks_label_W + label_pad_W + tick_L / 2.0;
	graph_X_max = graph_W - $(axis_label_x).W() - label_pad_W;
	graph_X_range = graph_X_max - graph_X_min;
	
	var x_ticks_label_H = graph_svg.get(0).get(0).get(1).get(0).get(1).H();
	if(graph_data.y_range[0] == 0){
		graph_Y_min = $(axis_label_y).H() + label_pad_H;
		graph_Y_max = graph_H - x_ticks_label_H - label_pad_H - tick_L / 2.0;
		graph_Y_range = graph_Y_max - graph_Y_min;
	}else{
		graph_Y_min = $(axis_label_y).H() + label_pad_H;
		graph_Y_max = graph_H;
		graph_Y_range = graph_Y_max - graph_Y_min;
	}
	
	// Range of x and y
	
	x_min = graph_data.x_range[0];
	x_max = graph_data.x_range[1];
	x_range = x_max - x_min;
	
	y_min = graph_data.y_range[0];
	y_max = graph_data.y_range[1];
	y_range = y_max - y_min;
	
	// Conversion of coordinates
	
	x_to_graph = function(x){
		return graph_X_min + 1.0 * (x - x_min) / x_range * graph_X_range;
	}
	
	y_to_graph = function(y){
		// note that y is upward-positive while Y is downward-positive
		return graph_Y_max - 1.0 * (y - y_min) / y_range * graph_Y_range;
	}
	
	// Origin
	
	origin_X = x_to_graph(0);
	origin_Y = y_to_graph(0);
	
	// Indicated points
	
	x1 = x_min + x_range * t_start;
	x2 = x_min + x_range * t_end;
	y1 = graph_data.fn(x1);
	y2 = graph_data.fn(x2);
	
	X1 = x_to_graph(x1);
	X2 = x_to_graph(x2);
	Y1 = y_to_graph(y1);
	Y2 = y_to_graph(y2);
}

function redraw_axes(graph_svg, graph_data){
	
	var i;
	
	var axes = graph_svg.get(0);
	
	var x_axis = axes.get(0);
	x_axis.set_translation_XY(0, origin_Y);
	var x_arrow = x_axis.get(0);
	x_arrow.set_translation_XY(graph_X_min, 0);
	x_arrow.body_L(graph_X_range);
	x_arrow.stroke_W(axes_stroke_W);
	var x_ticks = x_axis.get(1);
	for(i=0; i < graph_data.x_ticks.length; i++){
		var tick = x_ticks.get(i);
		tick.set_translation_XY( x_to_graph(graph_data.x_ticks[i]), 0);
		var tick_line = tick.get(0);
		tick_line.plot_XY([0,-tick_L/2.0,0,tick_L/2.0]);
		tick_line.stroke_W(axes_stroke_W);
		var tick_label = tick.get(1);
		tick_label.CX(0);
		tick_label.T(tick_L/2.0 + label_pad_H);
	}
	$(axis_label_x).L( graph_W - $(axis_label_x).W() );
	$(axis_label_x).CY(origin_Y);
	
	var y_axis = axes.get(1);
	y_axis.set_translation_XY(origin_X, 0);
	var y_arrow = y_axis.get(0);
	y_arrow.set_translation_XY(0, graph_Y_max);
	y_arrow.set_rotation(-90);
	y_arrow.body_L(graph_Y_range);
	y_arrow.stroke_W(axes_stroke_W);
	var y_ticks = y_axis.get(1);
	for(i=0; i < graph_data.y_ticks.length; i++){
		var tick = y_ticks.get(i);
		tick.set_translation_XY( 0, y_to_graph(graph_data.y_ticks[i]) );
		var tick_line = tick.get(0);
		tick_line.plot_XY([-tick_L/2.0,0,tick_L/2.0,0]);
		tick_line.stroke_W(axes_stroke_W);
		var tick_label = tick.get(1);
		tick_label.MX( -tick_L/2.0 - label_pad_W );
		tick_label.CY(0);
	}
	$(axis_label_y).CX(origin_X);
	$(axis_label_y).T(0);
}

function redraw_curve(graph_svg, graph_data){
	
	// Curve
	
	var curve = graph_svg.get(1);
	
	var plot_step = 1.0 * plot_step_W / graph_X_range * x_range;
	var plot_data = new Array();
	for(i=x_min; i<=x_max; i+=plot_step){
		plot_data.push( x_to_graph(i) );
		plot_data.push( y_to_graph( graph_data.fn(i) ) );
	}
	
	curve.plot_XY(plot_data);
	curve.stroke_W(curve_stroke_W);
	
	// Clip polygon
	
	var area_group = graph_svg.get(3);
	var area_rect = area_group.get(0);
	var clip_polygon = area_rect.clipper().get(0);
	var clip_data = [origin_X, origin_Y].concat(plot_data);
	clip_data.push(x_to_graph(x_max));
	clip_data.push(origin_Y);
	clip_polygon.plot_XY(clip_data);
}

function hide_slope(graph_svg, graph_data){
	var slope_group = graph_svg.get(2);
	slope_group.hide();
	
	var id = graph_data.id;
	if(id=="s" || id=="v")
		$("#"+id+"_slope_caption").hide();
}

function show_slope(graph_svg, graph_data, derivative){
	
	var slope_group = graph_svg.get(2);
	
	// Straight line
	
	var slope_line = slope_group.get(0);
	
	var m = (x1 == x2) ? derivative : (y2 - y1) / (x2 - x1);
	
	var x0 = x_min;
	var x3 = x_max;
	var y0 = y1 - m*(x1-x0);
	var y3 = y1 - m*(x1-x3);
	
	var X0 = x_to_graph(x0);
	var X3 = x_to_graph(x3);
	var Y0 = y_to_graph(y0);
	var Y3 = y_to_graph(y3);
	
	slope_line.plot_XY([X0,Y0,X3,Y3]);
	slope_line.stroke_W(slope_line_stroke_W);
	
	// End points
	
	var slope_end_points = slope_group.get(1);
	
	slope_end_points.get(0).set_translation_XY( X1, Y1 );
	slope_end_points.get(1).set_translation_XY( X2, Y2 );
	slope_end_points.stroke_W(end_points_stroke_W);
	
	// Delta x and delta y
	
	var slope_dydx = slope_group.get(2);
	
	if(x1 == x2){
		slope_dydx.hide();
	}else{
		var slope_dx_line = slope_dydx.get(0).get(0);
		slope_dx_line.plot_XY([X1,Y1,X2,Y1]);
		slope_dx_line.stroke_W(dydx_arrow_sroke_W);
		var slope_dx_text = slope_dydx.get(0).get(1);
		slope_dx_text.clear();
		slope_dx_text.build(true);
		slope_dx_text.tspan("Δ");
		slope_dx_text.tspan("t").font("style","italic");
		slope_dx_text.tspan(" = " + (x2-x1).toFixed(2));
		slope_dx_text.CX( (X1+X2) / 2.0 );
		slope_dx_text.T( y2>y1 ? Y1+label_pad_H : Y1-label_pad_H-slope_dx_text.H() );
		
		var slope_dy_arrow = slope_dydx.get(1).get(0);
		slope_dy_arrow.body_L( Math.abs(Y2-Y1) );
		slope_dy_arrow.set_translation_XY( X2, Y1 );
		slope_dy_arrow.set_rotation( y2>y1 ? -90 : 90);
		slope_dy_arrow.stroke_W(dydx_arrow_sroke_W);
		var slope_dy_text = slope_dydx.get(1).get(1);
		slope_dy_text.clear();
		slope_dy_text.build(true);
		slope_dy_text.tspan("Δ");
		slope_dy_text.tspan(graph_data.id).font("style","italic");
		slope_dy_text.tspan(" = " + (y2-y1).toFixed(2));
		slope_dy_text.L(X2 + label_pad_W);
		slope_dy_text.CY( (Y1+Y2) / 2.0 );
		
		slope_dydx.show();
	}
	
	slope_group.show();
	
	// Caption
	
	var id = graph_data.id;
	$("#"+id+"_slope_value").text( m.toFixed(2) );
	if(id=="s" || id=="v")
		$("#"+id+"_slope_caption").show();
}

function hide_area(graph_svg, graph_data){
	var area_group = graph_svg.get(3);
	area_group.hide();
	
	var id = graph_data.id;
	if(id=="v" || id=="a")
		$("#"+id+"_area_caption").hide();
}

function show_area(graph_svg, graph_data, area_value){
	var area_group = graph_svg.get(3);
	
	var area_rect = area_group.get(0); // Clipper is drawn in redraw_curve()
	area_rect.L(X1);
	area_rect.W(X2-X1);
	area_rect.T(0);
	area_rect.H(graph_H);
	
	area_group.show();
	
	var id = graph_data.id;
	$("#"+id+"_area_value").text( area_value.toFixed(2) );
	if(id=="v" || id=="a")
		$("#"+id+"_area_caption").show();
}

function hide_change(graph_svg){
	var change_group = graph_svg.get(4);
	change_group.hide();
}

function show_change(graph_svg, graph_data){
	var change_group = graph_svg.get(4);
	
	// End points
	
	var change_end_points = change_group.get(0);
	change_end_points.get(0).set_translation_XY( X1, Y1 );
	change_end_points.get(1).set_translation_XY( X2, Y2 );
	change_end_points.stroke_W(end_points_stroke_W);
	
	// Delta x and delta y
	
	var change_dydx = change_group.get(1);
	
	if(x1 == x2){
		change_dydx.hide();
	}else{
		var change_dx_line = change_dydx.get(0).get(0);
		change_dx_line.plot_XY([X1,Y1,X2,Y1]);
		change_dx_line.stroke_W(dydx_arrow_sroke_W);
		change_dx_line.stroke_dasharray_L(dx_line_dasharray_L);
		
		var change_dy_arrow = change_dydx.get(1).get(0);
		change_dy_arrow.body_L( Math.abs(Y2-Y1) );
		change_dy_arrow.set_translation_XY( X2, Y1 );
		change_dy_arrow.set_rotation( y2>y1 ? -90 : 90);
		change_dy_arrow.stroke_W(dydx_arrow_sroke_W);
		var change_dy_text = change_dydx.get(1).get(1);
		change_dy_text.clear();
		change_dy_text.build(true);
		change_dy_text.tspan("Δ");
		change_dy_text.tspan(graph_data.id).font("style","italic");
		change_dy_text.tspan(" = " + (y2-y1).toFixed(2));
		change_dy_text.L(X2 + label_pad_W);
		change_dy_text.CY( (Y1+Y2) / 2.0 );
		
		change_dydx.show();
	}
	
	change_group.show();
}

function hide_average(graph_svg){
	var average_group = graph_svg.get(5);
	average_group.hide();
}

function show_average(graph_svg, graph_data, avg_value){
	var average_group = graph_svg.get(5);
	
	var Y0 = y_to_graph(avg_value);
	
	// End points
	
	var average_end_points = average_group.get(0);
	average_end_points.get(0).set_translation_XY( X1, Y0 );
	average_end_points.get(1).set_translation_XY( X2, Y0 );
	average_end_points.stroke_W(end_points_stroke_W);
	
	// Lines
	
	var average_dx_hline = average_group.get(1).get(0);
	var average_dx_vline1 = average_group.get(1).get(1);
	var average_dx_vline2 = average_group.get(1).get(2);
	
	if(x1 == x2){
		average_dx_hline.hide();
		average_dx_vline1.hide();
		average_dx_vline2.hide();
	}else{
		average_dx_hline.plot_XY([X1,Y0,X2,Y0]);
		average_dx_hline.stroke_W(dydx_arrow_sroke_W);
		average_dx_hline.show();
		
		average_dx_vline1.plot_XY([X1,Y1,X1,Y0]);
		average_dx_vline1.stroke_W(dydx_arrow_sroke_W);
		average_dx_vline1.stroke_dasharray_L(dx_line_dasharray_L);
		average_dx_vline1.show();
		
		average_dx_vline2.plot_XY([X2,Y2,X2,Y0]);
		average_dx_vline2.stroke_W(dydx_arrow_sroke_W);
		average_dx_vline2.stroke_dasharray_L(dx_line_dasharray_L);
		average_dx_vline2.show();
	}
	
	var average_dx_text = average_group.get(1).get(3);
	average_dx_text.clear();
	average_dx_text.build(true);
	average_dx_text.tspan(graph_data.id).font("style","italic")
	               .attr("text-decoration", (x1==x2) ? "none" : "overline");
	average_dx_text.tspan(" = " + avg_value.toFixed(2));
	average_dx_text.CX( (X1+X2) / 2.0 );
	average_dx_text.MY( Y0-label_pad_H );
	
	average_group.show();
}

////////// OTHER THINGS ABOUT DISPLAY AREA /////////////////////////////////////

// Events

function graphs_init(){
	s_graph_svg = SVG().addTo("#s_graph");
	v_graph_svg = SVG().addTo("#v_graph");
	a_graph_svg = SVG().addTo("#a_graph");
	
	create_graph(s_graph_svg, s_graph_data[motion_id]);
	create_graph(v_graph_svg, v_graph_data[motion_id]);
	create_graph(a_graph_svg, a_graph_data[motion_id]);
	
	update_marks();
}

function graphs_on_layout_change(){
	update_graph(s_graph_svg, s_graph_data[motion_id]);
	update_graph(v_graph_svg, v_graph_data[motion_id]);
	update_graph(a_graph_svg, a_graph_data[motion_id]);
	
	update_marks();
}

function disp_on_motion_change(){
	create_graph(s_graph_svg, s_graph_data[motion_id]);
	create_graph(v_graph_svg, v_graph_data[motion_id]);
	create_graph(a_graph_svg, a_graph_data[motion_id]);
	
	update_marks();
}

function disp_on_t_change(){
	
	update_marks();
	
}

function disp_on_mode_change(){
	update_marks();
}
