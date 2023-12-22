const { createLogger, format, transports } = require('winston');
const fs = require('fs');
const {formattedDateTime} = require('../Helper/time.helper')
const logFilePath = 'Logs/activity.log'; // Replace 'activity.log' with the desired log file path
const logFilePath1 = 'Logs/admin.log'; // Replace 'activity.log' with the desired log file path

const os = require('os');


// Create a logger instance
const logger = createLogger({
    level: 'info', // Set the minimum log level (e.g., 'info', 'debug', 'error')
    format: format.combine(
        format.timestamp(),
        format.printf(({ timestamp, level, message, ...data }) => {
            return `{Ip:"${getIPAddress()}", time:"${formattedDateTime}" ,type:${level.toUpperCase()},Role:"${data.role}",user_id:"${data.user_id}", msg:"${message}"}`;
        })
    ),
    transports: [
        // new transports.Console(), // Log to the console (you can remove this if not needed)
        new transports.File({ filename: logFilePath }), // Log to the specified file
    ],
});

// Create a logger instance
const logger1 = createLogger({
  level: 'info', // Set the minimum log level (e.g., 'info', 'debug', 'error')
  format: format.combine(
      format.timestamp(),
      format.printf(({ timestamp, level, message, ...data }) => {
          return `{Ip:"${getIPAddress()}", time:"${formattedDateTime}" ,type:${level.toUpperCase()},Role:"${data.role}",user_id:"${data.user_id}", msg:"${message}"}`;
      })
  ),
  transports: [
      new transports.Console(), // Log to the console (you can remove this if not needed)
      new transports.File({ filename: logFilePath1 }), // Log to the specified file
  ],
});


const getIPAddress = () => {
  const interfaces = os.networkInterfaces();
  let ipAddress = '';

  for (const networkInterface of Object.values(interfaces)) {
    for (const networkInfo of networkInterface) {
      if (networkInfo.family === 'IPv4' && !networkInfo.internal) {
        ipAddress = networkInfo.address;
        break;
      }
    }
  }

  return ipAddress;
};




module.exports = {logger,logger1,getIPAddress}



