<?php

	// Excerpt Length
	function custom_excerpt_length( $length ) {
		return 20;
	}

	add_filter( 'excerpt_length', 'custom_excerpt_length', 999 );

	// Excerpt ellipsis
	function wpdocs_excerpt_more( $more ) {
	    return '...';
	}

	add_filter( 'excerpt_more', 'wpdocs_excerpt_more' );