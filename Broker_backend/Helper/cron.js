var cron = require('node-cron');
const axios = require('axios');
const fs = require('fs');
var path = require('path');
// 1. LOGOUT AND TRADING OFF ALL USER 
cron.schedule('* 1 * * *', () => {
    console.log('Run First Time');
    downloadAlicetoken()
});


// ALL Alice Token Genrate
const downloadAlicetoken = () => {

    var TokenUrl = [
        {
            url: "https://v2api.aliceblueonline.com/restpy/static/contract_master/NFO.csv",
            key: "ALICE_NFO"
        },
        {
            url: "https://v2api.aliceblueonline.com/restpy/static/contract_master/NSE.csv",
            key: "ALICE_NSE"
        },
        {
            url: "https://v2api.aliceblueonline.com/restpy/static/contract_master/MCX.csv",
            key: "ALICE_MCX"
        },
        {
            url: "https://v2api.aliceblueonline.com/restpy/static/contract_master/CDS.csv",
            key: "ALICE_CDS"
        }
    ]

    TokenUrl.forEach((data) => {

        const filePath = path.join(__dirname, '..', 'AllInstrumentToken', 'Aliceblue', `${data.key}.csv`);
      

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
                console.error('Error downloading file:', error);
            });
    })

}






module.exports = {downloadAlicetoken }