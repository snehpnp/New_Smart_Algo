import React, { useState } from 'react';
import TradingViewWidget from 'react-tradingview-widget';

const CandlestickChart = () => {
  const [selectedData, setSelectedData] = useState(null);

  const handleChartReady = (widget) => {
    // Attach an event listener to handle user interactions
    widget.onSymbolChanged().subscribe(null, ({ symbol }) => {
      console.log(`Selected symbol: ${symbol}`);
    });

    // Attach an event listener to capture the selected data
    widget.onIntervalChanged().subscribe(null, ({ interval }) => {
      console.log(`Selected interval: ${interval}`);
    });

    // Attach an event listener to capture user-selected data points
    widget.onDataReady().subscribe(null, ({ data }) => {
      setSelectedData(data);
    });
  };


// console.log("selectedData" ,selectedData)

  return (
    <div  style={{ height: '50vh' }}s>
      <TradingViewWidget
        symbol="bhel"
        interval="M5"
        theme="light"
        locale="en"
        autosize
        onReady={handleChartReady}
      />
      <div>
        <h2>Selected Data:</h2>
        <pre>{JSON.stringify(selectedData, null, 2)}</pre>
      </div>
    </div>
  );
};

export default CandlestickChart;











// import React, { useState, useEffect } from 'react';
// import ReactApexChart from 'react-apexcharts';
// import axios from "axios"
// const CandlestickChart = () => {
//   const [interval, setInterval] = useState('1min');
//   const [symbol, setSymbol] = useState('AAPL');
//   const [candlestickData, setCandlestickData] = useState([]);

//   // Replace this with your data fetching logic
//   const fetchData = async (selectedInterval, selectedSymbol) => {
//     // Simulate data fetching based on the selected interval and symbol
//     // You should replace this with your actual data source
//     const data = [
//       // Replace with your candlestick data
//     ];
//     setCandlestickData(data);
//   };


//   const apiKey = '633L9M61NAVHLKNO.';
//   const apiUrl = `https://www.alphavantage.co/query?function=LISTING_STATUS&apikey='633L9M61NAVHLKNO.'`;


//   const res = axios.get(`https://www.alphavantage.co/query?function=LISTING_STATUS&apikey=${apiKey}`, {
//     //  headers: header(token),
//     data: {},
//   })

//   console.log("res", res);
//   const options = {
//     chart: {
//       type: 'candlestick',
//       height: 350,
//       events: {
//         markerClick: (event, chartContext, { seriesIndex, dataPointIndex }) => {
//           // Handle marker click event
//           const series = chartContext.w.config.series[seriesIndex];
//           const selectedPoint = series.data[dataPointIndex];

//           // Log or handle the selected data as needed
//           console.log('Selected Data:', selectedPoint);

//           // Update the state with the selected data
//           setCandlestickData(selectedPoint);

//           // setSelectedData(selectedPoint);
//         },
//       },
//     },
//     xaxis: {
//       type: 'datetime',
//     },
//     yaxis: {
//       tooltip: {
//         enabled: true,
//       },
//     },
//   };




//   const series = [
//     {
//       data: [
//         {
//           x: new Date(1538778600000),
//           y: [6629.81, 6650.5, 6623.04, 6633.33],
//         },
//         {
//           x: new Date(1538780400000),
//           y: [6632.01, 6643.59, 6620, 6630.11],
//         },
//         {
//           x: new Date(1538782200000),
//           y: [6630.71, 6648.95, 6623.34, 6635.65],
//         },
//         {
//           x: new Date(1538784000000),
//           y: [6635.65, 6651, 6629.67, 6638.24],
//         },
//         {
//           x: new Date(1538785800000),
//           y: [6638.24, 6640, 6620, 6624.47],
//         },
//         {
//           x: new Date(1538787600000),
//           y: [6624.53, 6636.03, 6621.68, 6624.31],
//         },
//         {
//           x: new Date(1538789400000),
//           y: [6624.61, 6632.2, 6617, 6626.02],
//         },
//         {
//           x: new Date(1538791200000),
//           y: [6627, 6627.62, 6584.22, 6603.02],
//         },
//         {
//           x: new Date(1538793000000),
//           y: [6605, 6608.03, 6598.95, 6604.01],
//         },
//         {
//           x: new Date(1538794800000),
//           y: [6604.5, 6614.4, 6602.26, 6608.02],
//         },
//         {
//           x: new Date(1538796600000),
//           y: [6608.02, 6610.68, 6601.99, 6608.91],
//         },
//         {
//           x: new Date(1538798400000),
//           y: [6608.91, 6618.99, 6608.01, 6612],
//         },
//         {
//           x: new Date(1538800200000),
//           y: [6612, 6615.13, 6605.09, 6612],
//         },
//         {
//           x: new Date(1538802000000),
//           y: [6612, 6624.12, 6608.43, 6622.95],
//         },
//         {
//           x: new Date(1538803800000),
//           y: [6623.91, 6623.91, 6615, 6615.67],
//         },
//         {
//           x: new Date(1538805600000),
//           y: [6618.69, 6618.74, 6610, 6610.4],
//         },
//         {
//           x: new Date(1538807400000),
//           y: [6611, 6622.78, 6610.4, 6614.9],
//         },
//         {
//           x: new Date(1538809200000),
//           y: [6614.9, 6626.2, 6613.33, 6623.45],
//         },
//         {
//           x: new Date(1538811000000),
//           y: [6623.48, 6627, 6618.38, 6620.35],
//         },
//         {
//           x: new Date(1538812800000),
//           y: [6619.43, 6620.35, 6610.05, 6615.53],
//         },
//         {
//           x: new Date(1538814600000),
//           y: [6615.53, 6617.93, 6610, 6615.19],
//         },
//         {
//           x: new Date(1538816400000),
//           y: [6615.19, 6621.6, 6608.2, 6620],
//         },
//         {
//           x: new Date(1538818200000),
//           y: [6619.54, 6625.17, 6614.15, 6620],
//         },
//         {
//           x: new Date(1538820000000),
//           y: [6620.33, 6634.15, 6617.24, 6624.61],
//         },
//         {
//           x: new Date(1538821800000),
//           y: [6625.95, 6626, 6611.66, 6617.58],
//         },
//         {
//           x: new Date(1538823600000),
//           y: [6619, 6625.97, 6595.27, 6598.86],
//         },
//         {
//           x: new Date(1538825400000),
//           y: [6598.86, 6598.88, 6570, 6587.16],
//         },
//         {
//           x: new Date(1538827200000),
//           y: [6588.86, 6600, 6580, 6593.4],
//         },
//         {
//           x: new Date(1538829000000),
//           y: [6593.99, 6598.89, 6585, 6587.81],
//         },
//         {
//           x: new Date(1538830800000),
//           y: [6587.81, 6592.73, 6567.14, 6578],
//         },
//         {
//           x: new Date(1538832600000),
//           y: [6578.35, 6581.72, 6567.39, 6579],
//         },
//         {
//           x: new Date(1538834400000),
//           y: [6579.38, 6580.92, 6566.77, 6575.96],
//         },
//         {
//           x: new Date(1538836200000),
//           y: [6575.96, 6589, 6571.77, 6588.92],
//         },
//         {
//           x: new Date(1538838000000),
//           y: [6588.92, 6594, 6577.55, 6589.22],
//         },
//         {
//           x: new Date(1538839800000),
//           y: [6589.3, 6598.89, 6589.1, 6596.08],
//         },
//         {
//           x: new Date(1538841600000),
//           y: [6597.5, 6600, 6588.39, 6596.25],
//         },
//         {
//           x: new Date(1538843400000),
//           y: [6598.03, 6600, 6588.73, 6595.97],
//         },
//         {
//           x: new Date(1538845200000),
//           y: [6595.97, 6602.01, 6588.17, 6602],
//         },
//         {
//           x: new Date(1538847000000),
//           y: [6602, 6607, 6596.51, 6599.95],
//         },
//         {
//           x: new Date(1538848800000),
//           y: [6600.63, 6601.21, 6590.39, 6591.02],
//         },
//         {
//           x: new Date(1538850600000),
//           y: [6591.02, 6603.08, 6591, 6591],
//         },
//         {
//           x: new Date(1538852400000),
//           y: [6591, 6601.32, 6585, 6592],
//         },
//         {
//           x: new Date(1538854200000),
//           y: [6593.13, 6596.01, 6590, 6593.34],
//         },
//         {
//           x: new Date(1538856000000),
//           y: [6593.34, 6604.76, 6582.63, 6593.86],
//         },
//         {
//           x: new Date(1538857800000),
//           y: [6593.86, 6604.28, 6586.57, 6600.01],
//         },
//         {
//           x: new Date(1538859600000),
//           y: [6601.81, 6603.21, 6592.78, 6596.25],
//         },
//         {
//           x: new Date(1538861400000),
//           y: [6596.25, 6604.2, 6590, 6602.99],
//         },
//         {
//           x: new Date(1538863200000),
//           y: [6602.99, 6606, 6584.99, 6587.81],
//         },
//         {
//           x: new Date(1538865000000),
//           y: [6587.81, 6595, 6583.27, 6591.96],
//         },
//         {
//           x: new Date(1538866800000),
//           y: [6591.97, 6596.07, 6585, 6588.39],
//         },
//         {
//           x: new Date(1538868600000),
//           y: [6587.6, 6598.21, 6587.6, 6594.27],
//         },
//         {
//           x: new Date(1538870400000),
//           y: [6596.44, 6601, 6590, 6596.55],
//         },
//         {
//           x: new Date(1538872200000),
//           y: [6598.91, 6605, 6596.61, 6600.02],
//         },
//         {
//           x: new Date(1538874000000),
//           y: [6600.55, 6605, 6589.14, 6593.01],
//         },
//         {
//           x: new Date(1538875800000),
//           y: [6593.15, 6605, 6592, 6603.06],
//         },
//         {
//           x: new Date(1538877600000),
//           y: [6603.07, 6604.5, 6599.09, 6603.89],
//         },
//         {
//           x: new Date(1538879400000),
//           y: [6604.44, 6604.44, 6600, 6603.5],
//         },
//         {
//           x: new Date(1538881200000),
//           y: [6603.5, 6603.99, 6597.5, 6603.86],
//         },
//         {
//           x: new Date(1538883000000),
//           y: [6603.85, 6605, 6600, 6604.07],
//         },
//         {
//           x: new Date(1538884800000),
//           y: [6604.98, 6606, 6604.07, 6606],
//         },
//       ],
//     },
//   ];
//   useEffect(() => {
//     // Fetch data when the interval or symbol changes
//     fetchData(interval, symbol);
//   }, [interval, symbol]);

//   // const options = {
//   //   chart: {
//   //     type: 'candlestick',
//   //     height: 350,
//   //   },
//   //   xaxis: {
//   //     type: 'datetime',
//   //   },
//   //   yaxis: {
//   //     tooltip: {
//   //       enabled: true,
//   //     },
//   //   },
//   // };

//   // const series = [
//   //   {
//   //     data: candlestickData,
//   //   },
//   // ];

//   return (
//     <div>
//       <h2>Candlestick Chart ({interval})</h2>

//       <div>
//         <label>
//           Select Interval:
//           <select value={interval} onChange={(e) => setInterval(e.target.value)}>
//             <option value="1min">1 Minute</option>
//             <option value="5min">5 Minutes</option>
//             <option value="15min">15 Minutes</option>
//           </select>
//         </label>
//       </div>

//       <div>
//         <label>
//           Select Symbol:
//           <input type="text" value={symbol} onChange={(e) => setSymbol(e.target.value)} />
//         </label>
//       </div>

//       <ReactApexChart options={options} series={series} type="candlestick" height={350} />
//     </div>
//   );
// };

// export default CandlestickChart;



// import React, { useState } from 'react';
// import Chart from "react-apexcharts";

// const data = {

//   series: [
//     {
//       data: [
//         {
//           x: new Date(1538778600000),
//           y: [6629.81, 6650.5, 6623.04, 6633.33],
//         },
//         {
//           x: new Date(1538780400000),
//           y: [6632.01, 6643.59, 6620, 6630.11],
//         },
//         {
//           x: new Date(1538782200000),
//           y: [6630.71, 6648.95, 6623.34, 6635.65],
//         },
//         {
//           x: new Date(1538784000000),
//           y: [6635.65, 6651, 6629.67, 6638.24],
//         },
//         {
//           x: new Date(1538785800000),
//           y: [6638.24, 6640, 6620, 6624.47],
//         },
//         {
//           x: new Date(1538787600000),
//           y: [6624.53, 6636.03, 6621.68, 6624.31],
//         },
//         {
//           x: new Date(1538789400000),
//           y: [6624.61, 6632.2, 6617, 6626.02],
//         },
//         {
//           x: new Date(1538791200000),
//           y: [6627, 6627.62, 6584.22, 6603.02],
//         },
//         {
//           x: new Date(1538793000000),
//           y: [6605, 6608.03, 6598.95, 6604.01],
//         },
//         {
//           x: new Date(1538794800000),
//           y: [6604.5, 6614.4, 6602.26, 6608.02],
//         },
//         {
//           x: new Date(1538796600000),
//           y: [6608.02, 6610.68, 6601.99, 6608.91],
//         },
//         {
//           x: new Date(1538798400000),
//           y: [6608.91, 6618.99, 6608.01, 6612],
//         },
//         {
//           x: new Date(1538800200000),
//           y: [6612, 6615.13, 6605.09, 6612],
//         },
//         {
//           x: new Date(1538802000000),
//           y: [6612, 6624.12, 6608.43, 6622.95],
//         },
//         {
//           x: new Date(1538803800000),
//           y: [6623.91, 6623.91, 6615, 6615.67],
//         },
//         {
//           x: new Date(1538805600000),
//           y: [6618.69, 6618.74, 6610, 6610.4],
//         },
//         {
//           x: new Date(1538807400000),
//           y: [6611, 6622.78, 6610.4, 6614.9],
//         },
//         {
//           x: new Date(1538809200000),
//           y: [6614.9, 6626.2, 6613.33, 6623.45],
//         },
//         {
//           x: new Date(1538811000000),
//           y: [6623.48, 6627, 6618.38, 6620.35],
//         },
//         {
//           x: new Date(1538812800000),
//           y: [6619.43, 6620.35, 6610.05, 6615.53],
//         },
//         {
//           x: new Date(1538814600000),
//           y: [6615.53, 6617.93, 6610, 6615.19],
//         },
//         {
//           x: new Date(1538816400000),
//           y: [6615.19, 6621.6, 6608.2, 6620],
//         },
//         {
//           x: new Date(1538818200000),
//           y: [6619.54, 6625.17, 6614.15, 6620],
//         },
//         {
//           x: new Date(1538820000000),
//           y: [6620.33, 6634.15, 6617.24, 6624.61],
//         },
//         {
//           x: new Date(1538821800000),
//           y: [6625.95, 6626, 6611.66, 6617.58],
//         },
//         {
//           x: new Date(1538823600000),
//           y: [6619, 6625.97, 6595.27, 6598.86],
//         },
//         {
//           x: new Date(1538825400000),
//           y: [6598.86, 6598.88, 6570, 6587.16],
//         },
//         {
//           x: new Date(1538827200000),
//           y: [6588.86, 6600, 6580, 6593.4],
//         },
//         {
//           x: new Date(1538829000000),
//           y: [6593.99, 6598.89, 6585, 6587.81],
//         },
//         {
//           x: new Date(1538830800000),
//           y: [6587.81, 6592.73, 6567.14, 6578],
//         },
//         {
//           x: new Date(1538832600000),
//           y: [6578.35, 6581.72, 6567.39, 6579],
//         },
//         {
//           x: new Date(1538834400000),
//           y: [6579.38, 6580.92, 6566.77, 6575.96],
//         },
//         {
//           x: new Date(1538836200000),
//           y: [6575.96, 6589, 6571.77, 6588.92],
//         },
//         {
//           x: new Date(1538838000000),
//           y: [6588.92, 6594, 6577.55, 6589.22],
//         },
//         {
//           x: new Date(1538839800000),
//           y: [6589.3, 6598.89, 6589.1, 6596.08],
//         },
//         {
//           x: new Date(1538841600000),
//           y: [6597.5, 6600, 6588.39, 6596.25],
//         },
//         {
//           x: new Date(1538843400000),
//           y: [6598.03, 6600, 6588.73, 6595.97],
//         },
//         {
//           x: new Date(1538845200000),
//           y: [6595.97, 6602.01, 6588.17, 6602],
//         },
//         {
//           x: new Date(1538847000000),
//           y: [6602, 6607, 6596.51, 6599.95],
//         },
//         {
//           x: new Date(1538848800000),
//           y: [6600.63, 6601.21, 6590.39, 6591.02],
//         },
//         {
//           x: new Date(1538850600000),
//           y: [6591.02, 6603.08, 6591, 6591],
//         },
//         {
//           x: new Date(1538852400000),
//           y: [6591, 6601.32, 6585, 6592],
//         },
//         {
//           x: new Date(1538854200000),
//           y: [6593.13, 6596.01, 6590, 6593.34],
//         },
//         {
//           x: new Date(1538856000000),
//           y: [6593.34, 6604.76, 6582.63, 6593.86],
//         },
//         {
//           x: new Date(1538857800000),
//           y: [6593.86, 6604.28, 6586.57, 6600.01],
//         },
//         {
//           x: new Date(1538859600000),
//           y: [6601.81, 6603.21, 6592.78, 6596.25],
//         },
//         {
//           x: new Date(1538861400000),
//           y: [6596.25, 6604.2, 6590, 6602.99],
//         },
//         {
//           x: new Date(1538863200000),
//           y: [6602.99, 6606, 6584.99, 6587.81],
//         },
//         {
//           x: new Date(1538865000000),
//           y: [6587.81, 6595, 6583.27, 6591.96],
//         },
//         {
//           x: new Date(1538866800000),
//           y: [6591.97, 6596.07, 6585, 6588.39],
//         },
//         {
//           x: new Date(1538868600000),
//           y: [6587.6, 6598.21, 6587.6, 6594.27],
//         },
//         {
//           x: new Date(1538870400000),
//           y: [6596.44, 6601, 6590, 6596.55],
//         },
//         {
//           x: new Date(1538872200000),
//           y: [6598.91, 6605, 6596.61, 6600.02],
//         },
//         {
//           x: new Date(1538874000000),
//           y: [6600.55, 6605, 6589.14, 6593.01],
//         },
//         {
//           x: new Date(1538875800000),
//           y: [6593.15, 6605, 6592, 6603.06],
//         },
//         {
//           x: new Date(1538877600000),
//           y: [6603.07, 6604.5, 6599.09, 6603.89],
//         },
//         {
//           x: new Date(1538879400000),
//           y: [6604.44, 6604.44, 6600, 6603.5],
//         },
//         {
//           x: new Date(1538881200000),
//           y: [6603.5, 6603.99, 6597.5, 6603.86],
//         },
//         {
//           x: new Date(1538883000000),
//           y: [6603.85, 6605, 6600, 6604.07],
//         },
//         {
//           x: new Date(1538884800000),
//           y: [6604.98, 6606, 6604.07, 6606],
//         },
//       ],
//     },
//   ],


//   options: {
//     chart: {
//       type: "candlestick",
//       height: 350,
//     },
//     title: {
//       text: "CandleStick Chart",
//       align: "left",
//     },
//     xaxis: {
//       type: "datetime",
//     },
//     yaxis: {
//       tooltip: {
//         enabled: true,
//       },
//     },
//     events: {
//       markerClick: (event, chartContext, { seriesIndex, dataPointIndex }) => {
//         // Handle marker click event
//         const series = chartContext.w.config.series[seriesIndex];
//         const selectedPoint = series.data[dataPointIndex];


//         console.log('Selected Data:', selectedPoint);

//         // setSelectedData(selectedPoint);
//       },
//     },
//   },


// }

// function ApexCandleStick() {

//   const [selectedData, setSelectedData] = useState(null);


//   return (
//     <div>
//       <Chart
//         type="candlestick"
//         height={400}
//         options={data.options}
//         series={data.series}
//       />
//     </div>
//   );
// }
// export default ApexCandleStick;







// import React from 'react'

// const test = () => {


//   return (
//     <div>
//       <div class="container-fluid">
//         <div class="row mb-5">
//           <div class="col-12 col-sm-6 col-md-3">
//             <div class="card card-purple-blue text-white mb-3 mb-md-0">
//               <div class="d-flex justify-content-between " >
//                 <div>
//                   <p class="new-un">Undefined</p>
//                 </div>
//                 <div>
//                   <p class="new-de">Undefined</p>
//                 </div>
//               </div>
//               <h4 class="card-new-heading">Test</h4>
//               <div class="card-body d-flex justify-between align-items-end">
//                 <div class="card-number">
//                   <div class="h3">Recommended</div><small><strong>Capital : undefined PER LOT</strong></small>
//                 </div>
//                 <div class="card-description text-right">
//                   <small class="new-sma">Info</small>
//                 </div>
//                 <div class="card-description text-right ml-3">
//                   <small class="new-sma">Join</small>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div class="col-12 col-sm-6 col-md-3">
//             <div class="card card-salmon-pink text-white">
//               <div class="d-flex justify-content-space-between" >
//                 <div>
//                   <p class="new-un">Undefined</p>
//                 </div>
//                 <div>
//                   <p class="new-de">Undefined</p>
//                 </div>
//               </div>
//               <h4 class="card-new-heading">Test1</h4>
//               <div class="card-body d-flex justify-content-between align-items-end">
//                 <div class="card-number">
//                   <div class="h3">Recommended</div><small><strong>Capital : 99999 PER LOT</strong></small>
//                 </div>
//                 <div class="card-description text-right">
//                   <small class="new-sma">Info</small>
//                 </div>
//                 <div class="card-description text-right ml-3">
//                   <small class="new-sma">Join</small>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div class="col-12 col-sm-6 col-md-3">
//             <div class="card card-blue-green text-white">
//               <div class="d-flex justify-content-space-between" >
//                 <div>
//                   <p class="new-un">Undefined</p>
//                 </div>
//                 <div>
//                   <p class="new-de">Undefined</p>
//                 </div>
//               </div>
//               <h4 class="card-new-heading">Test2</h4>
//               <div class="card-body d-flex justify-content-between align-items-end">
//                 <div class="card-number">
//                   <div class="h3">Recommended</div><small><strong>Capital : 99999 PER LOT</strong></small>
//                 </div>
//                 <div class="card-description text-right">
//                   <small class="new-sma">Info</small>
//                 </div>
//                 <div class="card-description text-right ml-3">
//                   <small class="new-sma">Join</small>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div class="col-12 col-sm-6 col-md-3">
//             <div class="card card-purple-pink text-white">
//               <div class="d-flex justify-content-space-between" >
//                 <div>
//                   <p class="new-un">Undefined</p>
//                 </div>
//                 <div>
//                   <p class="new-de">Undefined</p>
//                 </div>
//               </div>
//               <h4 class="card-new-heading">Test3</h4>
//               <div class="card-body d-flex justify-content-between align-items-end">
//                 <div class="card-number">
//                   <div class="h3">Recommended</div><small><strong>Capital : 99999 PER LOT</strong></small>
//                 </div>
//                 <div class="card-description text-right">
//                   <small class="new-sma">Info</small>
//                 </div>
//                 <div class="card-description text-right ml-3">
//                   <small class="new-sma">Join</small>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default test




// import { useEffect } from 'react';
// import axios from 'axios';

// const SPREADSHEET_ID = '1wwSMDmZuxrDXJsmxSIELk1O01F0x1-0LEpY03iY1tWU';
// const RANGE = 'MARKET_DATA!A1:B189'; // Update with your sheet name and range

// const fetchDataFromGoogleSheet = async () => {
//   try {

//     const response = await axios.get(
//       // `https://sheets.googleapis.com/v4/spreadsheets/${1wwSMDmZuxrDXJsmxSIELk1O01F0x1-0LEpY03iY1tWU}/values/${RANGE}`
//       `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}`

//     );

//     console.log('Data from Google Sheet:', response.data);
//   } catch (error) {
//     console.log('Error fetching data:', error);
//   }
// };

// const App = () => {
//   useEffect(() => {
//     fetchDataFromGoogleSheet();
//   }, []);

//   return <div>Your React App</div>;
// };

// export default App;



// import React, { createRef, useRef , useState } from 'react';
// import { useScreenshot } from 'use-react-screenshot';

// // ...


// const TakeScreenshot = () => {

//   const ref = createRef(null);
//   const [image, takeScreenshot] = useScreenshot();

//   const handleTakeScreenshot = () => takeScreenshot(ref.current);

//   const styles = {
//     container: {
//       flex: 1,
//       justifyContent: 'center',
//       alignItems: 'center',
//     },
//     viewShot: {
//       flex: 1,
//       width: '100%',
//       height: '100%',
//     },
//   }

//   return (
//     <div>
//       <div>
//         <button onClick={()=>handleTakeScreenshot() }>Take Screenshot</button>
//       </div>
//       <img width={styles} src={image} alt={'Screenshot'} />
//       <div ref={ref}>
//         {/* Your app content goes here */}
//       </div>
//     </div>
//   );
// };

// export default TakeScreenshot;
