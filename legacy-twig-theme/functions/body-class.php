<?php

	function get_custom_body_class( $postID ) {

		// save and reset later
		global $wp_query;
		$real_wp_query = $wp_query;

		$is_logged_in = is_user_logged_in() || ajax_cookie_check_user();

		$args = array(
			'p' => $postID,
			'post_type' => 'any',
			'post_status' => ( $is_logged_in ) ? 'any' : 'public'
		);

		$body_class = array();

		$the_query = new WP_Query( $args );
		$wp_query = $the_query;
		$classes = '';

		if ( $the_query->have_posts() ) {
		  while ( $the_query->have_posts() ) {  $the_query->the_post();
	      $body_class = get_body_class();
				$post = get_post($postID);

				if ( is_object($post) ) {
					$classes = $post->post_name . ' ' . $post->post_type . '-' . $post->post_name;
				}

		  }
		}

		// reset to original state
		$wp_query = $real_wp_query;
		wp_reset_postdata();

		$fields = get_fields();
		if ( $fields['modules'][0]['acf_fc_layout'] == 'header_banner' ) {
			$body_class[] = 'header_banner_first';
		}


		if ( count($body_class) ) {
			foreach( $body_class as $class ){
				$classes = $classes.' '.$class;
			}
		}

		return $classes;

	}
