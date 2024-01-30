
var fs = require('fs');
var path = require('path');
var axios = require('axios');

const downloadKotakNeotoken = () => {


    // Create a new Date object for the current date
    const currentDate = new Date();

    // Get the year, month, and day components
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed, so add 1
    const day = currentDate.getDate().toString().padStart(2, '0');

    // Format the date
    const formattedDate = `${year}-${month}-${day}`;

    // Log the formatted date
    console.log(formattedDate);

    var TokenUrl = [
        {
            url: `https://lapi.kotaksecurities.com/wso2-scripmaster/v1/prod/${formattedDate}/transformed/nse_fo.csv`,
            key: "KOTAK_NSE"
        },
        {
            url: `https://lapi.kotaksecurities.com/wso2-scripmaster/v1/prod/${formattedDate}/transformed/nse_cm.csv`,
            key: "KOTAK_NFO"
        },
        {
            url: `https://lapi.kotaksecurities.com/wso2-scripmaster/v1/prod/${formattedDate}/transformed/mcx_fo.csv`,
            key: "KOTAK_MCX"
        },
        {
            url: `https://lapi.kotaksecurities.com/wso2-scripmaster/v1/prod/${formattedDate}/transformed/cde_fo.csv`,
            key: "KOTAK_CDS"
        },

    ]

    
    TokenUrl.forEach((data) => {
        const filePath = path.join(__dirname, '..', 'AllInstrumentToken', 'Sneh', `${data.key}.csv`);
        
        console.log(data.url);
        const fileUrl = data.url

        axios({
            method: 'get',
            url: fileUrl,
            responseType: 'stream',
        })
            .then(function (response) {
                // Pipe the HTTP response stream to a local file
                response.data.pipe(fs.createWriteStream(filePath));

                response.data.on('end', function () {
                    console.log(`File downloaded to ${filePath}`);
                });
            })
            .catch(function (error) {
                console.log('Error downloading file:', error);
            });
    })

}
downloadKotakNeotoken()