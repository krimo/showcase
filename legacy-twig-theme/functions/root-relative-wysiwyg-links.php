<?php
	// update absolute paths
	function updating_wysiwyg_urls( $value, $post_id, $field ) {
	    $value = str_replace('href="'.site_url(), 'href="', $value);
	    return $value;
	}

	// acf/load_value - filter for every value load/update (catch it on way to DB)
	add_filter('acf/load_value/type=wysiwyg', 'updating_wysiwyg_urls', 10, 3);
	add_filter('acf/update_value/type=wysiwyg', 'updating_wysiwyg_urls', 10, 3);
