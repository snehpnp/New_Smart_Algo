var cron = require('node-cron');
const axios = require('axios');
const fs = require('fs');
const filePath = 'file.txt'; // Replace with the actual path to your text file

cron.schedule('42 12 * * *', () => {
    console.log('running a task every minute');
    service_token_update()
});


// Read the content of the file




const service_token_update = () => {

    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://margincalculator.angelbroking.com/OpenAPI_File/files/OpenAPIScripMaster.json',
        headers: {}
    };

    axios.request(config)
        .then((response) => {

            fs.writeFile(filePath, JSON.stringify(response.data), 'utf8', (err) => {
                if (err) {
                    console.error('Error writing to the file:', err);
                } else {
                    console.log('Content written to the file successfully!');
                }
            });

            // console.log("response", response.data);

            var Cash_stocks = []
            response.data.map(async (item) => {
                if (item.exch_seg == "NSE") {
                    await Cash_stocks.push(item)
                }

            });
            console.log(Cash_stocks);

        })
        .catch((error) => {
            console.log(error);
        });

}