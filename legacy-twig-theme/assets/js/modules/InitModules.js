var PXInitModules = (function() {
	'use strict';

	var modules = php_vars.modules_to_reinit;

	for ( var i in modules ){
		var module = 'PX'+modules[i];
		module = module.replace('.js', '');

		if(window[module]){
			window[module].init();
		}
	}

});
