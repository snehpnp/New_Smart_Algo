module.exports = function (app) {
    const { service_token_update } = require('../Cron/cron')

    const axios = require('axios');
    const excel = require('exceljs');
    const fs = require('fs');
    

    const db = require('../Models')
    const user_logs = db.user_logs;



    app.get('/servicedata', async (req, res) => {


        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: 'https://margincalculator.angelbroking.com/OpenAPI_File/files/OpenAPIScripMaster.json',
            headers: {}
        };

        axios.request(config)
            .then((response) => {
                console.log("Run");
                var bseData = []

                // Create the CSV content from the data
                const csvContent = response.data.map((item) => {
                    if (item.exch_seg == "BSE") {
                        bseData.push(item)
                    }
                }).join('\n');

                // Save the CSV content to a file
                const filename = 'data10.csv';

                const csvContent1 = bseData.map(row => Object.values(row).join(',')).join('\n');


                fs.writeFile(filename, csvContent1, 'utf8', (err) => {
                    if (err) {
                        console.error('Error while saving CSV file:', err.message);
                    } else {
                        console.log('CSV file created and saved:', filename);
                        // Now you can print the CSV file using any software that supports .csv files.
                    }
                });




            })
            .catch((error) => {
                console.log(error);
            });

    })


    // set liveprice all Stock
    
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


}