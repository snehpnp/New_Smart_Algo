const mongoose = require('mongoose');

const timeFrameSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,

    },
    value: {
        type: String,
        required: true,
    }

},{
    // This enables Mongoose to handle the _id field automatically
    strictPopulate: false,
    timestamps: true,
    _id: true,
  });

const TimeFrame = mongoose.model('timeFrame', timeFrameSchema);
module.exports = TimeFrame;
