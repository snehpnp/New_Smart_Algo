const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');

const serviceGroup_services_id = Schema({
    Servicegroup_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'serviceGroupName',
        index: true
    },
 
    Service_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Services"
      },
    group_qty: {
        type: Number,  // Change the data type to Number
        default: 0
    },
    unique_column: {
        type: String,
        unique: true,
    },

},
    {
        timestamps: true
    },

)
const serviceGroup_services_id_model = model('serviceGroup_services_id', serviceGroup_services_id);



module.exports = serviceGroup_services_id_model;

