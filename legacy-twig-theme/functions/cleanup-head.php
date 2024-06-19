<?php

	// Clean up the <head>
	function removeHeadLinks() {
		remove_action('wp_head', 'rsd_link');
		remove_action('wp_head', 'wp_generator');
		remove_action('wp_head', 'feed_links', 2);
		remove_action('wp_head', 'index_rel_link');
		remove_action('wp_head', 'wlwmanifest_link');
		remove_action('wp_head', 'feed_links_extra', 3);
		remove_action('wp_head', 'start_post_rel_link', 10, 0);
		remove_action('wp_head', 'parent_post_rel_link', 10, 0);
		remove_action('wp_head', 'adjacent_posts_rel_link', 10, 0);
		remove_action('wp_head', 'wp_shortlink_wp_head', 10, 0 );
		remove_action('wp_head', 'adjacent_posts_rel_link_wp_head', 10, 0 );

		remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
		remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
		remove_action( 'wp_print_styles', 'print_emoji_styles' );
		remove_action( 'admin_print_styles', 'print_emoji_styles' );

	}

	add_action('init', 'removeHeadLinks');

	function disable_embeds_init() {

	    // Remove the REST API endpoint.
	    // remove_action('rest_api_init', 'wp_oembed_register_route');

	    // Turn off oEmbed auto discovery.
	    // Don't filter oEmbed results.
	    // remove_filter('oembed_dataparse', 'wp_filter_oembed_result', 10);

	    // Remove oEmbed discovery links.
	    // remove_action('wp_head', 'wp_oembed_add_discovery_links');

	    // Remove oEmbed-specific JavaScript from the front-end and back-end.
	    remove_action('wp_head', 'wp_oembed_add_host_js');
	}

	add_action('init', 'disable_embeds_init', 9999);
