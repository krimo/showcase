var PXResize = (function() {
	'use strict';

	var isMobile,
		mobileBreakpoint = 768;

	function init() {
		$('window').on('resize', winResize);
		winResize();
	}

	function winResize() {
		isMobile = $('window').width < mobileBreakpoint;
	}

	return {
		init:init,
		isMobile:isMobile
	};
}());
