var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var Product = require('../models/product');
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
    req.body.image = "/images/"+req.file.filename;
    var myData = new Product(req.body);
    myData.save(function(err) {
        if (err) {
            res.redirect(backURL);
        }
        res.redirect('/');
    });

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
