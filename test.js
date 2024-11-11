// // // const numbers = [1, 2, 2, 3, 4, 4, 5];
// // // const uniqueNumbers = numbers.filter((num, index, arr) => arr.indexOf(num) === index);
// // // console.log(uniqueNumbers); // Output: [1, 2, 3, 4, 5]

// // // console.log(new Set(numbers)); // Output: Set { 1, 2, 3, 4, 5 }

// // // const uniqueNumbersUsingSet = Array.from(new Set(numbers));
// // // console.log(uniqueNumbersUsingSet); // Output: [1, 2, 3, 4, 5]

// // // // OR
// // // const uniqueNumbersUsingSet1 = [...new Set(numbers)];
// // // console.log(uniqueNumbersUsingSet1); // Output: [1, 2, 3, 4, 5]


// // // const people = [
// // //     { name: 'Alice', age: 25, city: 'New York' },
// // //     { name: 'Bob', age: 17, city: 'Los Angeles' },
// // //     { name: 'Charlie', age: 19, city: 'New York' },
// // //     { name: 'Dave', age: 20, city: 'Chicago' },
// // //     { name: 'Eve', age: 23, city: 'New York' }
// // //   ];
// // // console.log(Object.values(people.map(person=>person.age > 18)).sort());


// // // function closestToNegativeTwo(arr) {
// // //     let closestNumber = arr[0]; // Starting with the first element as the closest
  
// // //     // Iterate through the array to find the closest number to -2
// // //     for (let i = 1; i < arr.length; i++) {
// // //       // Compare the distances to -2 for each number in the array
// // //       if (Math.abs(arr[i] - (-2)) < Math.abs(closestNumber - (-2))) {
// // //         closestNumber = arr[i];
// // //       }
// // //     }
  
// // //     return closestNumber;
// // //   }
  
// // //   // Testing the function
// // //   const numbers = [-5, -3, -1, 0, 1, 2];
// // //   const closest = closestToNegativeTwo(numbers);
  
// // //   console.log(`The number closest to -2 is: ${closest}`);
  

// // function closestToNegativeTwo(arr) {
// //     let closestDistance = Math.abs(arr[0] - (-2));
// //     console.log(closestDistance); 
// //     let closestNumbers = [arr[0]]; 
  

// //     for (let i = 1; i < arr.length; i++) {
// //       const distance = Math.abs(arr[i] - (-2));
// //       console.log(distance);
  
// //       if (distance === closestDistance) {
// //         closestNumbers.push(arr[i]);
// //       }
    
// //       else if (distance < closestDistance) {
// //         closestDistance = distance;
// //         closestNumbers = [arr[i]];
// //       }
// //     }
  
// //     return closestNumbers;
// //   }
  
// //   // Testing the function
// //   const numbers = [-5,  -0.9, 0, 1, 2,-3.1,];
// //   const closest = closestToNegativeTwo(numbers);
  
// //   console.log(`The numbers closest to -2 are: ${closest}`);
  


// var a = [2,4,2,3,6,7,4,3,2,1,4,5,6,7,8,9,0,1,2,3,4,5,6,7,8,9];

// console.log(a.map(num=> {return num*2}))
// // console.log(a.filter(num=>  num%2==0))
// console.log(a.filter(num=>  num *1 == num ? num *50 : null))

// // console.log(a.reduce((acc, num)=> acc+num))
// // console.log(a.find(num=> num>4))
// // console.log(a.findIndex(num=> num>4))
// // console.log(a.some(num=> num>4))
// // console.log(a.every(num=> num>4))
// // console.log(a.sort((a,b)=> a-b))
// // console.log(a.reverse())
// // console.log(a.slice(2,5))
// // console.log(a.splice(2,5))

// console.log(a)

// function isPalindrome(str) {
//     const reversed = str.split("").reverse().join("");
//     return str === reversed;
// }

// // Example usage
// console.log(isPalindrome("madam"));  // Output: true
// console.log(isPalindrome("hello"));  // Output: false

// console.log("hello".split("").reduceRight((acc, char)=> acc+char, ""))

// // Fibonaki 
// const Fib = (a)=>{
// }

async function getCryptoPricesInUSD() {
    try {
        const coinIds = [
            'tether',     // USDT in USD
            'bitcoin',    // BTC in USD
            'ethereum',   // ETH in USD
            'usd-coin',   // USDC in USD
            'solana',     // SOL in USD
            'binancecoin',// BNB in USD
            'ripple',     // XRP in USD
            'dai',        // DAI in USD
            'dogecoin'    // DOGE in USD
        ];
        
        const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinIds.join(',')}&vs_currencies=usd`);
        const data = await response.json();
        
        // Display prices for each currency in USD
        console.log("Crypto prices in USD:");
        coinIds.forEach(coinId => {
            console.log(`${coinId.toUpperCase()} Price: $${data[coinId].usd}`);
        });
    } catch (error) {
        console.error("Error fetching crypto data:", error);
    }
}

getCryptoPricesInUSD();



// async function getCryptoPrices(cryptoPairs) {
//     const ids = {
//         btcusd: 'bitcoin', ethusd: 'ethereum', usdtusd: 'tether', solusd: 'solana',
//         solbtc: 'solana', bnbbtc: 'binancecoin', xrpusd: 'ripple', daiusd: 'dai', dogeusd: 'dogecoin'
//         // Add other mappings if needed
//     };
    
//     const pairs = cryptoPairs.map(pair => ids[pair] || pair); // Map pair symbols to CoinGecko IDs
//     const baseUrl = 'https://api.coingecko.com/api/v3/simple/price';
//     const results = {};

//     try {
//         for (let pair of pairs) {
//             const response = await fetch(`${baseUrl}?ids=${pair}&vs_currencies=usd,btc`);
//             const data = await response.json();
            
//             results[pair] = data[pair];
//         }
//         console.log("Crypto Data:", results);
//     } catch (error) {
//         console.error("Error fetching crypto data:", error);
//     }
// }

// const cryptoPairs = [
//     'usdtusd', 'btcusd', 'ethusd', 'solusd', 'solbtc', 
//     'bnbbtc', 'xrpusd', 'daiusd', 'dogeusd'
// ];

// getCryptoPrices(cryptoPairs);
// async function getForexRates(pairSymbols) {
//     const apiKey = 'YOUR_ALPHA_VANTAGE_API_KEY'; // Get this from Alpha Vantage
//     const baseUrl = 'https://www.alphavantage.co/query';
//     const results = {};

//     try {
//         for (let pair of pairSymbols) {
//             const fromCurrency = pair.substring(0, 3);
//             const toCurrency = pair.substring(3);

//             const response = await fetch(`${baseUrl}?function=CURRENCY_EXCHANGE_RATE&from_currency=${fromCurrency}&to_currency=${toCurrency}&apikey=${apiKey}`);
//             const data = await response.json();

//             if (data['Realtime Currency Exchange Rate']) {
//                 const rate = data['Realtime Currency Exchange Rate']['5. Exchange Rate'];
//                 results[pair.toUpperCase()] = rate;
//             } else {
//                 results[pair.toUpperCase()] = "Data not available";
//             }
//         }
//         console.log("Forex Data:", results);
//     } catch (error) {
//         console.error("Error fetching forex data:", error);
//     }
// }

// const forexPairs = [
//     'eurusd', 'jpyusd', 'usdjpy', 'gbpusd', 'audusd', 
//     'usdcad', 'usdchf', 'nzdusd', 'eurjpy', 'gbpjpy', 
//     'eurgbp', 'audjpy', 'euraud', 'eurchf', 'audnzd', 
//     'nzdjpy', 'gbpaud', 'gbpcad', 'eurnzd', 'audcad', 'gbpchf'
// ];

// getForexRates(forexPairs);
// async function getMarketDataCryptowatch(pair) {
//     const apiKey = 'YOUR_CRYPTOWATCH_API_KEY';
//     const baseUrl = `https://api.cryptowat.ch/markets/prices`;
//     const headers = { 'Authorization': `Bearer ${apiKey}` };

//     try {
//         const response = await fetch(baseUrl, { headers });
//         const data = await response.json();
        
//         // Extract required pairs from response data
//         const selectedPairs = pair.reduce((acc, p) => {
//             if (data.result[`kraken:${p.toLowerCase()}`]) {
//                 acc[p.toUpperCase()] = data.result[`kraken:${p.toLowerCase()}`];
//             }
//             return acc;
//         }, {});
        
//         console.log("Market Data:", selectedPairs);
//     } catch (error) {
//         console.error("Error fetching data from Cryptowatch:", error);
//     }
// }

// // Example pairs (both crypto and forex)
// const pairs = [
//     'btcusd', 'ethusd', 'usdtusd', 'eurusd', 'jpyusd', 'usdjpy'
// ];

// getMarketDataCryptowatch(pairs);
// async function getCryptoAndForexData(pairs) {
//     const apiKey = 'ed12e1d9-5af9-4575-8bcf-b34852814ea8';
//     const cryptoBaseUrl = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest`;
//     const forexBaseUrl = `https://pro-api.coinmarketcap.com/v1/fiat/map`;
//     const headers = { 'X-CMC_PRO_API_KEY': apiKey };

//     try {
//         // Fetch crypto data
//         const cryptoSymbols = pairs.filter(pair => ['btc', 'eth', 'usdt'].includes(pair.substring(0, 3).toLowerCase())).join(',');
//         const cryptoResponse = await fetch(`${cryptoBaseUrl}?symbol=${cryptoSymbols}`, { headers });
//         const cryptoData = await cryptoResponse.json();

//         // Fetch forex data (only available for certain fiat currencies)
//         const forexResponse = await fetch(forexBaseUrl, { headers });
//         // const forexData = await forexResponse.json();

//         console.log("Crypto Data:", cryptoData);
//         // console.log("Forex Data:", forexData);
//     } catch (error) {
//         console.error("Error fetching data from CoinMarketCap:", error);
//     }
// }

// const pairs = [
//     'BTCUSD', 'ETHUSD', 'USDTUSD', 'EURUSD', 'JPYUSD', 'USDJPY'
// ];

// getCryptoAndForexData(pairs)



// async function getMarketDataCryptowatch(pairs) {
//     const apiKey = 'ed12e1d9-5af9-4575-8bcf-b34852814ea8';
//     const url = `https://api.cryptowat.ch/markets/prices`;
//     const headers = { 'Authorization': `Bearer ${apiKey}` };

//     try {
//         const response = await fetch(url, { headers });
//         const data = await response.json();

//         if (data.result) {
//             const selectedPairs = pairs.reduce((acc, pair) => {
//                 const pairKey = `kraken:${pair.toLowerCase()}`;
//                 if (data.result[pairKey]) {
//                     acc[pair.toUpperCase()] = data.result[pairKey];
//                 } else {
//                     console.warn(`Pair ${pair} is not available.`);
//                 }
//                 return acc;
//             }, {});
//             console.log("Live Prices:", selectedPairs);
//         } else {
//             console.error("No data available:", data);
//         }
//     } catch (error) {
//         console.error("Error fetching data:", error);
//     }
// }

// const pairs = ['btcusd', 'ethusd', 'eurusd', 'usdjpy', 'gbpusd'];
// getMarketDataCryptowatch(pairs);
