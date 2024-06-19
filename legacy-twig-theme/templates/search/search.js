var PXSearch = (function() {
	'use strict';

	var $searchForm;

	function init() {
		$searchForm = $('#content-wrapper .searchform');
		events();
	}

	function events() {

		$searchForm.on('submit', function(e){
			e.preventDefault();
			var queryString = '/?'+$searchForm.serialize();

			// form submissions and routing sometimes conflict
			// this prevents duplicate search queries from appearing in the url
			if( queryString.indexOf('?s=') > 0 && queryString.indexOf('&s=') > 0){
				var qs = queryString.split('&s=');
				queryString = '/?s='+qs[1];
			}

			PXRouter.getRouter().navigate(queryString);
			// PXRouter.router.navigate(queryString);
			$('.site-header__menu').removeClass('open');
		});
	}

	return {
		init:init
	};
}());
