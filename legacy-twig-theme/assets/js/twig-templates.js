// WP localize script controls this now
// var twig_templates = ['single', 'single-news', 'page', 'archive', '404', 'search'];

if ( twig_templates.length ) {

	for ( i in twig_templates ){

		Twig.twig({
				id: twig_templates[i],
				href: php_vars.template_directory+'/templates/'+twig_templates[i]+'/'+twig_templates[i]+'.twig'
		});

	}
}
