var Product = require('../models/product');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/auction');
var products = [ new Product({
	name: 'Television',
	description: 'brand new',
	category: 'electronics',
	timer: '90s',
	amount: 700, 
	image: '/images/tv.jpg',
	seller: 'nayana.thomas@outlook.com'
}),
	new Product({
	name: 'Wrist Watch',
	description: 'brand new2',
	category: 'electronics',
	timer: '90s',
	amount: 15,
	image: '/images/watch.jpg',
	seller: 'nayana.thomas@outlook.com'
}),
	new Product({
	name: 'Table',
	description: 'brand new',
	category: 'Furniture',
	timer: '90s',
	amount: 25,
	image: '/images/table.jpg',
	seller: 'nayana.thomas@outlook.com'
}),
	new Product({
	name: 'Earphones',
	description: 'brand new2',
	category: 'Electronics',
	timer: '90s',
	amount: 12,
	image: '/images/earphones.jpg',
	seller: 'nayana.thomas@outlook.com'
})
];

var done =0;
for(var i=0;i<products.length;i++) {
	products[i].save(function(err,result) {
		done++;
		if(done === products.length) {
			exit();
		}
	});
}

// get the user starlord55
/*createProduct.findOneAndRemove({ name: 'dryer' }, function(err, user) {
  if (err) throw err;

  
    console.log('product successfully deleted!');
  
});
*/

function exit() {
	mongoose.disconnect();
}