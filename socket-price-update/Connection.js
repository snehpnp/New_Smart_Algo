const mongoose = require('mongoose');
const {Alice_Socket} = require("./Alicesocket");

const connectToMongoDB = async () => {
  const uri = process.env.MONGO_URI; 

  try {
    await mongoose.connect(uri);
    console.log('MongoDB connected successfully');
    Alice_Socket();
  } catch (error) {
    console.log('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

module.exports = { connectToMongoDB };
