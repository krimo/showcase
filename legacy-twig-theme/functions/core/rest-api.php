<?php

function get_endpoint($request) {


	// GET REQUEST INFO
	$postInfo = get_template_type($request['path']);
	$postType = $postInfo['post_type'];
	$postSlug = $postInfo['post_slug'];
	$ajaxed = true;

	// Fix URLs/queries for Multisite/Network
	if ( is_multisite() ) {
		$domain = $_SERVER['HTTP_HOST'];
		$path = explode('/', $request['path']);
		$path = '/' . $path[1] . '/';
		$blog_id = get_blog_id_from_url($domain, $path);
		switch_to_blog($blog_id);
		$deets = get_blog_details($blog_id);
		$request['path'] = str_replace($deets->path, '/', trailingslashit($request['path']));
		$postSlug = str_replace($deets->path, '/', $postSlug);
	}

	// ASSOCIATE POST TYPES WITH TEMPLATES
	global $CUSTOM_POST_TYPES;
	$CUSTOM_POST_TYPES[] = 'post';
	$singlePosts = $CUSTOM_POST_TYPES;

	$isHomepage = false;
	$pages = ['pagename'];
	$archives = ['category_name', 'tag', 'year'];
	$isSearchQuery = strpos($request['path'], '/?s=');

	// CHECK WHICH TEMPLATE TO USE

	// search
	if( $isSearchQuery !== false ){

		$templateType = 'search';
		$queryString = explode('/?s=', $request['path']);
		$search_query = $queryString[1];

	} else


	// homepage
	if( $request['path'] == '' || $request['path'] == '/' ) {

		$isHomepage = true;
		$templateType = 'page';
		$post = get_post( get_option( 'page_on_front' ) );

	} else


	// page
	if( in_array( $postType, $pages ) ){

		$templateType = 'page';
		$post = get_page_by_path($postSlug, OBJECT, 'page');

	} else


	// single
	if( in_array( $postType, $singlePosts ) ){

		$templateType = ( $postType !== 'post' ) ? 'single-'.$postType : 'single';
		$post = get_page_by_path($postSlug, OBJECT, $postType);

	} else


	// archive
	if( in_array( $postType, $archives ) ){

		$templateType = 'archive';
		$pathArray = explode('/', $request['path']);


		// check if date archive
		if( is_numeric($pathArray[1]) ){
			$archiveType = 'date';
			$year = $pathArray[1];
			$month = $pathArray[2];
		}

		// otherwise, it's a normal taxonomy
		else {
			$archiveType = 'taxonomy';
			$taxonomy = $pathArray[1];
			$taxonomy = $taxonomy == 'tag' ? 'post_tag' : $pathArray[1]; // replace tag with post_tag
			$termSlug = $pathArray[2];
			$term = get_term_by( 'slug', $termSlug, $taxonomy );
		}

	}


	// CHECK FOR POST & SET POST ID
	if( !empty($post) ){
		$ajaxPostID = $post->ID;
	}

	// if post doesn't exist, and it's not an archive,
	// you've got a 404
	else if( $templateType != 'archive' && $templateType != 'search' ) {
		$templateType = '404';
	}



	// INCLUDE MODEL
	$model = get_template_directory() . '/templates/'. $templateType .'/'. $templateType .'.php';
	if( file_exists($model) ){ require_once( $model ); }
	$data['template_type'] = $templateType;



	// SETUP METADATA
	if( !empty($post)  ){

		// yoast meta data
		$yoastMeta = array(
			'yoast_wpseo_focuskw' => get_post_meta($ajaxPostID, '_yoast_wpseo_focuskw', true),
			'yoast_wpseo_title' => html_entity_decode(yoastVariableToTitle($ajaxPostID)),
			'yoast_wpseo_metadesc' => get_post_meta($ajaxPostID, '_yoast_wpseo_metadesc', true),
			'yoast_wpseo_linkdex' => get_post_meta($ajaxPostID, '_yoast_wpseo_linkdex', true),
			'yoast_wpseo_metakeywords' => get_post_meta($ajaxPostID, '_yoast_wpseo_metakeywords', true),
			'yoast_wpseo_meta-robots-noindex' => get_post_meta($ajaxPostID, '_yoast_wpseo_meta-robots-noindex', true),
			'yoast_wpseo_meta-robots-nofollow' => get_post_meta($ajaxPostID, '_yoast_wpseo_meta-robots-nofollow', true),
			'yoast_wpseo_meta-robots-adv' => get_post_meta($ajaxPostID, '_yoast_wpseo_meta-robots-adv', true),
			'yoast_wpseo_canonical' => get_post_meta($ajaxPostID, '_yoast_wpseo_canonical', true),
			'yoast_wpseo_redirect' => get_post_meta($ajaxPostID, '_yoast_wpseo_redirect', true),
			'yoast_wpseo_opengraph-title' => get_post_meta($ajaxPostID, '_yoast_wpseo_opengraph-title', true),
			'yoast_wpseo_opengraph-description' => get_post_meta($ajaxPostID, '_yoast_wpseo_opengraph-description', true),
			'yoast_wpseo_opengraph-image' => get_post_meta($ajaxPostID, '_yoast_wpseo_opengraph-image', true),
			'yoast_wpseo_twitter-title' => get_post_meta($ajaxPostID, '_yoast_wpseo_twitter-title', true),
			'yoast_wpseo_twitter-description' => get_post_meta($ajaxPostID, '_yoast_wpseo_twitter-description', true),
			'yoast_wpseo_twitter-image' => get_post_meta($ajaxPostID, '_yoast_wpseo_twitter-image', true)
		);

		$data['yoast'] = $yoastMeta;
		$data['custom_fields'] = get_fields($ajaxPostID);
		$data['body_class'] = get_custom_body_class($ajaxPostID);

	}

	// 404
	else {

 		// px_issue - need to get body class and meta data for archives and 404s
		//
		// this else statement is currently running if no $post object is found
		// need condition to check whether it's an archive or a 404
		// and then get appropritate body_class and meta data

		$title404 = 'Page not found -' . get_bloginfo( 'name' );

		$yoastMeta = array(
			'yoast_wpseo_title' => $title404,
			'yoast_wpseo_opengraph-title' => $title404,
			'yoast_wpseo_twitter-title' => $title404,
			'yoast_wpseo_opengraph-description' => $title404,
		);

		$data['yoast'] = $yoastMeta;
		$data['custom_fields'] = '';// get_fields($ajaxPostID);
		$data['body_class'] = 'error-404'; //get_custom_body_class($ajaxPostID);

	}



	// RETURN ENDPOINT
	return rest_ensure_response( $data );

} // end get_endpoint



function register_custom_routes() {
  register_rest_route( 'rest/v1', '/get', array(
    'methods'  => WP_REST_Server::READABLE,
    'callback' => 'get_endpoint',
  ));
}

add_action( 'rest_api_init', 'register_custom_routes' );
