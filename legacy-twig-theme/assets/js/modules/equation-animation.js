var PXEquationAnimation = (function() {
	'use strict';

	var $eq_anim;
	var _controller;
	var _scene;

	function init() {
		$eq_anim = $('.equation-animation');
		_controller = new ScrollMagic.Controller();

		if ( $eq_anim.length ) {
			events();
		}

	}

	function events() {

		_scene = new ScrollMagic.Scene({
			triggerElement: $eq_anim.parents('.mod')[0]
		})
			.on('start', function(event) {
				$eq_anim.addClass('equation-animation--animate');
			})
			// .addIndicators()
			.addTo(_controller);

	}

	return {
		init:init
	};
}());
