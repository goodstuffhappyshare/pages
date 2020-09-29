/*******************************************************************************

  ~ Main Algorithm ~

  This script processes the data received from the control area.

*******************************************************************************/

/* There really is nothing to compute for this particular demonstration.
   This file just stores data for plotting graphs.
   Note that the last value in "y_ticks" is there just to align the y-axes
   of the three graphs.                                                       */

//----- Set 0 -----//

s_graph_data.push({
	id: "s",
	fn: function(t){ return 5*t - 0.5*t*t; },
	x_range: [0,11],
	y_range: [0,14],
	x_ticks: [0,5,10],
	y_ticks: [0,5,10,-99]
});

v_graph_data.push({
	id: "v",
	fn: function(t){ return 5 - t; },
	x_range: [0,11],
	y_range: [-7,7],
	x_ticks: [5,10],
	y_ticks: [-5,0,5,-99]
});

a_graph_data.push({
	id: "a",
	fn: function(t){ return -1; },
	x_range: [0,11],
	y_range: [-1.2, 0.2],
	x_ticks: [5,10],
	y_ticks: [-1,0,-99]
});

//----- Set 1 -----//

s_graph_data.push({
	id: "s",
	fn: function(t){ return 5*t; },
	x_range: [0,11],
	y_range: [0,60],
	x_ticks: [0,5,10],
	y_ticks: [0,50,-99]
});

v_graph_data.push({
	id: "v",
	fn: function(t){ return 5; },
	x_range: [0,11],
	y_range: [0,6],
	x_ticks: [0,5,10],
	y_ticks: [0,5,-99]
});

a_graph_data.push({
	id: "a",
	fn: function(t){ return 0; },
	x_range: [0,11],
	y_range: [-1.4,1.4],
	x_ticks: [5,10],
	y_ticks: [-1,0,1,-99]
});

//----- Set 2 -----//

s_graph_data.push({
	id: "s",
	fn: function(t){ return 5 * Math.sin( Math.PI * t ); },
	x_range: [0,4.4],
	y_range: [-7,7],
	x_ticks: [2,4],
	y_ticks: [-5,0,5,-99.9]
});

v_graph_data.push({
	id: "v",
	fn: function(t){ return 5 * Math.PI * Math.cos( Math.PI * t); },
	x_range: [0,4.4],
	y_range: [-22,22],
	x_ticks: [2,4],
	y_ticks: [-15.7,0,15.7,-99.9]
});

a_graph_data.push({
	id: "a",
	fn: function(t){ return -5 * Math.PI * Math.PI * Math.sin( Math.PI * t); },
	x_range: [0,4.4],
	y_range: [-69, 69],
	x_ticks: [2,4],
	y_ticks: [-49.3,0,49.3,-99.9]
});

//----- Set 3 -----//

s_graph_data.push({
	id: "s",
	fn: function(t){
		if(t < 0) return 0;
		else if (t > 30) return 100;
		else return t*t*t*t*t * ( 1.0/40500.0) +
					t*t*t*t   * (-1.0/540.0  ) +
					t*t*t     * ( 1.0/27.0   );
	},
	x_range: [0,33],
	y_range: [0,120],
	x_ticks: [0,10,20,30],
	y_ticks: [0,50,100,500]
});

v_graph_data.push({
	id: "v",
	fn: function(t){
		if(t < 0 || t > 30) return 0;
		else return t*t*t*t * ( 1.0/8100.0) +
					t*t*t   * (-1.0/135.0 ) +
					t*t     * ( 1.0/9.0   );
	},
	x_range: [0,33],
	y_range: [0,7],
	x_ticks: [0,10,20,30],
	y_ticks: [0,2,4,6,500]
});

a_graph_data.push({
	id: "a",
	fn: function(t){
		if(t < 0 || t > 30) return 0;
		else return t*t*t * ( 1.0/2025.0) +
					t*t   * (-1.0/45.0  ) +
					t     * ( 2.0/9.0   );
	},
	x_range: [0,33],
	y_range: [-0.8,0.8],
	x_ticks: [10,20,30],
	y_ticks: [-0.5,0,0.5,500]
});

//----- Set 4 -----//

s_graph_data.push({
	id: "s",
	fn: function(t){
		if(t < 0 || t > 30) return 0;
		else return t*t*t*t * (  8.0/10125.0) +
					t*t*t   * (-32.0/675.0  ) +
					t*t     * ( 32.0/45.0   );
	},
	x_range: [0,33],
	y_range: [0,48],
	x_ticks: [0,10,20,30],
	y_ticks: [0,20,40,500]
});

v_graph_data.push({
	id: "v",
	fn: function(t){
		if(t < 0 || t > 30) return 0;
		else return t*t*t * ( 32.0/10125.0) +
					t*t   * (-32.0/225.0  ) +
					t     * ( 64.0/45.0   );
	},
	x_range: [0,33],
	y_range: [-5,5],
	x_ticks: [10,20,30],
	y_ticks: [-4,-2,0,2,4,500]
});

a_graph_data.push({
	id: "a",
	fn: function(t){
		if(t < 0 || t > 30) return 0;
		else return t*t * ( 32.0/3375.0) +
					t   * (-64.0/225.0 ) +
					1   * ( 64.0/45.0  );
	},
	x_range: [0,33],
	y_range: [-0.9,1.8],
	x_ticks: [10,20,30],
	y_ticks: [-0.5,0,0.5,1,1.5,500]
});

