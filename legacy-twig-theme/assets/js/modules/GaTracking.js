var PXGaTracking = (function() {
	'use strict';

	function init() {
		events();
	}

	function events() {

		$('.site-header li.contact a').click( function(){

			ga('set', 'page', '/contact');
			ga('send', 'pageview');

			console.warn('Sent GA event:', 'Pageview : /contact');
		});

	}

	return {
		init:init
	};
}());
