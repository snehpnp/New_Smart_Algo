module.exports = function (app) {
    const axios = require('axios');
    const excel = require('exceljs');
    const db = require("../Models");
    const Get_Option_Chain_modal = db.option_chain_symbols;


    const fs = require('fs');
    app.get('/token_symbolls', async (req, res) => {
        return
        res.send("done")
        try {
            axios.get("https://margincalculator.angelbroking.com/OpenAPI_File/files/OpenAPIScripMaster.json", {
                maxBodyLength: Infinity,
                headers: {}
            }).then(async (response) => {
                if (response) {

                    var unique_key = []
                    let count = 0
                    response.data.forEach((item) => {
                        if (!unique_key.includes(`${item.name}-${item.instrumenttype}`)) {
                            unique_key.push(`${item.name}-${item.instrumenttype}`);

                            if (item.instrumenttype == 'OPTSTK' || item.instrumenttype == 'OPTIDX') {
                                count++

                                const User = new Get_Option_Chain_modal({
                                    symbol: item.name,
                                    price: 0,
                                    token: "null"

                                });
                                const userinfo = User.save()


                                

                            }
                        }
                    });
                }
                res.send("done")
            }).catch((error) => {
               
            });
        }
        catch (err) {
            console.log("Error err", err);
        }


    })

    // set liveprice all Stock

    app.get("/getLivePrice", async (req, res) => {

        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Add 1 to the month since it's zero-based
        const day = String(currentDate.getDate()).padStart(2, '0');

        const daynext = String(currentDate.getDate() + 1).padStart(2, '0');

        const currentformattedDate = `${year}-${month}-${day}`;

        const nextdayformattedDate = `${year}-${month}-${daynext}`;


        // Nifty 50: '^NSEI'
        // Bank Nifty: '^NSEBANK'
        // Nifty Financial Services: '^NIFTYFIN'



        var yahooFinance = require('yahoo-finance');
       
        yahooFinance.historical({

            symbol: '^NSEBANK', // Use the symbol for Infosys or another Indian company listed on U.S. exchanges

            from: currentformattedDate,
            to: nextdayformattedDate,

            // period: 'd' // 'd' (daily), 'w' (weekly), 'm' (monthly), 'v' (dividends only)

        }, function (err, quotes) {
            if (err) {
                console.log(err);
            } else {
                // console.log("Error price", quotes[0].close);
            }

        });

        res.send("ok");
    });


    


}