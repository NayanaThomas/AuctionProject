var express = require('express');
var router = express.Router();
var monk = require('monk');
var db = monk('localhost:27017/auction');
var mongoose = require('mongoose');
var Favourite = require('../models/favourite');
var Products   = require('../models/product');
var prodCollection = db.get('products');
var userCollection = db.get('users');
var favCollection = db.get('favourites');

/* GET home page. */

//router.get('/:page', function (req, res, next) {
//    var perPage = 1
//    var page = req.params.page || 1
//    var collection = db.get('products');

//    collection
//        .find({})
//        .skip((perPage * page) - perPage)
//        .limit(perPage)
//        .exec(function (err, products) {
//            collection.count().exec(function (err, count) {
//                if (err) return next(err)
//                res.render('product/index', {
//                    products: products,
//                    current: page,
//                    pages: Math.ceil(count / perPage)
//                })
//            })
//        })
//})


router.get('/', function(req, res, next) {
	res.render('layouts/main');
});





router.post('/favourites/:id',  isLoggedIn, function(req, res){

	var id = req.params.id;
	console.log(id);
	console.log("fav");
	prodCollection.findOne({ _id: id, delete_flag: false }, function(err, products){
			if (err) {
                console.log(err);
                throw err;
			}
            userCollection.findOne({ _id: req.session.passport.user }, 'email', function (err, result) {
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
                    user: result.email,
					delete_flag: products.delete_flag,
					fav_flag: true
                });
				console.log("favourite", favourite);
                favCollection.findOne({
                    prod_id: id,
                    user: result.email
                }, '_id', function (err, resul) {
                    if (err) console.log(err);
                    //console.log(res);
                    if (resul === null) {
                        favourite.save(function (err) {
                            if (err) console.log(err);
														console.log(resul);
                           // res.render('/');
                        })

                        //res.render('/');
                    }
                    else {
                        favCollection.update( { prod_id: id },
                        {
                            $set: { fav_flag: true }
                        },
                        function (err) {
                            if (err) console.log(err);
                            console.log(result);

                        });
                    }
                    //res.render('/');
                });
            });
            res.redirect('/user/home');
	});
});

router.post('/unfavourite/:id', isLoggedIn, function (req, res, next) {

    var id = req.params.id;
    console.log(id);
    console.log("unfav");
    favCollection.update({ _id: id },
			{  $set: { fav_flag: false }
			}, function (err) {
        if (err) console.log(err);
        userCollection.findOne({ _id: req.session.passport.user }, 'email', function (err, result) {
            if (err) {
                console.log(err);
            }
            favCollection.find({ user: result.email, delete_flag: false, fav_flag:true }, function (err, products) {
                if (err) console.log(err);

                res.render('user/favourites', { products: products  });
            });

        });

    });
});

function isLoggedIn(req, res, next) {
    if (req.user) {
        return next();
    }
    else {
        res.redirect('/');
    }

}

function isnotLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}




module.exports = router;
