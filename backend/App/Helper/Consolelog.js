const fs = require('fs');
const path = require('path');


function logToFile(message) {
    const filePath = path.join(__dirname, 'app.log');  
    fs.appendFile(filePath, message + '\n', function (err) {
        if (err) {
            console.log('Error logging to file', err);
        }
    });
}



['log', 'error', 'warn', 'info', 'debug'].forEach(method => {
    const originalMethod = console[method];
    console[method] = function (...args) {
        const message = args.map(arg => (typeof arg === 'object' ? JSON.stringify(arg) : arg)).join(' ');
        if (method !== 'log') {  
            logToFile(message);  
        }
        originalMethod.apply(console, args);  
    };
});

module.exports = { logToFile };



// const { logToFile } = require('../Helper/Consolelog');
// logToFile(`TIME  ${new Date()} Connected to MongoDB`)