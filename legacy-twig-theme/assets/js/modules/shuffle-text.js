var PXShuffleText = (function () {
	'use strict';

	var $module;
	var $video;
	var $shuffler;
	var words;
	var total;
	var c = 1;
	var $words;
	let wordDuration = 3.5;
	let transitionDuration = 0.5;
	let start = Date.now();
	let loopStarted = false;

	function init() {
		$module = $('.mod--header_banner');

		if ($module.length === 0) {
			return;
		}

		$video = $module.find('video');
		$shuffler = $module.find('span[data-shuffle]');
		words = $shuffler.data('shuffle');

		wordDuration = +$shuffler.data('word-duration');
		transitionDuration = +$shuffler.data('transition-duration');

		total = words.length;

		$shuffler.html('');

		for (var i = 0; i < total; i++) $shuffler.append($('<span/>', { text: words[i] }));

		$words = $shuffler.find('span').hide();

		$shuffler.width($words.eq(0).width());

		$words.eq(0).show(0);

		$video[0].addEventListener('play', whateverEventFiresFirst);
		$video[0].addEventListener('loadeddata', whateverEventFiresFirst);
		window.addEventListener('load', whateverEventFiresFirst);
		document.addEventListener('readystatechange', whateverEventFiresFirst);
	}

	function whateverEventFiresFirst(ev) {
		console.log('whateverEventFiresFirst: ', ev.type);

		if (ev.type === 'readystatechange' && document.readyState === 'complete')
			window.setTimeout(loop, wordDuration * 1000 - 400);
	}

	function loop() {
		loopStarted = true;
		console.log('loop started at: ', Date.now());
		$shuffler.animate({ width: $words.eq(c).width() });
		$words
			.stop()
			.fadeOut(transitionDuration * 1000)
			.eq(c)
			.fadeIn(transitionDuration * 1000)
			.delay(wordDuration * 1000 - 500)
			.show(0, loop);
		c = ++c % total;
		const end = Date.now();
		console.log(`Loop execution time: ${((end - start) / 1000).toFixed(2)} s`);
		start = end;
	}

	return {
		init: init,
	};
})();
