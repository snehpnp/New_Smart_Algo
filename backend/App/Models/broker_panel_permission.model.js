const mongoose = require('mongoose');

const { Schema, model } = require('mongoose');
const brokerPermissionSchema =  Schema({
    panel_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "All_panels"
    },
    strategy_id: {
        type: String,
        enum: ['0', '1'],
        default: '0'
    },
  
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    
    _id: true,
    timestamps: true
});

const brokerPermission =model('broker_permission', brokerPermissionSchema);
module.exports = brokerPermission;
