const { createLogger, format, transports } = require('winston');
const fs = require('fs');
const {formattedDateTime} = require('../Helper/time.helper')
const logFilePath = 'activity.log'; // Replace 'activity.log' with the desired log file path

// Create a logger instance
const logger = createLogger({
    level: 'info', // Set the minimum log level (e.g., 'info', 'debug', 'error')
    format: format.combine(
        format.timestamp(),
        format.printf(({ timestamp, level, message, ...data }) => {
            return `{time:"${formattedDateTime}" ,type:${level.toUpperCase()},Role:"${data.role}",user_id:"${data.user_id}", msg:"${message}"}`;
        })
    ),
    transports: [
        new transports.Console(), // Log to the console (you can remove this if not needed)
        new transports.File({ filename: logFilePath }), // Log to the specified file
    ],
});


module.exports = {logger}