var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var schema = new Schema({
    prod_id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    timer: { type: String, required: true },
	date: {type: Date, required: true},
    amount: { type: Number, required: true },
    image: { type: String, required: true },
    seller: { type: String, required: true },
    user: { type: String, required: true },
    delete_flag: {type: Boolean, required: true},
    fav_flag: {type: Boolean, required: true}
});

module.exports = mongoose.model('Favourite', schema);
