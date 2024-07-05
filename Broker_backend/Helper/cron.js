
module.exports = function (app) { 
    var cron = require('node-cron');
    const axios = require('axios');
    const fs = require('fs');
    var path = require('path');
    const AdmZip = require('adm-zip');
    // 1. LOGOUT AND TRADING OFF ALL USER 
    cron.schedule('* 1 * * *', () => {
        console.log('Run First Time');
        downloadAlicetoken();
        downloadFyerstoken();
    });
    
    cron.schedule('10 7 * * *', () => {
        console.log('Run First Time');
        downloadAndSwastika(); 
    });
    

    cron.schedule('15 7 * * *', () => {
        console.log('Run First Time');
        downloadKotakNeotoken();
    });


    cron.schedule('20 7 * * *', () => {
        console.log('Run First Time');
        downloadZerodhatoken();
        downloadAndExtractUpstox();
        downloadAndExtractICICIDirect();
    
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

       // Swastika Token get
       async function downloadAndSwastika() {
        try {
            
            var ulrs = [
                {url:"https://justradeuat.swastika.co.in/NSE_symbols.txt.zip",filename:"NSE_symbols.txt.zip"},
                {url:"https://justradeuat.swastika.co.in/NFO_symbols.txt.zip",filename:"NFO_symbols.txt.zip"},
                {url:"https://justradeuat.swastika.co.in/MCX_symbols.txt.zip",filename:"MCX_symbols.txt.zip"},{url:"https://justradeuat.swastika.co.in/CDS_symbols.txt.zip",filename:"CDS_symbols.txt.zip"},
                {url:"https://justradeuat.swastika.co.in/BSE_symbols.txt.zip",filename:"BSE_symbols.txt.zip"},
                {url:"https://justradeuat.swastika.co.in/NCX_symbols.txt.zip",filename:"NCX_symbols.txt.zip"}
    
            ];
    
           ulrs.forEach(async function(item) {
         
                //  const url = 'https://justradeuat.swastika.co.in/NFO_symbols.txt.zip';
            
                 // Download the zip file
                 const response = await axios.get(item.url, { responseType: 'arraybuffer' });
         
                 // Create a folder to store the extracted files
                 const outputFolder = path.join(__dirname, '../AllInstrumentToken/swastika');
                 if (!fs.existsSync(outputFolder)) {
                     fs.mkdirSync(outputFolder);
                 }
         
                 // Save the zip file
                 const zipFilePath = path.join(__dirname, item.filename);
                 fs.writeFileSync(zipFilePath, Buffer.from(response.data, 'binary'));
         
                 // Extract the zip file
                 const zip = new AdmZip(zipFilePath);
                 zip.extractAllTo(outputFolder, true);
         
                 // Clean up the downloaded zip file
                 fs.unlinkSync(zipFilePath);
    
    
            console.log('Download and extraction completed successfully '+item.url + " filename ",item.filename);
    
            });

    
        } catch (err) {
            console.error('Error:', err);
        }  

    }

    // Dawnload kotak Token
    const downloadKotakNeotoken = () => {


        // Create a new Date object for the current date
        const currentDate = new Date();

        // Get the year, month, and day components
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed, so add 1
        const day = currentDate.getDate().toString().padStart(2, '0');

        // Format the date
        const formattedDate = `${year}-${month}-${day}`;


        var TokenUrl = [
            {
                url: `https://lapi.kotaksecurities.com/wso2-scripmaster/v1/prod/${formattedDate}/transformed/nse_fo.csv`,
                key: "KOTAK_NFO"
            },
            {
                url: `https://lapi.kotaksecurities.com/wso2-scripmaster/v1/prod/${formattedDate}/transformed/nse_cm.csv`,
                key: "KOTAK_NSE"
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
            const filePath = path.join(__dirname, '..', 'AllInstrumentToken', 'KotakNeo', `${data.key}.csv`);
            
      
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

     // ICICI DIRECT FILES
    const downloadAndExtractICICIDirect = async ()=> {
        try {
            const url = 'https://directlink.icicidirect.com/NewSecurityMaster/SecurityMaster.zip';

            // Download the zip file
            const response = await axios.get(url, { responseType: 'arraybuffer' });

            // Create a folder to store the extracted files
            const outputFolder = path.join(__dirname, '../AllInstrumentToken/iciciinstrument');
            if (!fs.existsSync(outputFolder)) {
                fs.mkdirSync(outputFolder);
            }

            // Save the zip file
            const zipFilePath = path.join(__dirname, 'SecurityMaster.zip');
            fs.writeFileSync(zipFilePath, Buffer.from(response.data, 'binary'));

            // Extract the zip file
            const zip = new AdmZip(zipFilePath);
            zip.extractAllTo(outputFolder, true);

            // Clean up the downloaded zip file
            fs.unlinkSync(zipFilePath);

            // Send a response to indicate success
            console.log('Download and extraction completed successfully');
        } catch (err) {
            console.error('Error:', err);
        }
    }


    app.get('/sneh', async (req, res) => {
       downloadKotakNeotoken()
       return res.send("okkk")
      })


  
    
}




