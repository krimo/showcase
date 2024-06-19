<?php

	function ajax_cookie_check_user() {

		$cookie_key = false;

		foreach ( $_COOKIE as $key => $value ) {
			if ( strpos($key, 'wordpress_logged_in') !== false ) {
				$cookie_key = $key;
			}
		}

		$valid_cookie = ( $cookie_key ) ? wp_validate_auth_cookie($_COOKIE[$cookie_key], 'logged_in') : false;

		$status = ( $valid_cookie && is_int($valid_cookie) ) ? $valid_cookie : false;

		return $status;

	}

	// add_filter('determine_current_user', 'ajax_cookie_check_user');
