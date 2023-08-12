const { Schema, model } = require('mongoose');

const serviceGroup_services_id = Schema({
    Servicegroup_id: {
        type: String,
        required: true,
        trim: true,
        default: null
    },
    Service_id: {
        type: String,
        required: true,
        trim: true,
        default: null
    },
    group_qty: {
        type: Number,  // Change the data type to Number
        default: 0
    },
    unique_column: {
        type: String,
        unique: true,
    }
        
    
},
    {
        timestamps: true
    },

)
const serviceGroup_services_id_model = model('serviceGroup_services_id', serviceGroup_services_id);



module.exports = serviceGroup_services_id_model;

