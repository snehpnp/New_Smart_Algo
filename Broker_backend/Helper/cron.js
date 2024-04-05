
module.exports = function (app) { 
    var cron = require('node-cron');
    const axios = require('axios');
    const fs = require('fs');
    var path = require('path');
    // 1. LOGOUT AND TRADING OFF ALL USER 
    cron.schedule('* 1 * * *', () => {
        console.log('Run First Time');
        downloadAlicetoken();
        downloadFyerstoken();
    });
    
    cron.schedule('10 7 * * *', () => {
        console.log('Run First Time');
        downloadZerodhatoken()
        downloadAndExtractUpstox()
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
                    console.log('Error downloading file:', error);
                });
        })
    
    }
    
    
    const downloadZerodhatoken = () => {
    
        var TokenUrl = [
            {
                url: "https://api.kite.trade/instruments",
                key: "Zerodha"
            },
    
        ]
        TokenUrl.forEach((data) => {
            const filePath = path.join(__dirname, '..', 'AllInstrumentToken', 'Zerodha', `${data.key}.csv`);
            // const filePath = path.join(__dirname, '..', 'AllInstrumentToken', 'Aliceblue', `${data.key}.csv`);
    
    
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

    // Upstox Files
    const  downloadAndExtractUpstox = async ()=> {
        const fs = require('fs');
        const zlib = require('zlib');
        const path = require('path');

        try {
            const url = 'https://assets.upstox.com/market-quote/instruments/exchange/complete.csv.gz';

            // Download the gzip file
            const response = await axios.get(url, { responseType: 'arraybuffer' });

            // Create a folder to store the extracted files
            const outputFolder = path.join(__dirname, '../AllInstrumentToken/upstoxinstrument');
            if (!fs.existsSync(outputFolder)) {
                fs.mkdirSync(outputFolder);
            }

            // Save the gzip file
            const gzipFilePath = path.join(__dirname, 'complete.csv.gz');
            fs.writeFileSync(gzipFilePath, Buffer.from(response.data, 'binary'));

            // Extract the gzip file
            const extractedFilePath = path.join(outputFolder, 'complete.csv');
            const gunzip = zlib.createGunzip();
            const input = fs.createReadStream(gzipFilePath);
            const output = fs.createWriteStream(extractedFilePath);

            input.pipe(gunzip).pipe(output);

            output.on('finish', () => {
                // Clean up the downloaded gzip file
                fs.unlinkSync(gzipFilePath);
                console.log('Download and extraction completed successfully');
            });
        } catch (err) {
            console.error('Error:', err);
        }
    }


     // Fyers Files
     const downloadFyerstoken = () => {


        var TokenUrl = [
            {
                url: "https://public.fyers.in/sym_details/NSE_FO.csv",
                key: "FYERS_NFO"
            },
            {
                url: "https://public.fyers.in/sym_details/NSE_CM.csv",
                key: "FYERS_NSE"
            },
            {
                url: "https://public.fyers.in/sym_details/MCX_COM.csv",
                key: "FYERS_MCX"
            },
            {
                url: "https://public.fyers.in/sym_details/NSE_CD.csv",
                key: "FYERS_CDS"
            }
        ]


        TokenUrl.forEach((data) => {
    
            const filePath = path.join(__dirname, '..', 'AllInstrumentToken', 'Fyers', `${data.key}.csv`);
          
    
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


    // app.get('/chek-token', async (req, res) => {
    //     downloadFyerstoken()
    //      res.send("okkk")
    //   })


  
    
}




