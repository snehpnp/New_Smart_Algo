const mongoose = require('mongoose');

const HelpCenterSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "USER"

    },
    admin_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "USER"
    },
    help_msg: {
        type: String,
        // required: true,
        default: null

    },
    mobile: {
        type: String,
        default: null

    },
    email: {
        type: String,
        default: null
    },
    fullname: {
        type: String,
        default: null
    },
    username: {
        type: String,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},
 {
    strictPopulate: false,
    timestamps: true,
    _id: true,
});

const HelpCenter = mongoose.model('Helpcenter', HelpCenterSchema);
module.exports = HelpCenter;
