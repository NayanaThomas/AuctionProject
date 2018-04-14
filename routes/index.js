var express = require('express');
var router = express.Router();
var monk = require('monk');
var db = monk('localhost:27017/auction');
var mongoose = require('mongoose');

var Products   = require('../models/product');


/* GET home page. */
router.get('/', function(req, res, next) {
	Products.find(function(err, docs) {
		var productsChunks = [];
		var chunkSize = 7;
		for(var i=0;i<docs.length;i+=chunkSize) {
			productsChunks.push(docs.slice(i,i+ chunkSize));
		}
		res.render('product/index', { title: 'Online Auction',products: productsChunks});
	});
}); 

router.get('/favourites/:id',  function(req, res, next){
	var prodCollection = db.get('products');
	var id = req.params.id;
	// console.log(id);
	console.log("fav");
	prodCollection.find({ _id: id }, function(err, products){
			if (err) {
				console.log(err);
			}
			console.log(products);
			// res.render('product/index', {products:products});
			res.redirect('/');
	});
});


module.exports = router;
  