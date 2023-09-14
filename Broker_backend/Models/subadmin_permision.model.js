const mongoose = require('mongoose');

const Subadmin_Permission_Schema = new mongoose.Schema({

    client_add: {
        type: Number,
        enum: [0, 1, 2],  //0 = DEMO , 1 = LIVE , 2= 2DAYS
        default: 0
    },
    go_To_Dashboard: {
        type: Number,
        enum: [0, 1],   // 0 = NOT ACTIVE GO TO DASHBOARD  , 1 = ACTIVE GO TO DASHBOARD 
        default: 0
    },
    trade_history_old: {
        type: Number,
        enum: [0, 1],   // 0 == OLD VIEW ON  , 1 = ONLY TODAY VIEW 
        default: 0
    },
    client_activation: {
        type: Number,
        enum: [0, 1], // 0 = ONLY ADMIN ACTIVATE , 1= DIRECT ACTIVATE
        default: 0
    },
    strategy: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'strategy',
            default: null
        }
    ],
    group_services: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'group_services',
            default: null
        }
    ],
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        default: null
    },
}, {
    _id: true,
    timestamps: true
});

const Subadmin_Permission = mongoose.model('subadmin_permission', Subadmin_Permission_Schema);
module.exports = Subadmin_Permission;
