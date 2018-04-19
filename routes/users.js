var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var monk = require('monk');
var bodyParser = require('body-parser');
var csrfProtection = csrf();
router.use(csrfProtection);
var url = require('url');


var db = monk('localhost:27017/auction');
var prodCollection = db.get('products');

var favCollection = db.get('favourites');
var bidCollection = db.get('bids');
var userCollection = db.get('users');
router.use(bodyParser.urlencoded({ extended: true }));

// defining the route
router.get('/profile', isLoggedIn, function(req, res, next){
	res.render('user/profile');
});

router.get('/product/:id',isLoggedIn, function (req, res, next) {
    
    console.log("bid");
    console.log(req.params.id);
    prodCollection.findOne({ _id: req.params.id }, function (err, biditem) {
        if (err) console.log(err);
        console.log(biditem);
        res.render('user/bid', { products: biditem, csrfToken: req.csrfToken() });
    });
    
});


router.post('/product/:id', isLoggedIn, function (req, res, next) {
    console.log("bid post");
    console.log(req.params.id);
    console.log(req.body.amount);

    prodCollection.findOne({ _id: req.params.id }, function (err, biditem1) {
        if (err) {
            console.log(err);
        }
        console.log(biditem1);
        console.log("compare values");
        console.log("biditem1.amount", biditem1.amount);
        console.log("req.body.amount", req.body.amount);
 		console.log(parseInt(biditem1.amount) < parseInt(req.body.amount));
 		if (parseInt(biditem1.amount) < parseInt(req.body.amount)) {
 			console.log("compare values");
 			console.log(biditem1.amount < req.body.amount);
            prodCollection.update({ _id: req.params.id }, {
                $set: {
                    amount: req.body.amount,
                    buyer: req.session.passport.user
                }
            }, function (err, result) {
                if (err) console.log(err);
                console.log(result);

            });
        }
        res.redirect('/');
        //res.render('user/bid', { products: biditem1, csrfToken: req.csrfToken() });
    });
});


router.get('/favourites_page',  isLoggedIn, function(req, res, next) {
	var userCollection = db.get('users');
	var favCollection = db.get('favourites');
    userCollection.findOne({ _id: req.session.passport.user }, 'email', function (err, result) {
        if (err) {
            console.log(err);
        }
        console.log(result.email);
        favCollection.find({ user: result.email }, function (err, products) {
            if (err) console.log(err);
            console.log('fav page');
            console.log(products);
            res.render('user/favourites', { products: products });
        });
        
    });
});

router.get('/userAuctionItems',  isLoggedIn, function(req, res, next) {
	var collection = db.get('products');
	var usercollection = db.get('users');
	console.log("aution");
	console.log(req.session.passport.user);
usercollection.findOne({_id: req.session.passport.user}, 'email', function(err, result){
	if (err) {
		console.log(err);
	}
	console.log(result.email);
	collection.find({seller: result.email }, function(err, prod){
				if (err) throw err;
				console.log("product");
				console.log(prod);
				res.render('user/userAuctionItems', {products: prod});
		});
});
});

router.get('/logout', isLoggedIn, function(req, res, next) {
	req.logout();
	res.redirect('/');
});

router.use('/', isnotLoggedIn, function(req, res, next) {
	next();
});

router.get('/signup', function(req, res, next) {
	var messages = req.flash('error');
	res.render('user/signup',{csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length>0});
});

router.post('/signup', passport.authenticate('local.signup', {
	successRedirect: '/user/profile',
	failureRedirect: '/user/signup',
	failureFlash: true
}));

router.get('/signin', function(req, res, next) {
	var messages = req.flash('error');
	res.render('user/signin',{csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length>0});

});
router.post('/signin', passport.authenticate('local.signin', {
	successRedirect: '/',
	failureRedirect: '/user/signin',
	failureFlash: true
}));

function isLoggedIn(req, res, next) {
	if (req.user) {
		return next();
	}
	else{
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

