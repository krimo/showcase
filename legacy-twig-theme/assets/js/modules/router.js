var PXRouter = (function() {
	'use strict';

	var router,
		test,
		baseUrl,
		firstPageLoaded = false,
		$loading = $('#loading');

	function getRouter() {
		return router;
	}

	function init() {
		if (!window.location.origin) {
			window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
		}

		baseUrl = window.location.origin;
		router = new Navigo(baseUrl);

		events();
	}

	function events() {
		$('body').on('click', 'a', function(e){
			var link = $(this).attr('href');
			link.replace(baseUrl, '');

			var hash = link.split('#'),
				$hash = $('#'+hash[1]);

			// check for same page anchor links
			if(link.indexOf('#') > -1 && $hash.length > 0 && !$hash.hasClass('modal') ){
				e.preventDefault();

				if( $('.site-header').css('position') == 'fixed' ){
					window.scroll(0, $hash.offset().top - $('.site-header').outerHeight());
				} else {
					window.scroll(0, $hash.offset().top);
				}

				var currentPath = window.location.pathname;
				history.replaceState({}, "", currentPath+'#'+hash[1]);
				return;
			}

			// internal url
			if( link.indexOf('/') == 0 ){

				e.preventDefault();
				router.navigate(link);

			}
		}); // $('body').on('click', 'a'


		router.on(
			'*', function () {
				console.log('routing');
			},
		  {
		    before: function (done, params) {

	        	// don't ajax content if this is the first pageload
				if(!firstPageLoaded){
	          		firstPageLoaded = true;

					// handle url hash on first pageload
					// e.g. an external link to a #
					if(window.location.hash.length > 0){
						var $hash = $(window.location.hash);

						// if element exists
						if($hash.length){

							// if it's a modal, open it
							if($hash.hasClass('modal')){

								$('body').addClass('modal--active');
								$hash.addClass('modal--active');

							} else {

								// if it's not a modal, jump to element
								// add fixed header offset if needed
								if( $('.site-header').css('position') == 'fixed' ){
									window.scroll(0, $hash.offset().top - $('.site-header').outerHeight());
								} else {
									window.scroll(0, $hash.offset().top);
								}

							}

						}

					}

				}

		        // load new page
		        else {
	          		var path = router.lastRouteResolved().url;

					// check for ajaxed search queries
					if(window.location.search.length > 0){
						path = '/'+window.location.search;
					}

					$loading.fadeIn();

					// wait for loading screen to be fully opaque before loading new content
					setTimeout(function(){
						fetchData(path);
					}, 500);

					done();

				} // if

		    } // before

		  }
		).resolve();

	} // events()

	function fetchData(path, append){

		console.log('AJAX PATH - ', '/wp-json/rest/v1/get?path='+path);

		$.ajax({
			 url: '/wp-json/rest/v1/get?path='+path,
			 type: 'GET',
			 dataType: 'json',
			 error: function(err) {
				window.location.href = path;
		 		console.log('ajax error - ', err);
			 },
			 success: function(data) {
				 renderTemplate(data, data.template_type, append);
				 setActiveNav(path);
				console.log('ajax success - ', data);
			 },
		 });

	} // fetchData

	function setActiveNav(path){

		var $navListItems = $('#menu-main-menu li'),
			$navAnchors = $('#menu-main-menu a'),
			path = path.replace(/\/$/, ""); // replace trailing slash

		$navListItems.removeClass('current-menu-item current_page_item');

		// PXTODO: account for hash in URL
		$navAnchors.each(function(){

			var $t = $(this),
				itemLink = $t.attr('href').replace(/\/$/, ""),
				isHomeItem = $t.attr('href') === '/' ? true : false;

			if ( !isHomeItem && path.indexOf( itemLink ) > -1 ) {
				$t.parents('li').addClass('current-menu-item');
			}

			if ( isHomeItem && path == itemLink ) {
				$t.parents('li').addClass('current-menu-item');
			}

		});

	} // setActiveNav

	function renderTemplate(data, post_type, append){

		console.log('RENDERING AJAX DATA', data);
		console.log('post type', post_type);

		var formattedData = {},
			item;

		for(item in data){
			formattedData[item] = data[item];
		}

		console.log('FORMATTED DATA', formattedData);

		$('#content-wrapper').html(
			Twig.twig({
				ref: post_type,
				allowInlineIncludes: true
			})
			.render(formattedData)
		);

		updateMeta(formattedData);

		// update body class
		$('body').attr('class', formattedData.body_class);

		// handle hash
		if(window.location.hash){
			var $hash = $(window.location.hash);

			if($hash.length > 0){

				if( $('.site-header').css('position') == 'fixed' ){
					window.scroll(0, $hash.offset().top - $('.site-header').outerHeight());
				} else {
					window.scroll(0, $hash.offset().top);
				}

			} else {
				window.scrollTo(0, 0);
			}

		} else {
			// scroll to top
			window.scrollTo(0, 0);
		}

		// reinitialize script to run on dynamic content
		console.log('reinitialize script');
		PXInitModules();
		$loading.fadeOut().removeClass('show');

	} // renderTemplate

	function updateMeta(data){

		document.title = data.yoast.yoast_wpseo_title;
		$('meta[name="description"]').attr('content', data.yoast.yoast_wpseo_metadesc);
		$('link[rel="canonical"]').attr('href', window.location.pathname);

		$('meta[property="og:title"]').attr('content', data.yoast.yoast_wpseo_title);
		$('meta[property="og:description"]').attr('content', data.yoast.yoast_wpseo_metadesc);
		$('meta[property="og:url"]').attr('content', window.location.pathname);

		$('meta[name="twitter:title"]').attr('content', data.yoast.yoast_wpseo_title);
		$('meta[name="twitter:description"]').attr('content', data.yoast.yoast_wpseo_metadesc);

	} // updateMeta

	return {
		init:init,
		getRouter:getRouter,
	};
}());
