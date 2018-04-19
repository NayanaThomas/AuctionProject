'use strict';
/**
  Module for create a pagination for use in a templates
**/
module.exports = Pagination;

var FIRST_BUTTON = 'first';
var NEXT_BUTTON = 'next';
var PREVIOUS_BUTTON = 'previous';
var LAST_BUTTON = 'last';

/**
 Function pagination, create a object

 @param urlOrigin Set the url begin
 @param pageAct Actual page visit for the user
 @param totalResults Number of rows
 @param rowsPerPage Rows per page that we will show
 @param options Object whith another options
 	options: {
		maxPagination : 10,  				//Maximum number of indexes show
										 	//If for example we have a 20 pages and
										 	//the maxPagination  value is 10 the result is
										 	//and the actual pages is 7 the result is
										 	//4 5 6 7 8 9 10 11 12 13
		showBeginingEnd: true,				//Check if they have to show the scroll buttons start end
		domain: 'http://www.google.com', 	//If this options is passed then the url will
										 	//be the concatenation of urlOrigin and the domain
		showPreviousNext: true				//show next last buttons
 	}
**/
function Pagination(urlOrigin, pageAct, totalResults, rowsPerPage, options){
	this.options = options || {};
	this.pageAct = pageAct;
	this.urlOrigin = urlOrigin;
	this.totalResults = totalResults;
	this.rowsPerPage = rowsPerPage;
}
/**
 Return an array with the objects for pagination
 @return An array with objects {
	url: /search/1/10
	actualpage: true	//indicate if is the actual page
	index: 1 			//if the number of page

 }
**/
Pagination.prototype.getPagination = function(){
	var maxPagination = 0;
	var ini = 1;
	var pages = getPages(this.totalResults, this.rowsPerPage);
	var last = pages;
	var end = pages;

	var paginationResult = [];
	//check option maxPagination
	if(this.options!==undefined && this.options.maxPagination>0){
		maxPagination = this.options.maxPagination;
	}
	//check the begin of pagination
	if(maxPagination>0 &&  this.pageAct>(maxPagination/2)){
		ini = Math.round(this.pageAct - (maxPagination/2));
	}

	//check the finish of pagination
	if(maxPagination>0 && (maxPagination+ini) <=  last){
		end = (ini + maxPagination) - 1;
	}
	if(maxPagination > 0 && (last - ini) <maxPagination){
		ini = (end - maxPagination) + 1;
		//check ini is negative
		if(ini < 1){
			ini = 1;
		}
	}
	//check domain option
	this.urlFinish = generateRootUrl.apply(this);

	//check go first button
	if(this.options && this.options.showBeginingEnd){
		paginationResult.push(generatePosition.apply(this, [1, 1, FIRST_BUTTON]));
	}

	if(this.options && this.options.showPreviousNext){
		var page = this.pageAct  - (this.pageAct===1 ? 0 : 1);
		paginationResult.push(generatePosition.apply(this, [page, page, PREVIOUS_BUTTON]));
	}

	for(var i = ini; i<= end; ++i){
		var  pagina = {};
		paginationResult.push(generatePosition.apply(this, [i, i]))
	};

	if(this.options && this.options.showPreviousNext){
		var page = this.pageAct  + (this.pageAct===last ? 0 : 1);

		paginationResult.push(generatePosition.apply(this, [page, page, NEXT_BUTTON]));
	}
	//check go last button
	if(this.options!==undefined && this.options.showBeginingEnd){
		paginationResult.push(generatePosition.apply(this, [last, last, LAST_BUTTON]));
	}
	return paginationResult;
}

function generatePosition(page, index, specialButton) {
	return {
		url: generateUrl(this.urlFinish, page, this.rowsPerPage),
		actualPage: this.pageAct === page,
		index: index,
		specialButton: specialButton,
	};
}

function generateRootUrl() {
	return this.options.domain ? (this.options.domain + this.urlOrigin) : (this.urlOrigin);
}

function generateUrl(url, index, rowsPerPage){
  if (!url) {
	  return '#';
  }

  var positionPage = url.indexOf('%page%');
  if (positionPage>-1) {
      return url.replace('%page%', index).replace('%rowsperpage%', rowsPerPage);
  }
	return url + '/' + index + '/' + rowsPerPage;
}

function getPages(totalResults, rowsPerPage) {
	return Math.floor((totalResults / rowsPerPage)) + ((totalResults % rowsPerPage)>0 ? 1:0);
}
