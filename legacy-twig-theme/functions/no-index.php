<?php

	// if local or staging
	function no_index() {
		if ( strpos($_SERVER['HTTP_HOST'], '.test') !== false || strpos($_SERVER['HTTP_HOST'], '.pixelsmith.co' ) !== false ) {

			echo '<meta name="robots" content="noindex, nofollow" />';

			if(is_search()){
				echo '<meta name="robots" content="noindex, nofollow" />';
			}

		}
	}
	add_action('wp_head', 'no_index');
