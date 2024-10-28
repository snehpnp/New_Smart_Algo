// helper.js

let io;

// Function to set io
const setIO = async (ioObject) => {
    io = ioObject;
};

// Function to get io
const getIO = async () => {
 
    return io;
};

module.exports = { setIO, getIO };