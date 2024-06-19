var isIE = (function (){
    "use strict";

	var ieDetected = false;
    var jscriptVersion = new Function("/*@cc_on return @_jscript_version; @*/")();

	if( jscriptVersion != undefined || (!!window.MSInputMethodContext && !!document.documentMode) ){
		ieDetected = true;
	}

	return ieDetected;
});
