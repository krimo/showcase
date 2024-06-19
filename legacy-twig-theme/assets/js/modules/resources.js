// PX_todo this should only be run on https - add condition // location.protocol
var PXResources = (function() {
	'use strict';

	function init() {

		// Check for support of the PerformanceResourceTiming
	    if (performance === undefined) { return; }

	    // checking support again
	    var list = performance.getEntriesByType("resource");
	    if (list === undefined) { return; }

		var text_files = [];

	    // Loop through resources
	    for (var i=0; i < list.length; i++) {

	        if (
	            list[i].name.indexOf('svg') > -1 ||
	            list[i].name.indexOf('js') > -1 ||
	            list[i].name.indexOf('css') > -1 &&
				text_files.indexOf(list[i].name) < 0
	        ) {
	            // add resource to list if
	            // svg, js, or css
	            text_files.push(list[i].name);
	        }

	    }

		$.ajax({
			 url: php_vars.ajax_url,
			 type: 'POST',
			 data: {
				 'action': 'set_ajax_transients',
				 'files': text_files,
				 'url': window.location.pathname
			 },
			 error: function(err) {
				console.log('error ', err);
			 },
			 success: function(data) {
		 		console.log('SUCCESS - resources posted to transients.php : \n', data);
			 },
		 });
	}

	return {
		init:init
	};
}());
