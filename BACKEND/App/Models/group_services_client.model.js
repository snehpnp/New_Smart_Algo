const { Schema, model } = require('mongoose');
//  const mongoose = require('mongoose');


const groupServices_clientSchema = Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: "USER"
    },
    groupService_id: {
        type: Schema.Types.ObjectId,
        ref: "serviceGroupName"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    // This enables Mongoose to handle the _id field automatically
    _id: true,
    timestamps: true
});

const groupService_User = model('groupServices_client', groupServices_clientSchema);
module.exports = groupService_User;
