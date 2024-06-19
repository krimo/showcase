// Logger module: overrides the console.log method to globally disable console logs
var PxConsoleLogs = (function() {
	'use strict';

	var _log;

	function init() {
		_log = null;
	}

	// Re-enables global logging
	function enable() {
		if (_log === null) { return; }

		window.console.log = _log;
	}

	// Disables global logging
	function disable() {
		_log = console.log;

		window.console.log = function() {};
	}

	return {
		init:init,
		enable:enable,
		disable:disable
	};
}());
