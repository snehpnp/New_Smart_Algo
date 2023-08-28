const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
    panel_name: {
        type: String,
        required: true,
        unique: true
    },
    panel_key: {
        type: String,
        required: true
    },
    prefix: {
        type: String,
        required: true,
        unique: true
    },
    domain_url: {
        type: String,
        required: true
    },
    domain_url_https: {
        type: String,
        required: true
    },
    broker_url: {
        type: String,
        required: true
    },
    theme_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'theme_list',
        default: null
    },
    theme_name: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
},{
    // This enables Mongoose to handle the _id field automatically
    _id: true,
  });

const company = mongoose.model('company', CompanySchema);
module.exports = company;
