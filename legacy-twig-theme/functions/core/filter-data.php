<?php

	// what does that do?
	function redirect_password_check() {
		wp_redirect($_POST['password_redirect_url']);
		exit;
	}

	if ( isset($_GET['action']) && $_GET['action'] == 'postpass' ) {
		add_filter('wp_safe_redirect_fallback', 'redirect_password_check');
	}

	// customize the form to pass additional input
	function custom_password_form( $post = 0 ) {

		$redirect = ( isset($_GET['path']) ) ? $_GET['path'] : $_SERVER['REQUEST_URI'];

	    $label = 'pwbox';
	    $output = '<form action="' . esc_url( site_url( 'wp-login.php?action=postpass', 'login_post' ) ) . '" class="post-password-form" method="post">

		<p>' . __( 'This content is password protected. To view it please enter your password below:' ) . '</p>
	    <p>
			<label for="' . $label . '">' . __( 'Password:' ) . ' <input name="post_password" id="' . $label . '" type="password" size="20" /></label>
			<input type="submit" name="Submit" value="' . esc_attr_x( 'Enter', 'post password form' ) . '" />
		</p>

		<input type="hidden" name="password_redirect_url" value="'.esc_url($redirect).'" />

		</form>';

	    return $output;
	}

	add_filter( 'the_password_form', 'custom_password_form' );



	function my_acf_load_value( $value, $post_id, $field ) {

		// run the_content filter on all textarea values
		if ( $post_id !== 'options' ) {

			$requires_password = post_password_required($post_id);

			if ( $requires_password ) {
				$value = '<!-- Password required. -->';
			}

			$is_private = (get_post_status($post_id) == 'private');

			if ( $is_private && ( !is_user_logged_in() && !ajax_cookie_check_user() ) ) {
				$value = '<!-- Private post -->';
			}

		}

		return $value;
	}

	// acf/load_value - filter for every value load
	add_filter('acf/load_value', 'my_acf_load_value', 10, 3);