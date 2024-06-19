var PXHeaderBanner = (function() {
	'use strict';

	var $headline;

	function init() {

		$headline = $('.mod--header_banner h1');

		events();
	}

	function events() {
		$headline.each(function(){
			var $t = $(this),
			$shuffle = $t.find('[data-shuffle]');

			if($shuffle.length < 1){
				$t.css('opacity', 1);
			}
		});

		$('.mod--header_banner .arrow-down').on('click', function(ev) {
			var offset = $(this).parent('.mod').next('.mod').offset();
			$('html, body').animate({
				scrollTop: offset.top
			});
		});
	}

	return {
		init:init
	};
}());
