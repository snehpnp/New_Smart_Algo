const mongoose = require('mongoose');

const servicesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,

    },
    instrument_token: {
        type: String,

    },
    zebu_token: {
        type: String,

    }, kotak_token: {
        type: String,

    },
    instrumenttype: {
        type: String,
    },
    exch_seg: {
        type: String,
    },
    lotsize: {
        type: String,
    },
    unique_column: {
        type: String,
        unique: true

    },
    categorie_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category"
      }

},{
    // This enables Mongoose to handle the _id field automatically
    strictPopulate: false,
    timestamps: true,
    _id: true,
  });

const Services = mongoose.model('Services', servicesSchema);
module.exports = Services;
