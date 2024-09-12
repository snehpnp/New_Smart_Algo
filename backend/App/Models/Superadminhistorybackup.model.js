const mongoose = require('mongoose');

const SuperadminHistorySchema = new mongoose.Schema({
    backup_id: {
        type: String,
        default: null
    },
    superadmin_name: {
        type: String,
        default: null
    },
    panal_name: {
        type: String,
        default: null
    },
    client_id: {
        type: String,
        default: null
    },
    msg: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},
    {
        timestamps: true,
        _id: true,
    });

var SuperadminHistoryBackup = mongoose.model('Superadmin_History_bacup', SuperadminHistorySchema);
module.exports = SuperadminHistoryBackup;
