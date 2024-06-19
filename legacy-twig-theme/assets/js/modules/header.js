var PXHeader = (function() {
	'use strict';

	var $menu,
		$menuItem,
		$menuButton,
		$window,
		$body,
		offSet,
		isMobile,
		scrollDir,
		scrollPos,
		currentPos;

	function init() {

		$window = $(window);
		$body = $('body');
		$menu = $('.site-header__menu');
		$menuItem = $('#menu-main-menu a');
		$menuButton = $('.mobile-menu-button');
		isMobile = $window.width() < 768;

		determineScroll();
		events();
	}

	function events() {

		$window.on('resize', function(){
			isMobile = $(window).width() < 768;
		});

		$window.on('scroll', function(){
			determineScroll();
		});

		$menuButton.click(function(){
			if($menu.hasClass('open')){
				$menu.add($menuButton).removeClass('open');
				$('body').removeClass('menu-open');
			} else {
				$menu.add($menuButton).addClass('open');
				$('body').addClass('menu-open');
			}
		});

		$menuItem.click(function(){
			if(PXResize.isMobile){
				$menu.add($menuButton).removeClass('open');
				$('body').removeClass('menu-open');
			}
		});

		$('.scroll-to-bottom').click(function(e){
			e.preventDefault();
			$('html, body').animate({scrollTop:$(document).height()}, 1000);
		});
	}

	function determineScroll() {
		offSet = isMobile ? 80 : 150;
		$('body').toggleClass('body--scrolled', ( getScroll() > offSet ));

		if ( !$('body').hasClass('body--scrolled') ) {
			scrollDir = 'down';
		}

		$('body').attr('data-scroll-direction', scrollDir);
	}

	function getScroll() {
		var currentPos = $window.scrollTop();

		if ( scrollPos < currentPos ) {
			scrollDir = 'down';
		} else {
			scrollDir = 'up';
		}
		scrollPos = currentPos;
		return currentPos;
	}

	return {
		init:init
	};
}());
