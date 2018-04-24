var Category = require('../models/category');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/auction');
var categories = [ new Category({
	name: 'Electronics'
}),
	new Category({
	name: 'Books'
}),
	new Category({
	name: 'Pet Supplies'
}),
	new Category({
	name: 'Pottery, Porcelain & Glass'
}),
	new Category({
	name: 'Sound & Vision'
}),
	new Category({
	name: 'Sporting Goods'
}),
	new Category({
	name: 'Toys & Games'
}),
	new Category({
	name: 'Vehicle Parts & Accessories'
}),
	new Category({
	name: 'Travel Gears'
}),
	new Category({
	name: 'Hand Made'
}),
	new Category({
	name: 'Office Products'
}),
	new Category({
	name: 'Luxuary beauty'
}),
	new Category({
	name: 'Others'
})
];

var done =0;
for(var i=0;i<categories.length;i++) {
	categories[i].save(function(err,result) {
		done++;
		if(done === categories.length) {
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
