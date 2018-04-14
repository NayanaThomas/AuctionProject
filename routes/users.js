var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var monk = require('monk');
// var angular = require('angular');
var csrfProtection = csrf();
router.use(csrfProtection);
var url = require('url');

var db = monk('localhost:27017/auction');

// defining the route
router.get('/profile', isLoggedIn, function(req, res, next){
	res.render('user/profile');
});

router.get('/favourites/:id',  isLoggedIn, function(req, res, next) {
	var userCollection = db.get('users');
	// var prodCollection = db.get('products');
	userCollection.update({ seller: 'tes.test@gmail.com' },'favourites' , function(err, productIds){
			if (err) throw err;
			// res.send(productIds);
			res.render('user/favourites', {products: productIds});
	});
});

router.get('/userAuctionItems',  isLoggedIn, function(req, res, next) {
	var collection = db.get('products');
	collection.find({ seller: req.session.passport.user }, function(err, products){
			if (err) throw err;
		res.render('user/userAuctionItems', {products: products});
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
	successRedirect: '/user/profile',
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

