var PXInstagramFeed = (function() {
	'use strict';

	var $images,
		last,
		count,
		order,
		num_cells;

	function init() {

		$images = $('.mod--instagram_feed .instagram-box');
		last = 0;
		count = 0;
		order = [1, 3, 0, 2];
		num_cells = 4;

		sortImages();
	}

	function sortImages(){

		var $cells = $images.find('.instagram-wrapper');

		$cells.each(function(i, el){
			if(i > num_cells - 1){
				var newParentIndex = (i - 1) % num_cells;
				var $image = $(el).find('.instagram-photo');

				$cells.eq(newParentIndex).append( $image );
				$(el).remove();
			}
		});

		renderImages();
	}

	function renderImages(now) {
		if(now - last >= 2*1000) {
			last = now;
			showNextImage();
		}
		requestAnimationFrame(renderImages);
	}

	function showNextImage(){

		var index = count % num_cells;
			index = order[index];

		var $image = $images.children('.instagram-wrapper:eq('+index+')').find('.instagram-photo:first-child');

		$image.addClass('show').parent().append($image);
		setTimeout(function(){
			$image.removeClass('show');
		}, 50);
		count++;
	}

	return {
		init:init
	};
}());
