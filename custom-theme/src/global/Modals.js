import MicroModal from 'micromodal';

export const Modals = (function () {
	'use strict';

	const config = {
		disableScroll: true,
		disableFocus: true,
		awaitOpenAnimation: true,
		awaitCloseAnimation: true,
		onShow: function (modal) {
			history.replaceState(null, null, window.location.href + '#' + modal.id);
		},
		onClose: function () {
			history.replaceState(
				null,
				null,
				window.location.href.replace(window.location.hash, '')
			);
		},
	};

	function init() {
		MicroModal.init(config);

		if (window.location.hash.length > 1) {
			const targetModal = document.querySelector(window.location.hash + '.modal');

			if (targetModal) show(window.location.hash);
		}
	}

	function show(id) {
		MicroModal.show(id.replace('#', ''), config);
	}

	return {
		init: init,
		show: show,
	};
})();
