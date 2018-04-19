var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var Product = require('../models/product');
var Bid = require('../models/bid');
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
            var bid = new Bid({
                prod_id: result._id,
                amount: result.amount,
                buyer: ""
            });
            bid.save(function (err, resu) {
                if (err) {
                    console.log(err);
                }
                console.log(resu);
            });








            res.redirect('/');
        });
    });
});

router.post('/search', isLoggedIn, function (req, res, next) {
    console.log(req.body);
    var collection = db.get('products');
    if (req.body.productname == '' && req.body.sel1 == 'All Categories') {
        collection.find({}, function (err, products) {
            if (err) {
                console.log(err);
            }
            console.log(products);
            res.render('product/index', { products: products });
        });
    }
    else if (req.body.productname != '' && req.body.sel1 == 'All Categories') {
        collection.find({ name: new RegExp(req.body.productname, 'i') }, function (err, prod) {
            if (err) throw err;
            console.log("product");
            console.log(prod);
            res.render('product/index', { products: prod });
        });
    }
    else if (req.body.productname == '' && req.body.sel1 != 'All Categories') {
        collection.find({ category: req.body.sel1 }, function (err, prod) {
            if (err) throw err;
            console.log("product");
            console.log(prod);
            res.render('product/index', { products: prod });
        });

    }
    else {
        collection.find({ name: new RegExp(req.body.productname, 'i'), category: req.body.sel1 }, function (err, prod) {
            if (err) throw err;
            console.log("product");
            console.log(prod);
            res.render('product/index', { products: prod });
        });

    }
});

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
