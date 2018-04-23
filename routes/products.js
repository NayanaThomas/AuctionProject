var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var Product = require('../models/product');
// var Bid = require('../models/bid');
var passport = require('passport');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var multer = require('multer');
var url = 'mongodb://localhost:27017/auction';
mongoose.connect('mongodb://localhost:27017/auction');

var multerConf = {
    storage : multer.diskStorage({
    destination: function(req, file, next) {
      next(null, 'public/images')
    },
    filename: function(req, file, next) {
        var ext = file.mimetype.split('/')[1];
        next(null, file.fieldname + '-' + Date.now() + '.'+ext);
    }
}),
    fileFilter: function(req, file, next){
        if(!file) {
            next();
        }
        var image = file.mimetype.startsWith('image/');
        if(image){
            next(null,true);
        }
        else{
            //alert("File type not supported");
            next();
            //next({message:"File type not supported"},false);
        }
    }
};

/*router.post('/fileUpload', multer(multerConf).single('image'), function(req, res, next){
    if(req.file){
        req.body.image = req.file.filename;
    }
    const upload = new uploadSchema(req.body).save();
});
*/
var monk = require('monk');
var db = monk('localhost:27017/auction');
var userCollection = db.get('users');

router.get('/createproduct', isLoggedIn, function(req, res, next) {
	res.render('product/createproduct');
});

router.use( bodyParser.json() );       // to support JSON-encoded bodies
router.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));



router.post('/add', multer(multerConf).single('image'),function(req, res, next) {
    var usercollection = db.get('users');
    console.log("aution");
    console.log(req.session.passport.user);
    usercollection.findOne({_id: req.session.passport.user}, 'email', function(err, result){
        if (err) {
            console.log(err);
        }
        console.log(result.email);
        req.body.image = "/images/"+req.file.filename;
        req.body.seller = result.email;
        req.body.delete_flag = false;
        var myData = new Product(req.body);
         myData.save(function(err, result) {
            if (err) {
                res.redirect(backURL);

             }
            console.log("inserrted product");
            console.log(result);
            //var fav = db.get('favourites');
            //fav.find
            // var bid = new Bid({
            //     prod_id: result._id,
            //     amount: result.amount,
            //     buyer: ""
            // });
            // bid.save(function (err, resu) {
            //     if (err) {
            //         console.log(err);
            //     }
            //     console.log(resu);
            // });
            res.redirect('/user/userAuctionItems');
        });
    });
});

router.post('/delete/:id', isLoggedIn, function(req, res, next){
	var prodCollection = db.get('products');
  	var userCollection = db.get('users');
  	prodCollection.update( { _id: req.params.id },
  		{
  		  $set: { delete_flag: true }
  		},
  		function (err) {
  			if (err) console.log(err);
        	var favCollection = db.get('favourites');
        	favCollection.update( { prod_id: req.params.id },
      			{
      		  	$set: { delete_flag: true }
      			}, function(err){
            	if(err) console.log(err);
            	userCollection.findOne({_id: req.session.passport.user}, 'email', function(err, result){
      				if (err) {
      					console.log(err);
      				}
      				console.log(result.email);
      				prodCollection.find({seller: result.email, delete_flag: false }, function(err, prod){
      					if (err) throw err;
      					console.log("product");
      					console.log(prod);
      					res.render('user/userAuctionItems', {products: prod});
      				});
      	    	});
      	});
	});
});

router.post('/admin/delete/:id', isLoggedIn, function(req, res, next){
    var prodCollection = db.get('products');
    prodCollection.update( { _id: req.params.id },
        {
          $set: { delete_flag: true }
        },
        function (err) {
            if (err) console.log(err);
            var favCollection = db.get('favourites');
            favCollection.update( { prod_id: req.params.id },
                {
                $set: { delete_flag: true }
                }, function(err){
                if(err) console.log(err);
                res.redirect('/user/home');
                    
                
        });
    });
});


router.post('/search', isLoggedIn, function (req, res, next) {
    console.log(req.body);
    var collection = db.get('products');
    if (req.body.productname == '' && req.body.sel1 == 'All Categories') {
        userCollection.findOne({ _id: req.session.passport.user,  }, 'email', function (err, result) {
            if (err) {
                    console.log(err);
            }
            console.log(req.session.passport.user);
            console.log("result:", result);
            console.log("result.email",result.email);
            if (result.email === "auction.admin@auction.com") {
                collection.find({delete_flag: false},function(err, products){
                    if (err) {
                        console.log(err);
                    }
                        //console.log(products);
                    res.render('product/index', {products: products});
                });
            }
            else {
                collection.find({ delete_flag: false,   seller: { $ne: result.email } },function(err, products){
                    if (err) {
                        console.log(err);
                    }
                    //console.log(products);
                    res.render('product/index', {products: products});
                });
            }
        });
    }
    else if (req.body.productname != '' && req.body.sel1 == 'All Categories') {
        userCollection.findOne({ _id: req.session.passport.user,  }, 'email', function (err, result) {
            if (err) {
                    console.log(err);
            }
            console.log(req.session.passport.user);
            console.log("result:", result);
            console.log("result.email",result.email);
            if (result.email === "auction.admin@auction.com") {
                collection.find({delete_flag: false, name: new RegExp(req.body.productname, 'i')},function(err, products) {
                    if (err) {
                        console.log(err);
                    }
                        //console.log(products);
                    res.render('product/index', {products: products});
                });
            }
            else {
                collection.find({ delete_flag: false, name: new RegExp(req.body.productname, 'i'),  seller: { $ne: result.email } },function(err, products){
                    if (err) {
                        console.log(err);
                    }
                    //console.log(products);
                    res.render('product/index', {products: products});
                });
            }
        });
    }
    else if (req.body.productname == '' && req.body.sel1 != 'All Categories') {
       userCollection.findOne({ _id: req.session.passport.user,  }, 'email', function (err, result) {
            if (err) {
                    console.log(err);
            }
            console.log(req.session.passport.user);
            console.log("result:", result);
            console.log("result.email",result.email);
            if (result.email === "auction.admin@auction.com") {
                collection.find({ delete_flag: false, category: req.body.sel1, name: new RegExp(req.body.productname, 'i')},function(err, products){
                    if (err) {
                        console.log(err);
                    }
                        //console.log(products);
                    res.render('product/index', {products: products});
                });
            }
            else {
                collection.find({ delete_flag: false, category: req.body.sel1, name: new RegExp(req.body.productname, 'i'),  seller: { $ne: result.email } },function(err, products){
                    if (err) {
                        console.log(err);
                    }
                    //console.log(products);
                    res.render('product/index', {products: products});
                });
            }
        });
    }
    else {
        userCollection.findOne({ _id: req.session.passport.user,  }, 'email', function (err, result) {
            if (err) {
                    console.log(err);
            }
            console.log(req.session.passport.user);
            console.log("result:", result);
            console.log("result.email",result.email);
            if (result.email === "auction.admin@auction.com") {
                collection.find({ delete_flag: false, name: new RegExp(req.body.productname, 'i'), category: req.body.sel1},function(err, products){
                    if (err) {
                        console.log(err);
                    }
                        //console.log(products);
                    res.render('product/index', {products: products});
                });
            }
            else {
                collection.find({ delete_flag: false,  name: new RegExp(req.body.productname, 'i'), category: req.body.sel1, seller: { $ne: result.email } },function(err, products){
                    if (err) {
                        console.log(err);
                    }
                    //console.log(products);
                    res.render('product/index', {products: products});
                });
            }
    });

    }
});


router.post('/userauction/search', isLoggedIn, function (req, res, next) {
    console.log(req.body);
    var collection = db.get('products');
    if (req.body.productname == '' && req.body.sel1 == 'All Categories') {
        userCollection.findOne({ _id: req.session.passport.user,  }, 'email', function (err, result) {
            if (err) {
                    console.log(err);
            }
            console.log(req.session.passport.user);
            console.log("result:", result);
            console.log("result.email",result.email);
            if (result.email === "auction.admin@auction.com") {
                collection.find({delete_flag: false},function(err, products){
                    if (err) {
                        console.log(err);
                    }
                        //console.log(products);
                    res.render('user/userAuctionItems', {products: products});
                });
            }
            else {
                collection.find({ delete_flag: false,   seller: result.email },function(err, products){
                    if (err) {
                        console.log(err);
                    }
                    //console.log(products);
                    res.render('user/userAuctionItems', {products: products});
                });
            }
        });
    }
    else if (req.body.productname != '' && req.body.sel1 == 'All Categories') {
        userCollection.findOne({ _id: req.session.passport.user,  }, 'email', function (err, result) {
            if (err) {
                    console.log(err);
            }
            console.log(req.session.passport.user);
            console.log("result:", result);
            console.log("result.email",result.email);
            if (result.email === "auction.admin@auction.com") {
                collection.find({delete_flag: false},function(err, products) {
                    if (err) {
                        console.log(err);
                    }
                        //console.log(products);
                    res.render('user/userAuctionItems', {products: products});
                });
            }
            else {
                collection.find({ delete_flag: false, name: new RegExp(req.body.productname, 'i'),  seller: result.email },function(err, products){
                    if (err) {
                        console.log(err);
                    }
                    //console.log(products);
                    res.render('user/userAuctionItems', {products: products});
                });
            }
        });
    }
    else if (req.body.productname == '' && req.body.sel1 != 'All Categories') {
       userCollection.findOne({ _id: req.session.passport.user,  }, 'email', function (err, result) {
            if (err) {
                    console.log(err);
            }
            console.log(req.session.passport.user);
            console.log("result:", result);
            console.log("result.email",result.email);
            if (result.email === "auction.admin@auction.com") {
                collection.find({ delete_flag: false},function(err, products){
                    if (err) {
                        console.log(err);
                    }
                        //console.log(products);
                    res.render('user/userAuctionItems', {products: products});
                });
            }
            else {
                collection.find({ delete_flag: false, category: req.body.sel1, name: new RegExp(req.body.productname, 'i'),  seller: result.email },function(err, products){
                    if (err) {
                        console.log(err);
                    }
                    //console.log(products);
                    res.render('user/userAuctionItems', {products: products});
                });
            }
        });
    }
    else {
        userCollection.findOne({ _id: req.session.passport.user,  }, 'email', function (err, result) {
            if (err) {
                    console.log(err);
            }
            console.log(req.session.passport.user);
            console.log("result:", result);
            console.log("result.email",result.email);
            if (result.email === "auction.admin@auction.com") {
                collection.find({ delete_flag: false},function(err, products){
                    if (err) {
                        console.log(err);
                    }
                        //console.log(products);
                    res.render('user/userAuctionItems', {products: products});
                });
            }
            else {
                collection.find({ delete_flag: false,  name: new RegExp(req.body.productname, 'i'), category: req.body.sel1, seller: result.email },function(err, products){
                    if (err) {
                        console.log(err);
                    }
                    //console.log(products);
                    res.render('user/userAuctionItems', {products: products});
                });
            }
    });

    }
});


router.post('/favourites/search', isLoggedIn, function (req, res, next) {
    console.log(req.body);
    var collection = db.get('products');
    var favCollection = db.get('favourites');
    if (req.body.productname == '' && req.body.sel1 == 'All Categories') {
        userCollection.findOne({ _id: req.session.passport.user,  }, 'email', function (err, result) {
            if (err) {
                    console.log(err);
            }
            console.log(req.session.passport.user);
            console.log("result:", result);
            console.log("result.email",result.email);
            if (result.email === "auction.admin@auction.com") {
                favCollection.find({ user: result.email, delete_flag: false, fav_flag: true }, function (err, products) {
                    if (err) console.log(err);
                    console.log('fav page');
                    console.log(products);
                    res.render('user/favourites', { products: products});
                 });
            }
            else {
                favCollection.find({ user: result.email, delete_flag: false, fav_flag: true  },function(err, products){
                    if (err) {
                        console.log(err);
                    }
                    //console.log(products);
                    res.render('user/favourites', { products: products});
                });
            }
        });
    }
    else if (req.body.productname != '' && req.body.sel1 == 'All Categories') {
        userCollection.findOne({ _id: req.session.passport.user,  }, 'email', function (err, result) {
            if (err) {
                    console.log(err);
            }
            console.log(req.session.passport.user);
            console.log("result:", result);
            console.log("result.email",result.email);
            if (result.email === "auction.admin@auction.com") {
                favCollection.find({user: result.email, delete_flag: false, fav_flag: true, name: new RegExp(req.body.productname, 'i')},function(err, products) {
                    if (err) {
                        console.log(err);
                    }
                        //console.log(products);
                    res.render('user/userAuctionItems', {products: products});
                });
            }
            else {
                favCollection.find({ user: result.email, delete_flag: false, fav_flag: true, name: new RegExp(req.body.productname, 'i')},function(err, products){
                    if (err) {
                        console.log(err);
                    }
                    //console.log(products);
                    res.render('user/favourites', {products: products});
                });
            }
        });
    }
    else if (req.body.productname == '' && req.body.sel1 != 'All Categories') {
       userCollection.findOne({ _id: req.session.passport.user,  }, 'email', function (err, result) {
            if (err) {
                    console.log(err);
            }
            console.log(req.session.passport.user);
            console.log("result:", result);
            console.log("result.email",result.email);
            if (result.email === "auction.admin@auction.com") {
                favCollection.find({ delete_flag: false},function(err, products){
                    if (err) {
                        console.log(err);
                    }
                        //console.log(products);
                    res.render('user/favourites', {products: products});
                });
            }
            else {
                favCollection.find({ delete_flag: false, category: req.body.sel1, name: new RegExp(req.body.productname, 'i')},function(err, products){
                    if (err) {
                        console.log(err);
                    }
                    //console.log(products);
                    res.render('user/favourites', {products: products});
                });
            }
        });
    }
    else {
        userCollection.findOne({ _id: req.session.passport.user,  }, 'email', function (err, result) {
            if (err) {
                    console.log(err);
            }
            console.log(req.session.passport.user);
            console.log("result:", result);
            console.log("result.email",result.email);
            if (result.email === "auction.admin@auction.com") {
                favCollection.find({ user: result.email, delete_flag: false, fav_flag: true},function(err, products){
                    if (err) {
                        console.log(err);
                    }
                        //console.log(products);
                    res.render('user/favourites', {products: products});
                });
            }
            else {
                favCollection.find({ user: result.email, delete_flag: false, fav_flag: true,  name: new RegExp(req.body.productname, 'i'), category: req.body.sel1},function(err, products){
                    if (err) {
                        console.log(err);
                    }
                    //console.log(products);
                    res.render('user/favourites', {products: products});
                });
            }
    });

    }
});



function isLoggedIn(req, res, next) {
    if (req.user) {
        return next();
    }
    else{
        res.redirect('user/home');
    }

}

function isnotLoggedIn(req, res, next) {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.redirect('user/home');
}


module.exports = router;
