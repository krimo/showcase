var PXModals = (function() {
	'use strict';

	var modal_btn_selector,
		modal_close_selector,
		hash;

	function init() {

		modal_btn_selector = '.menu a[href^="#"], [data-modal]';
		modal_close_selector = '.modal__close, .modal__overlay';
		hash = window.location.hash;

		events();
	}

	function events() {

		$('body').on('click', modal_btn_selector, function(e) {

			var $t = $(this),
				modalID = $t.data('modal') ? $t.data('modal').replace('#', '') : $t.attr('href').replace('#', '');

			if($('#'+modalID).hasClass('modal')){
				e.preventDefault();
				openModal(modalID);
			}
		});

		$('body').on('click', modal_close_selector, function(){
			closeModal();
		});

		if ( hash.length > 1 && $(hash).length && $(hash).hasClass('modal') ) {
			hash = hash.replace('#', '');
			$('[data-modal="'+hash+'"]').trigger('click');
		}

	}

	function openModal(modalID){
		$('body').add( $('#'+modalID) ).addClass('modal--active');
		history.replaceState({}, "", window.location.pathname+'#'+modalID );

		if ( $('#'+modalID).hasClass('modal--video') ) {
			var slug = $('#'+modalID).data('project');
			if ( project_data[slug] ) {
				$('#'+modalID).find('.responsive-video').html(project_data[slug]);
			}
		}

	}

	function closeModal(){
		$('.modal--active.modal--video').find('.responsive-video').html('');
		$('.modal--active').removeClass('modal--active');
		history.replaceState({}, "", window.location.pathname );
	}

	return {
		init:init,
		openModal: openModal,
		closeModal: closeModal
	};
}());
