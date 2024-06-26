const mongoose = require('mongoose');

const StoreAllRedisKeySchema = new mongoose.Schema({
    key_symbol: {
        type: String,
        required: true,
        index: true
    },
    
}, {
    // This enables Mongoose to handle the _id field automatically
    _id: true,
});

const store_all_redis_key = mongoose.model('store_all_redis_key', StoreAllRedisKeySchema);
module.exports = store_all_redis_key;
