var express = require('express');
var router = express.Router();
var monk = require('monk');
var db = monk('localhost:27017/auction');
var mongoose = require('mongoose');
var Favourite = require('../models/favourite');
var Products   = require('../models/product');
var prodCollection = db.get('products');
var usercollection = db.get('users');
var favCollection = db.get('favourites');


/* GET home page. */


router.get('/', function(req, res, next) {

	var collection = db.get('products');
	collection.find({},function(err, products){
		if (err) {
			console.log(err);
		}
		res.render('product/index', {products: products});
    });
});



/*router.get('/:page', function(req, res, next) {
    console.log('page number : ' + req.params.page); 
    console.log('per page : 3');
    var pageNo = req.params.page ; // parseInt(req.query.pageNo)
    var size = '3';
    if (pageNo < 0 || pageNo === 0) {
        response = { "error": true, "message": "invalid page number, should start with 1" };
        return res.json(response);
    }
    var skip1 = size * (pageNo - 1);
    var limit1 = size;
    var query = {limit: limit1, skip: skip1, sort: "'name' 'asc'"};
    
    var collection = db.get('products');
    collection.find({query},function(err, products){
        if (err) {
            console.log(err);
        }
        res.render('product/index', {products: products});
    });
});
*/

router.post('/favourites/:id',  function(req, res, next){
	
	var id = req.params.id;
	console.log(id);
	console.log("fav");
	prodCollection.findOne({ _id: id }, function(err, products){
			if (err) {
                console.log(err);
                throw err;
			}
			//console.log(products);
			// res.render('product/index', {products:products});
            
            usercollection.findOne({ _id: req.session.passport.user }, 'email', function (err, result) {
                if (err) {
                    console.log(err);
                }

                var favourite = new Favourite({
                    prod_id: id,
                    name: products.name,
                    description: products.description,
                    category: products.category,
                    timer: products.timer,
                    amount: products.amount,
                    image: products.image,
                    seller: products.seller,
                    user: result.email
                });
                
                favCollection.findOne({
                    prod_id: id,
                    user: result.email
                }, '_id', function (err, res) {
                    if (err) console.log(err);
                    //console.log(res);
                    if (res === null) {
                        favourite.save(function (err) {
                            if (err) console.log(err);
                            res.render('/');
                        });
                    }
                });
                 res.redirect('/');
            });
			
	});
});




module.exports = router;
  