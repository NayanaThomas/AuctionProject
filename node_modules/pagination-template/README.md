pagination-template
===================

[![NPM version][npm-image]][npm-url]
[![Build Status](https://travis-ci.org/amadormf/pagination-template.svg?branch=master)](https://travis-ci.org/amadormf/pagination-template)
[![npm download][download-image]][download-url]

[npm-image]: http://img.shields.io/npm/v/pagination-template.svg?style=flat-square
[npm-url]: http://npmjs.org/package/pagination-template
[download-image]: https://img.shields.io/npm/dm/pagination-template.svg?style=flat-square
[download-url]: https://npmjs.org/package/pagination-template


Pagination of results for use in a templates in node.js. With 2 simple lines of code generate a pagination object to use in a template.

## Install

	npm install pagination-template

## Parameters

* **urlOrigin**: Set the url pattern
* **pageAct**: Actual page visit for the user
* **totalResults**: Number of rows
* **rowsPerPage**: Rows per page that we will show
* **options**: Object whith another options

## Use

	var Pagination = require('pagination-template');
	var paginator = new Pagination('search', 3, 141, 13);
	var result = paginator.getPagination();

The value of variable result in this example is:

	[ { url: 'search/1/13',
	    actualPage: false,
	    index: 1 },
	  { url: 'search/2/13',
	    actualPage: false,
	    index: 2 },
	  { url: 'search/3/13',
	    actualPage: true,
	    index: 3 },
	  { url: 'search/4/13',
	    actualPage: false,
	    index: 4 },
	  { url: 'search/5/13',
	    actualPage: false,
	    index: 5 },
	  { url: 'search/6/13',
	    actualPage: false,
	    index: 6 },
	  { url: 'search/7/13',
	    actualPage: false,
	    index: 7 },
	  { url: 'search/8/13',
	    actualPage: false,
	    index: 8 },
	  { url: 'search/9/13',
	    actualPage: false,
	    index: 9 },
	  { url: 'search/10/13',
	    actualPage: false,
	    index: 10 },
	  { url: 'search/11/13',
	    actualPage: false,
	    index: 11 } ]

The first parameter of constructor is the url path, you can indicate where is the positions of page parameters, if you send this parameter equal null the return url is a '#'

Example:

```
var paginator = new Pagination('search/anotherparameter/%page%/another/%rowsperpage%', 3, 141, 13);
var result = paginator.getPagination();
```
This return this url:

	url: 'search/anotherparameter/1/another/13'

## Options

You can send optional parameters to the constructor for more customization

Example:

	var parameters = {
		maxPagination : 10,
		showBeginingEnd: true,
		domain: 'http://www.google.com',
		showPreviousNext: true
	};
	var paginator = new pagination('search', 3, 141, 13, parameters);

### maxPagination
Maximum number of indexes show. If for example we have a 20 pages and the maxPagination  value is 10 the result is and the actual pages is 7 the result is 4 5 6 7 8 9 10 11 12 13

### showBeginingEnd
Check if they have to show the scroll buttons start end

### domain
If this options is passed then the url will be the concatenation of domain and the urlOrigin

### showPreviousNext
Show next previous button
