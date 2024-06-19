<?php

	function my_login_stylesheet() {
		wp_enqueue_style( 'custom-login', get_template_directory_uri() . '/assets/css/styles-login.css' );
	}
	add_action( 'login_enqueue_scripts', 'my_login_stylesheet' );

	function my_login_logo_url() {
		return home_url();
	}
	add_filter( 'login_headerurl', 'my_login_logo_url' );
