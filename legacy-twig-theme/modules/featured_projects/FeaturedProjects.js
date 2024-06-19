var PXFeaturedProjects = (function() {
	'use strict';

	var _pinContainer;
	var _controller;
	var _scene;
	var _scenes;
	var _slides;
	var _wipeAnimation;
	var _activeDotIndex;
	var $dots;
	var $meter;
	var cleanSlides;

	function init() {
		_pinContainer = document.getElementById('featured-projects-pin');

		if (!_pinContainer) { return; }

		_activeDotIndex = 0;
		_scenes = [];
		_slides = _pinContainer.querySelectorAll('.featured-project');
		$dots = $('.project-listing__nav .dot');

		_controller = new ScrollMagic.Controller({
			globalSceneOptions: { triggerHook: 'onLeave' }
		}).scrollTo(function(newPos, isReverse) {
			newPos = Math.ceil(newPos);
			newPos = (isReverse) ? newPos - 1 : newPos;
			$('html, body').animate({scrollTop: newPos}, 400);
		});

		Array.from(_slides).forEach(function(s) {
			var theScene = new ScrollMagic.Scene({
				triggerElement: s,
			})
			.setPin(s)
			.addTo(_controller);

			_scenes.push(theScene);
		});

		events();
	}

	function events() {

		$dots.on('click', function() {
			var targetIdx = $(this).data('section');
			var isReverse = (_activeDotIndex > targetIdx) ? true : false;

			_controller.scrollTo(_scenes[targetIdx], isReverse);
		});

		Array.from(_scenes).forEach(function(s) {
			s.on('progress', function(ev) {
				var currentIdx = _scenes.indexOf(this);

				if (currentIdx === _activeDotIndex) { return false; }

				_activeDotIndex = currentIdx;
				$dots.removeClass('active');
				$dots.eq(currentIdx).addClass('active');
			});
		});

		$('.arrow-down').on('click', function() {
			_controller.scrollTo( _scenes[$(this).data('section')] );
		});

		$(window).on('scroll', function() {
			var containerInView = $(_pinContainer).isInViewport();
			if (containerInView) {
				$('.project-listing__nav').addClass('active');
			} else {
				$('.project-listing__nav').removeClass('active');
			}
		});



		$('.mod--featured_projects').on('click', '[data-section]', function() {
			// var targetSection = $(this).data('section');
			// var targetPos = _scene.scrollOffset() + (Math.ceil($('.featured-project').height()/2)*(targetSection - 1));
			// _controller.scrollTo(targetPos);
		});
	}

	$.fn.isInViewport = function() {
		var elementTop = $(this).offset().top;
		var elementBottom = elementTop + $(this).outerHeight();
		var viewportTop = $(window).scrollTop();
		var viewportBottom = viewportTop + ($(window).height()/3);
		return elementBottom > viewportTop && elementTop < viewportBottom;
	};

	return {
		init:init
	};
}());
