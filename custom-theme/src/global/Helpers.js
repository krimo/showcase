export const Helpers = (() => {
	'use strict';

	function init() {
		links();
		mobile_menu();
		body_scroll();
	}

	function links() {
		document.querySelectorAll('a').forEach((anchorTag) => {
			// External links
			if (
				anchorTag.href.indexOf(window.location.host) < 0 &&
				anchorTag.href.indexOf('mailto') < 0 &&
				anchorTag.href.indexOf('tel') < 0
			)
				anchorTag.setAttribute('target', '_blank');

			// Anchor links
			if (
				anchorTag.href.indexOf('#') === 0 &&
				!document.getElementById(anchorTag.href.replace('#', ''))
			)
				window.scrollTo({ top: 0, behavior: 'smooth' });
		});
	}

	function mobile_menu() {
		const mobileTrigger = document.querySelector('.site-header__mobile-trigger');

		if (!mobileTrigger) return;

		mobileTrigger.addEventListener('touchstart', () => {
			mobileTrigger.classList.toggle('open');
			document.body.classList.toggle('mobile-nav-open');
		});
	}

	function body_scroll() {
		window.addEventListener(
			'scroll',
			() => {
				window.scrollY > 1
					? document.body.classList.add('scrolled')
					: document.body.classList.remove('scrolled');
			},
			1
		);
	}

	function sendEvent(action, label, category) {
		// console.log(action, label, category);

		if (typeof gtag !== 'undefined' && gtag !== null) {
			gtag('event', 'click', {
				event_label: category,
			});
			console.warn('GA event sent ', '\n', 'Event: click', '\n', 'Label: ' + category, '\n');
		} else {
			console.warn(
				'GA events are not tracked on this domain ',
				'\n',
				'Event: click',
				'\n',
				'Label: ' + category,
				'\n'
			);
		}
	}

	return {
		init: init,
		sendEvent: sendEvent,
	};
})();
