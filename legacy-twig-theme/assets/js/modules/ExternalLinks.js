var PXExternalLinks = (function() {
	'use strict';

	function init() {
		events();
	}

	function events() {
		$('body').on('click', 'a', function(event) {

			if( this.href.indexOf(window.location.host) < 0 && this.href.indexOf('mailto') < 0) {
				event.preventDefault();
				event.stopPropagation();
				window.open(this.href, '_blank');
			}
		});
	}

	return {
		init:init
	};
}());
