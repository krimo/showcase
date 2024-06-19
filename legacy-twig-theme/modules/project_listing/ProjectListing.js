var PXProjectListing = (function() {
	'use strict';

	var filterSelector;
	var $grid;
	var $items;
	var $taxToggle;
	var $taxList;

	function init() {
		filterSelector = '*';
		$grid = $('.project-grid').isotope({
			itemSelector: '.project',
			layoutMode: 'fitRows',
			sortBy: 'selector',
			getSortData: {
				selector: function(itemElem) {
					return !$(itemElem).is(filterSelector);
				},
			},
		});
		$items = $grid.find('.project');
		$taxToggle = $('.mobile-tax-toggle');
		$taxList = $('.taxonomy_filters');

		$('.filter-description').removeClass('active').fadeOut();
		$('.filter-description[data-filter="all-projects"]').addClass('active').fadeIn();

		events();
	}

	function isMobile() {
		return ($('.filter-description h2').is(':visible'));
	}

	function events() {

		$('.filter-button').on( 'click', function() {
			$('.filter-button').removeClass('selected');
			$(this).addClass('selected');
			filterSelector = $(this).attr('data-filter');
			$grid.isotope('updateSortData').isotope();
			$items.filter(filterSelector).removeClass('is-filtered-out');
			$items.not(filterSelector).addClass('is-filtered-out');


			var filterSlug = filterSelector.replace('.', '');
			filterSlug = ( filterSlug == '*' ) ? 'all-projects' : filterSlug;

			$('.filter-description').removeClass('active').fadeOut();
			$('.filter-description[data-filter="'+filterSlug+'"]').addClass('active').fadeIn();

			if ( isMobile() ) {
				$taxList.stop().slideUp();
			}

			if(filterSlug == 'all-projects') {
				window.location.hash = '#';
			} else {
				window.location.hash = '#' + filterSlug;
			}

		});

		if ( window.location.hash.length > 1 ) {
			var hash = window.location.hash;
			hash = hash.replace('#', '');
			hash = hash.replace('all-projects', '*');

			hash = ( hash !== '*' ) ? '.' + hash : hash;

			if ( $('.filter-button[data-filter="'+hash+'"]').length ) {
				$('.filter-button[data-filter="'+hash+'"]').trigger('click');
			}
		}

		$taxToggle.on('click', function(){
			if ( isMobile() ) {
				$taxList.stop().slideToggle();
			}
		});

	}

	return {
		init:init
	};
}());
