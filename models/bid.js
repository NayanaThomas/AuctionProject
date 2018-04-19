var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var schema = new Schema({
    prod_id: { type: String, required:true },
    amount: { type: Number, required: true },
    buyer: { type: String, required: false }
});

module.exports = mongoose.model('Bid', schema);
