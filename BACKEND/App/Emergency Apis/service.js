module.exports = function (app) {
    const { service_token_update } = require('../Cron/cron')

    const axios = require('axios');
    const excel = require('exceljs');
    const fs = require('fs');
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

                console.log(bseData.length);
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
}