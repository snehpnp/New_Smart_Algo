

// (function($) {
//     /* "use strict" */

//  var dzChartlist = function(){

// 	var screenWidth = $(window).width();
// 	var NewCustomers = function(){
// 		var options = {
// 		  series: [
// 			{
// 				name: 'Net Profit',
// 				data: [70, 150, 100, 200, 100, 150, 150],
// 				/* radius: 30,	 */
// 			},
// 		],
// 		chart: {
// 			type: 'area',
// 			height: 100,
// 			width: 156,
// 			toolbar: {
// 				show: false,
// 			},
// 			zoom: {
// 				enabled: false
// 			},
// 			sparkline: {
// 				enabled: true
// 			}

// 		},

// 		colors:['#16B455'],
// 		 //fillOpacity: 0.2,

// 		dataLabels: {
// 		  enabled: false,
// 		},

// 		legend: {
// 			show: false,
// 		},
// 		stroke: {
// 		  show: true,
// 		  width: 4,
// 		  curve:'smooth',
// 		  colors:['#16B455'],
// 		},





// 	/* 	grid: {
// 			show:false,
// 			borderColor: '#eee',
// 			padding: {
// 				top: 0,
// 				right: 0,
// 				bottom: 0,
// 				left: 0

// 			}
// 		}, */
// 		 states: {
//                 normal: {
//                     filter: {
//                         type: 'none',
//                         value: 0
//                     }
//                 },
//                 hover: {
//                     filter: {
//                         type: 'none',
//                         value: 0
//                     }
//                 },
//                 active: {
//                     allowMultipleDataPointsSelection: false,
//                     filter: {
//                         type: 'none',
//                         value: 0
//                     }
//                 }
//             },
// 		xaxis: {
// 			categories: ['Jan', 'feb', 'Mar', 'Apr', 'May'],
// 			axisBorder: {
// 				show: false,
// 			},
// 			axisTicks: {
// 				show: false
// 			},
// 			labels: {
// 				show: false,
// 				style: {
// 					fontSize: '12px',
// 				}
// 			},
// 			crosshairs: {
// 				show: false,
// 				position: 'front',
// 				stroke: {
// 					width: 1,
// 					dashArray: 3
// 				}
// 			},
// 			tooltip: {
// 				enabled: true,
// 				formatter: undefined,
// 				offsetY: 0,
// 				style: {
// 					fontSize: '12px',
// 				}
// 			}
// 		},
// 		yaxis: {
// 			show: false,
// 		},
// 		fill: {
// 			type:'solid',
// 		  opacity: 0.1,
// 		  colors:'#16B455'
// 		},
// 		tooltip: {
// 			enabled:false,
// 			style: {
// 				fontSize: '12px',
// 			},
// 			y: {
// 				formatter: function(val) {
// 					return "$" + val + " thousands"
// 				}
// 			}
// 		},
// 		responsive:[
// 			{
// 				breakpoint: 1601,
// 				options:{
// 					chart: {
// 						height:80,
// 					},

// 				}
// 			}
// 		]
// 		};

// 		// var chartBar1 = new ApexCharts(document.querySelector("#NewCustomers"), options);
// 		// chartBar1.render();

// 	}

// 	var reservationChart = function(){
// 		var options = {
// 		 series: [{
// 		 name: 'series1',
// 		 data: [400, 400, 650, 500, 900, 750, 850]
// 	   }, {
// 		 name: 'series2',
// 		 data: [350, 350, 420, 370, 500, 400, 550]
// 	   }],
// 		 chart: {
// 		 height: 300,
// 		 type: 'area',
// 		 toolbar:{
// 			 show:false
// 		 }
// 	   },
// 	   colors:["var(--primary)","#ff9d43"],
// 	   dataLabels: {
// 		 enabled: false
// 	   },
// 	   stroke: {
// 		   width:6,
// 		   curve: 'smooth',
// 	   },
// 	   legend:{
// 		   show:false
// 	   },
// 	   grid:{
// 		   borderColor: '#EBEBEB',
// 		   strokeDashArray: 6,
// 	   },
// 	   markers:{
// 		   strokeWidth: 6,
// 			hover: {
// 			 size: 15,
// 		   }
// 	   },
// 	   yaxis: {
// 		 labels: {
// 		   offsetX:-12,
// 		   style: {
// 			   colors: '#787878',
// 			   fontSize: '13px',
// 			   fontFamily: 'Poppins',
// 			   fontWeight: 400

// 		   }
// 		 },
// 	   },
// 	   xaxis: {
// 		 categories: ["SUN","MON","TUE","WED","THU","FRI","SAT"],
// 		 labels:{
// 			 style: {
// 			   colors: '#787878',
// 			   fontSize: '13px',
// 			   fontFamily: 'Poppins',
// 			   fontWeight: 400

// 		   },
// 		 }
// 	   },
// 	   fill:{
// 		colors:["var(--rgba-primary-1)","#ff9d43"],
// 		   type:"solid",
// 		   opacity:0.1
// 	   },
// 	   tooltip: {
// 		 x: {
// 		   format: 'dd/MM/yy HH:mm'
// 		 },
// 	   },
// 	   };

// 	   var chart = new ApexCharts(document.querySelector("#reservationChart"), options);
// 	   chart.render();

//    }
//    var reservationChart1 = function(){
// 	var options = {
// 	 series: [{
// 	 name: 'series1',
// 	 data: [400, 400, 650, 500, 900, 750, 850]
//    }, {
// 	 name: 'series2',
// 	 data: [350, 350, 420, 370, 500, 400, 550]
//    }],
// 	 chart: {
// 	 height: 300,
// 	 type: 'area',
// 	 toolbar:{
// 		 show:false
// 	 }
//    },
//    colors:["var(--primary)","#ff9d43"],
//    dataLabels: {
// 	 enabled: false
//    },
//    stroke: {
// 	   width:6,
// 	   curve: 'smooth',
//    },
//    legend:{
// 	   show:false
//    },
//    grid:{
// 	   borderColor: '#EBEBEB',
// 	   strokeDashArray: 6,
//    },
//    markers:{
// 	   strokeWidth: 6,
// 		hover: {
// 		 size: 15,
// 	   }
//    },
//    yaxis: {
// 	 labels: {
// 	   offsetX:-12,
// 	   style: {
// 		   colors: '#787878',
// 		   fontSize: '13px',
// 		   fontFamily: 'Poppins',
// 		   fontWeight: 400

// 	   }
// 	 },
//    },
//    xaxis: {
// 	 categories: ["SUN","MON","TUE","WED","THU","FRI","SAT"],
// 	 labels:{
// 		 style: {
// 		   colors: '#787878',
// 		   fontSize: '13px',
// 		   fontFamily: 'Poppins',
// 		   fontWeight: 400

// 	   },
// 	 }
//    },
//    fill:{
// 	colors:["var(--rgba-primary-1)","#ff9d43"],
// 	   type:"solid",
// 	   opacity:0.1
//    },
//    tooltip: {
// 	 x: {
// 	   format: 'dd/MM/yy HH:mm'
// 	 },
//    },
//    };

//    var chart = new ApexCharts(document.querySelector("#reservationChart1"), options);
//    chart.render();

// }
// var reservationChart2 = function(){
// 	var options = {
// 	 series: [{
// 	 name: 'series1',
// 	 data: [400, 400, 650, 500, 900, 750, 850]
//    }, {
// 	 name: 'series2',
// 	 data: [350, 350, 420, 370, 500, 400, 550]
//    }],
// 	 chart: {
// 	 height: 300,
// 	 type: 'area',
// 	 toolbar:{
// 		 show:false
// 	 }
//    },
//    colors:["var(--primary)","#ff9d43"],
//    dataLabels: {
// 	 enabled: false
//    },
//    stroke: {
// 	   width:6,
// 	   curve: 'smooth',
//    },
//    legend:{
// 	   show:false
//    },
//    grid:{
// 	   borderColor: '#EBEBEB',
// 	   strokeDashArray: 6,
//    },
//    markers:{
// 	   strokeWidth: 6,
// 		hover: {
// 		 size: 15,
// 	   }
//    },
//    yaxis: {
// 	 labels: {
// 	   offsetX:-12,
// 	   style: {
// 		   colors: '#787878',
// 		   fontSize: '13px',
// 		   fontFamily: 'Poppins',
// 		   fontWeight: 400

// 	   }
// 	 },
//    },
//    xaxis: {
// 	 categories: ["SUN","MON","TUE","WED","THU","FRI","SAT"],
// 	 labels:{
// 		 style: {
// 		   colors: '#787878',
// 		   fontSize: '13px',
// 		   fontFamily: 'Poppins',
// 		   fontWeight: 400

// 	   },
// 	 }
//    },
//    fill:{
// 	colors:["var(--rgba-primary-1)","#ff9d43"],
// 	   type:"solid",
// 	   opacity:0.1
//    },
//    tooltip: {
// 	 x: {
// 	   format: 'dd/MM/yy HH:mm'
// 	 },
//    },
//    };

//    var chart = new ApexCharts(document.querySelector("#reservationChart2"), options);
//    chart.render();

// }
// 	var pieChart1 = function(){
// 		 var options = {
//           series: [45, 80],
//           chart: {
//           type: 'donut',
// 		  height:250,
//         },
// 		dataLabels:{
// 			enabled: false
// 		},
// 		stroke: {
//           width:0,
//         },
// 		colors:['#717579','var(--primary)'],
// 		legend: {
//               position: 'bottom',
// 			  show:false
//             },
//         responsive: [{
// 			  breakpoint: 1601,
// 			  options: {
// 			   chart: {
// 				  height:200,
// 				},
// 			  }
// 		},
// 		{
// 			  breakpoint: 1024,
// 			  options: {
// 			   chart: {
// 				  height:200,
// 				},
// 			  }
// 		}]
//         };

//         // var chart = new ApexCharts(document.querySelector("#pieChart1"), options);
//         // chart.render();

// 	}

// 	var lineChart1 = function(){
// 	 var options = {
//           series: [
//           {
//             name: 'Actual',
//             data: [
//               {
//                 x: '2011',
//                 y: 1000,
//                 goals: [
//                   {
//                     name: 'Expected',
//                     value: 1000,
//                     strokeWidth: 5,
//                     strokeColor: '#775DD0'
//                   }
//                 ]
//               },
//               {
//                 x: '2012',
//                 y: 1000,
//                 goals: [
//                   {
//                     name: 'Expected',
//                     value: 1000,
//                     strokeWidth: 5,
//                     strokeColor: '#775DD0'
//                   }
//                 ]
//               },
//               {
//                 x: '2013',
//                 y: 1000,
//                 goals: [
//                   {
//                     name: 'Expected',
//                     value: 1000,
//                     strokeWidth: 5,
//                     strokeColor: '#775DD0'
//                   }
//                 ]
//               },
//             ]
//           }
//         ],
//           chart: {
//           height: 350,
//           type: 'bar'
//         },
//         plotOptions: {
//           bar: {
//             columnWidth: '60%'
//           }
//         },
//         colors: ['#00E396'],
//         dataLabels: {
//           enabled: false
//         },
//         legend: {
//           show: true,
//           showForSingleSeries: true,
//           customLegendItems: ['Actual', 'Expected'],
//           markers: {
//             fillColors: ['#00E396', '#775DD0']
//           }
//         }
//         };

//         var chart = new ApexCharts(document.querySelector("#lineChart1"), options);
//         chart.render();
// 	}

// 	var columnChart = function(){
// 		var options = {
// 			series: [{
// 				name: '',
// 				data: [44, 55, 41, 50 , 45]
// 			}, {
// 				name: '',
// 				data: [13, 23, 20 , 15 , 25]
// 			}],
// 			chart: {
// 				type: 'bar',
// 				height: 350,
// 				stacked: true,
// 				toolbar: {
// 					show: false,
// 				}
// 			},

// 			plotOptions: {
// 				bar: {
// 					columnWidth: '45%',
// 					borderRadius: 8,
// 				},

// 			},
// 			colors:['#717579' ,'var(--primary)'],
// 			stroke: {
// 				width: [6],
// 				colors: ['#fff'],
// 				curve: 'curve'
// 			},
// 			xaxis: {
// 				show: true,

// 				axisBorder: {
// 					show: false,
// 				},
// 				axisTicks: {
// 					show: false,
// 				},

// 				labels: {
// 					style: {
// 						colors: '#333',
// 						fontSize: '13px',
// 						fontFamily: 'Poppins',
// 						fontWeight: 300,
// 						cssClass: 'apexcharts-xaxis-label',
// 					},
// 				},
// 				crosshairs: {
// 					show: false,
// 				},

// 				categories: ['week 1', 'week 2', 'week 3'],
// 			},
// 			yaxis: {
// 				show: true,
// 				axisBorder: {
// 					show: false,
// 				},

// 				labels: {
// 					offsetX:-8,
// 					style: {
// 						colors: '#333',
// 						fontSize: '13px',
// 						fontFamily: 'Poppins',
// 						fontWeight: 300,
// 						cssClass: 'apexcharts-yaxis-label',
// 					},
// 				},
// 				crosshairs: {
// 					show: false,
// 				},

// 			},

// 			grid: {
// 				borderColor:'#eee'
// 			},
// 			toolbar: {
// 				enabled: false,
// 			},
// 			dataLabels: {
// 			  enabled: false
// 			},
// 			legend: {
// 				show: false,
// 				position: 'bottom',
// 				offsetY: 0
// 			},
// 			fill: {
// 				opacity: 1
// 			},
// 			responsive: [{
// 				breakpoint: 1600,
// 				options: {
// 					chart: {
// 						height: 300,
// 					},
// 					plotOptions: {
// 						bar: {
// 							columnWidth: '75%',

// 						},
// 					},
// 				},

// 			},
// 			{
// 				breakpoint: 1600,
// 				options: {
// 					chart: {
// 						height: 300,
// 					},
// 					plotOptions: {
// 						bar: {
// 							columnWidth: '75%',

// 						},
// 					},
// 				},

// 			},],

// 		};

// 		// var chart = new ApexCharts(document.querySelector("#columnChart"), options);
// 		// chart.render();
// 	}
// 	/* Function ============ */
// 		return {
// 			init:function(){
// 			},


// 			load:function(){
// 				NewCustomers();
// 				pieChart1();
// 				columnChart();
// 				reservationChart();
// 				reservationChart1();
// 				reservationChart2();
// 			},

// 			resize:function(){
// 			}
// 		}

// 	}();



// 	jQuery(window).on('load',function(){
// 		setTimeout(function(){
// 			dzChartlist.load();
// 		}, 2000);

// 	});




// })(jQuery);