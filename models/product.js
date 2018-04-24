var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var schema = new Schema({
	name: {type: String, required: true},
	description: {type: String, required: true},
	category: {type: String, required: true},
	timer: {type: String, required: true},
	date: {type: Date, required: true},
	amount: {type: Number, required: true},
	image: {type: String, required: true},
	seller: {type: String, required: true},
  buyer: {type: String, required: false},
  delete_flag: {type: Boolean, required: true}
	// bid_finish: {type: Boolean, required:true}
});

module.exports = mongoose.model('product',schema);
