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
var totalPosts = 0;

router.get('/home', function(req, res, next) {
	var collection = db.get('products');

	userCollection.findOne({ _id: req.session.passport.user}, 'email', function (err, result) {
			if (err) {
					console.log(err);
			}
			console.log(req.session.passport.user);
			console.log("result:", result);
			console.log("result.email",result.email);
			if (result.email === "auction.admin@auction.com") {
				collection.find({},function(err, products){
						if (err) {
							console.log(err);
						}
						//console.log(products);
						res.render('product/index', {products: products});
				});
			}
			else {
				collection.find({ delete_flag: false,	seller: { $ne: result.email }},function(err, products){
					if (err) {
						console.log(err);
					}
					console.log("collection count: ",products.length);
					totalPosts =products.length;
				});
				var currentPage = 1;
				var pLimit = 3; 
				var totalPages = totalPosts / pLimit;
				collection.find({ delete_flag: false,	seller: { $ne: result.email }}, {sort : { name : 1 } ,limit : pLimit, skip: (currentPage-1)*pLimit },function(err, products){
					if (err) {
							console.log(err);
						}
						console.log(products);
						res.render('product/index', {products: products, pages: totalPages, currentPage: currentPage, nextPage: (currentPage+1),  prevPage: (currentPage-1)});
				});
				//res.render('product/index', {products: products});
			}
	});
});

router.get('/home/:page', function(req, res, next) {
	console.log(req.params.page);
	var collection = db.get('products');

	userCollection.findOne({ _id: req.session.passport.user}, 'email', function (err, result) {
			if (err) {
					console.log(err);
			}
			console.log(req.session.passport.user);
			console.log("result:", result);
			console.log("result.email",result.email);
			if (result.email === "auction.admin@auction.com") {
				collection.find({},function(err, products){
						if (err) {
							console.log(err);
						}
						//console.log(products);
						res.render('product/index', {products: products});
				});
			}
			else {
				var currentPage = parseInt(req.params.page);
				if(currentPage <= 0) {
					currentPage = 1;
				}
				var pLimit = 3;
				var totalPages = Math.ceil(totalPosts / pLimit);
				if(currentPage > totalPages) {
					currentPage = totalPages;
				}
				collection.find({ delete_flag: false,	seller: { $ne: result.email }}, {sort : { name : 1 } ,limit : pLimit, skip: (currentPage-1)*pLimit },function(err, products){
					if (err) {
							console.log(err);
						}
						console.log(products);
						res.render('product/index', {products: products, pages: totalPages, currentPage: currentPage, nextPage: (currentPage+1),  prevPage: (currentPage-1)});
				});
				//res.render('product/index', {products: products});
				
			}
	});
});

// defining the route
router.get('/profile', isLoggedIn, function(req, res, next){
	res.render('user/profile');
});
function calculateTime(time_value) {
  var d = new Date();
  var m = d.getMinutes();
  var h = d.getHours();
  if(h == '0') {h = 24}

  var currentHour=h;
  var currentMin=m;


  // get input time
  var element = time_value;
  var time = element.split(":");
  var hour = time[0];
  if(hour == '00') {hour = 24}
  var min = time[1];

  var inputHour = hour;
  var inputMin = min;

  var totalHour = inputHour-currentHour;
  var totalMin = inputMin-currentMin;
  if (totalHour > 0)
  {
	  return 1;
  }
  else if(totalHour==0 && totalMin>0)
  {
	  return 1;
  }
  else
  {
	  return 0;
  }

}
router.get('/product/:id',isLoggedIn, function (req, res, next) {

    console.log("bid");
    console.log(req.params.id);
    prodCollection.findOne({ _id: req.params.id }, function (err, biditem) {
        if (err) console.log(err);
        console.log(biditem);
		  // get system local time



    if(calculateTime(biditem.timer)==1)
    {

        res.render('user/bid', { products: biditem, csrfToken: req.csrfToken() });

	}

  else
   {
	    res.render('user/finish');
   }
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
		if(calculateTime(biditem1.timer)==1)
		{
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
        res.redirect('/user/home');
        //res.render('user/bid', { products: biditem1, csrfToken: req.csrfToken() });
		}
		else
		{
			res.render('user/finish');
		}

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
        favCollection.find({ user: result.email, delete_flag: false, fav_flag: true }, function (err, products) {
            if (err) console.log(err);
            console.log('fav page');
            console.log(products);
            res.render('user/favourites', { products: products});
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
	collection.find({seller: result.email, delete_flag: false }, function(err, prod){
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
	successRedirect: '/user/home',
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
