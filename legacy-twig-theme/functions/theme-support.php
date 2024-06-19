<?php

	function theme_support_setup() {
		add_theme_support('menus');
		add_theme_support( 'title-tag' );
		// add_theme_support('post-thumbnails'); // post & page thumbnails
	}

	add_action( 'after_setup_theme', 'theme_support_setup' );
