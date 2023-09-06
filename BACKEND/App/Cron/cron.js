var cron = require('node-cron');
const axios = require('axios');
const fs = require('fs');
const filePath = 'file.txt'; // Replace with the actual path to your text file
const { logger, getIPAddress } = require('../Helper/logger.helper')

const db = require('../Models')
const User = db.user;
const user_logs = db.user_logs;



// 1. LOGOUT AND TRADING OFF ALL USER 
cron.schedule('5 2 * * *', () => {
    console.log('Run First Time');
    LogoutAllUsers()
});

// 1.1 LOGOUT AND TRADING OFF ALL USER 
cron.schedule('5 5 * * *', () => {
    console.log('Run Second Time');
    LogoutAllUsers()
});

// 2. SERVICES TOKEN CREATE
cron.schedule('42 12 * * *', () => {
    console.log('running a task every minute');
    service_token_update()
});



// 1. LOGOUT AND TRADING OFF ALL USER 
const LogoutAllUsers = async () => {

    // APP LOGOUT USERS  
    const AppLoginUser = await User.find({ AppLoginStatus: 1 });
    if (AppLoginUser.length > 0) {
        AppLoginUser.map(async (user) => {

            const updateValues = { AppLoginStatus: 0 };
            const updatedDocument = await User.findByIdAndUpdate(user._id, updateValues, {
                new: true, // To return the updated document
            });

            const user_login = new user_logs({
                user_Id: user._id,
                login_status: "Panel Off In App",
                role: user.Role,
                system_ip: getIPAddress()
            })
            await user_login.save();
        })
    }

    // WEB LOGOUT USERS  
    const WebLoginUser = await User.find({ WebLoginStatus: 1 });
    if (WebLoginUser.length > 0) {
        WebLoginUser.map(async (user) => {
            const updateValues = { WebLoginStatus: 0 };
            const updatedDocument = await User.findByIdAndUpdate(user._id, `updateValues`, {
                new: true, // To return the updated document
            });

            const user_login = new user_logs({
                user_Id: user._id,
                login_status: "Panel Off In Web",
                role: user.Role,
                system_ip: getIPAddress()
            })
            await user_login.save();
        })
    }

}



// SERVICES TOKEN CREATE
const service_token_update = () => {

    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://margincalculator.angelbroking.com/OpenAPI_File/files/OpenAPIScripMaster.json',
        headers: {}
    };

    axios.request(config)
        .then((response) => {
            var Cash_stocks = []
            response.data.map(async (item) => {
                if (await item.exch_seg == "NSE") {
                    Cash_stocks.push(item)
                }
            });

            return Cash_stocks;

        })
        .catch((error) => {
            console.log(error);
        });

}

module.exports = { service_token_update }