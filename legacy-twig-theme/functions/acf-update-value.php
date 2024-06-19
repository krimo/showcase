<?php

	function px_acf_update_value( $value, $post_id, $field  ) {

		// override value
		$bad = array(
			'http://' . $_SERVER['HTTP_HOST'],
			'https://' . $_SERVER['HTTP_HOST']
		);
		$value = str_replace($bad, '', $value);

		// return
		return $value;

	}

	// acf/update_value - filter for every field
	add_filter('acf/update_value/type=wysiwyg', 'px_acf_update_value', 10, 3);