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
                        console.log('Error while saving CSV file:', err.message);
                    } 
                });




            })
            .catch((error) => {
                console.log("Error ",error);
            });

    })


   


}