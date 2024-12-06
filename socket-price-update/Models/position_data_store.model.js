const { Schema, model } = require('mongoose');
//  const mongoose = require('mongoose');


const positionDataStoreSchema = Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "USER"
    },
    data: {
        type: Object,
        default: null   
    }
}, {
    // This enables Mongoose to handle the _id field automatically
    _id: true,
    timestamps: true
});

const position_data_store_data = model('position_data_store', positionDataStoreSchema);
module.exports = position_data_store_data;
