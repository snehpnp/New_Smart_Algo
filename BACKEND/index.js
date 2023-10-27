// const fs = require('fs');
// const mysql = require('mysql2/promise');

// const imageBuffer = readFileAsBase64('C:/Users/Punit/Downloads/download.jfif');

// function readFileAsBase64(filePath) {
//     const fileData = fs.readFileSync(filePath);
//     return fileData.toString('base64');
//   }
// async function main() {
//   try {
//     console.log("imageBuffer",imageBuffer);

//   } catch (error) {
//     console.error('Error:', error);
//   }
// }
// main();

// var yahooFinance = require('yahoo-finance');

// yahooFinance.historical({
//   symbol: 'GOOGL', // Use the symbol for Infosys or another Indian company listed on U.S. exchanges
//   from: '2023-10-25',
//   to: '2023-10-26',
//   // period: 'd'  // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only)
// }, function (err, quotes) {
//   if (err) {
//     console.error(err);
//   } else {
//     console.log(quotes);
//   }
// });

// import { nseData } from 'nse-data';
// var nseData = require('nse-data');

// nseData.marketStatus().then((value) => {
//   console.log(value)
// })

// const liveStockPrice = require('live-stock-price');

// liveStockPrice('AAPL')
//     .then((price) => {
//         console.log('Stock price:', price);
//     })
//     .catch((error) => {
//         console.error('Error:', error);
//     });


// const { NseIndia } = require('stock-nse-india');
// const nseIndia = new NseIndia()
// var a = () => {
//     console.log("run");

//     nseIndia.getAllStockSymbols().then(symbols => {
//         console.log(symbols)
//     })
//         .catch((err) => {
//             console.log("error", err);
//         })
// }
// a()

// var Quandl = require("quandl");
// var quandl = new Quandl({
//     auth_token: "dsahFHUiewjjd",
//     api_version: 3,
//     proxy: "http://myproxy:3128"
// });
// quandl.dataset({ source: "BITCOIN", table: "MTGOXUSD" }, function(err, response){
//     if(err)
//         throw err;
 
//     console.log(response);
// });

// import {  } from 'nse-data';
var {nseData} = require("nse-data");

nseData.marketStatus().then(() => console.log(value));


