export const PXBanner = (function () {
	'use strict';

	function init() {
		console.log('Initialize PXBanner block');

		window.addEventListener('load', () => {
			console.log('hello');
		});
	}

	return {
		init: init,
		name: 'banner',
	};
})();
