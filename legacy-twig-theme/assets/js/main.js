var $ = $ || jQuery;

var PXInit = (function() {
	'use strict';

	// PxConsoleLogs.disable();
	// if( !isIE() ){ PXRouter.init(); }
	PXExternalLinks.init();
	PXShuffleText.init();
	PXHeader.init();
	PXModals.init();
	PXResize.init();
	// PXResources.init();
	PXHeaderSearch.init();
	PXEquationAnimation.init();
	PXGaTracking.init();
	PXInitModules();


});

$(document).ready(function() {
	PXInit();
});
