app.get("/getLivePrice",(req,res)=>{

const currentDate = new Date();
const year = currentDate.getFullYear();
const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Add 1 to the month since it's zero-based
const day = String(currentDate.getDate()).padStart(2, '0');

const daynext = String(currentDate.getDate() + 1).padStart(2, '0');

const currentformattedDate = `${year}-${month}-${day}`;

const nextdayformattedDate = `${year}-${month}-${daynext}`;

console.log("currentformattedDate",currentformattedDate);
console.log("nextdayformattedDate",nextdayformattedDate);
       
// Nifty 50: '^NSEI'
// Bank Nifty: '^NSEBANK'
// Nifty Financial Services: '^NIFTYFIN'


var yahooFinance = require('yahoo-finance');
console.log("1")
yahooFinance.historical({

symbol: '^NSEBANK', // Use the symbol for Infosys or another Indian company listed on U.S. exchanges

from: currentformattedDate,
to: nextdayformattedDate,

// period: 'd' // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only)

}, function (err, quotes) {
if (err) {
console.error(err);
} else {
console.log(quotes[0].close);
}

});

res.send("ookkkk");
});