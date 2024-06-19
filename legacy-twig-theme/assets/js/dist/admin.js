(function($){

	let $filename = $('.image-filename');

	$filename.each(function(){
		let $t = $(this);
		let filename = $t.html();

		$t.siblings('.acf-image-uploader').find('img').attr('title', filename);
	});

})(jQuery);
