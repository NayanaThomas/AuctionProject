var Pagination = require('../index.js');

describe('Check all the pages of pagination', function(){
	var numTest = 22;
	it('Check 1 to ' + numTest + ' pageActual', function(){
		for (var i = 0; i<=numTest; ++i) {
			var pag = new Pagination('search', i, numTest * 10, 10, {maxPagination:10});
			var result = pag.getPagination();
			expect(result).to.be.a('array');
			//check the length of results
			expect(result).to.have.length(10);
		}
	});
});

describe('Check the options of pagination', function() {
	it('Check basic pagination', function(){
		var pag = new Pagination('search', 1, 100, 10);
		var result = pag.getPagination();
		expect(result).to.be.a('array');
		//check the length of results
		expect(result).to.have.length(10);
		//check if the actual pages is marked
		expect(result[0]).to.have.property('actualPage').with.equal(true);
	});
	it('Check void pagination', function(){
		var pag = new Pagination('search', 1, 0, 10);
		var result = pag.getPagination();
		expect(result).to.be.a('array');
		//check the length of results
		expect(result).to.have.length(0);
	});
	it('Check basic option maxPagination', function(){
		var pag = new Pagination('search', 1, 150, 10, {maxPagination:10});
		var result = pag.getPagination();
		//check the length of results
		expect(result).to.have.length(10);
	});
	it('Check basic option with actual page = 3 maxPagination', function(){
		var pag = new Pagination('search', 3, 150, 10, {maxPagination:10});
		var result = pag.getPagination();
		//check the length of results
		expect(result).to.have.length(10);
		//check if the actual pages is marked
		expect(result[2]).to.have.property('actualPage').with.equal(true);
	});
	it('Check extended option maxPagination', function(){
		var pag = new Pagination('search', 8, 150, 10, {maxPagination:10});
		var result = pag.getPagination();
		//check the length of results
		expect(result).to.have.length(10);

		//check if the actual pages is marked
		expect(result[5]).to.have.property('actualPage').with.equal(true);
	});
	it('Check extended option maxPagination, the finish is near', function(){
		var pag = new Pagination('search', 14, 150, 10, {maxPagination:10});
		var result = pag.getPagination();
		//check the length of results
		expect(result).to.have.length(10);
		//check if the actual pages is marked
		expect(result[8]).to.have.property('actualPage').with.equal(true);
	});
	it('Check extended option maxPagination, the finish is here', function(){
		var pag = new Pagination('search', 15, 150, 10, {maxPagination:10});
		var result = pag.getPagination();
		//check the length of results
		expect(result).to.have.length(10);
		//check if the actual pages is marked
		expect(result[9]).to.have.property('actualPage').with.equal(true);
	});
	it('Check decimals for maxPagination results', function(){
		var pag = new Pagination('search', 0, 4651, 10, {maxPagination:13, showBeginingEnd:true});
		var result = pag.getPagination();
		for(var i =0; i< result.length; ++i){
			var index = result[i].index;
			var strIndex = index.toString();
			expect(strIndex).not.include('.');
		}

	});
	it('Check negative number for maxPagination index', function(){
		var pag = new Pagination('search', 3, 141, 13, {maxPagination:13});
		var result = pag.getPagination();
		if(result[0].index < 0){
			done(new Error('Negative number for index'));
		}
		else{
		}
	});
	it('Check first last button', function(){
		var pag = new Pagination('search', 15, 150, 10, {showBeginingEnd:true});
		var result = pag.getPagination();
		//check the length of results
		expect(result).to.have.length(17);
		//check if the actual pages is marked
		expect(result[0]).to.have.property('specialButton').with.equal('first');
		expect(result[16]).to.have.property('specialButton').with.equal('last');
	});
	it('Check first last button with maxPagination', function(){
		var pag = new Pagination('search', 15, 150, 10, {maxPagination:10, showBeginingEnd:true});
		var result = pag.getPagination();
		//check the length of results
		expect(result).to.have.length(12);
		//check if the actual pages is marked
		expect(result[0]).to.have.property('specialButton').with.equal('first');
		expect(result[11]).to.have.property('specialButton').with.equal('last');
	});
	it('Check next previous butotn', function(){
		var pag = new Pagination('search', 10, 150, 10, {maxPagination:10, showPreviousNext:true});
		var result = pag.getPagination();
		//check the length of results
		expect(result).to.have.length(12);
		//check if the actual pages is marked
		expect(result[0]).to.have.property('specialButton').with.equal('previous');
		expect(result[11]).to.have.property('specialButton').with.equal('next');
	});
	it('Check domain option', function() {
		var domain = 'http://www.google.es/';
		var pag = new Pagination('search', 15, 150, 10, {domain: domain});
		var result = pag.getPagination();
		//check the length of results
		expect(result).to.have.length(15);
		//check if the actual pages is marked
		expect(result[0]).to.have.property('url').with.include(domain);
	});
	it('Check if send url with replace option, generate proper url', function() {
		var pag = new Pagination('/test/%page%/test1/%rowsperpage%', 1, 150, 10);
		var result = pag.getPagination();
		expect(result[0]).to.have.property('url').with.equal('/test/1/test1/10');
	});
	it('If only send in url the %page% replace option, don´t include rowsPerPage', function() {
		var pag = new Pagination('/test/%page%/test1', 1, 150, 10);
		var result = pag.getPagination();
		expect(result[0]).to.have.property('url').with.equal('/test/1/test1');
	});

	it('Should return a # url when don\'t send urlPatter', function() {
		var pag = new Pagination(null, 1, 150, 10);
		var result = pag.getPagination();
		expect(result[0]).to.have.property('url').with.equal('#');
	});
});
