<?php

	function px_custom_admin() {

		$style = '';

		// Updating logo
		$logo = ( class_exists('acf') ) ? get_field('admin_logo', 'options') : '';

		if ( !empty($logo) ) {
			$width = ( (int)$logo['width'] > 320 ) ? 'auto' : $logo['width'] . 'px';
			$style .= '#login h1 a,
					.login h1 a {
						background-image: url(' . $logo['url'] . ');
						width: '.$width.';
						background-size: contain;
					}';
		}

		// updating page background
		$background_color = ( class_exists('acf') ) ? get_field('background_color', 'options') : '';
		$background_image = ( class_exists('acf') ) ? get_field('background_image', 'options') : '';
		$background_image_position = ( class_exists('acf') ) ? get_field('background_image_position', 'options') : '';
		$background_size = ( class_exists('acf') ) ? get_field('background_size', 'options') : '';

		// background-color
		if ( !empty($background_color) ) {
			$style .= 'body.login {
				background-color: '.$background_color.';
			}';
		}

		// background-image
		if ( !empty($background_image) ) {
			$style .= 'body.login {
				background-image: url('.$background_image['url'].');
				background-repeat: no-repeat;
			}';
		}

		// background-position
		if ( !empty($background_image_position) ) {
			$style .= 'body.login {
				background-position: '.$background_image_position.';
			}';
		}

		// background-size
		if ( !empty($background_size) ) {
			$style .= 'body.login {
				background-size: '.$background_size.';
			}';
		}

		// add it all to a style tag
		if ( !empty($style) ) { echo '<style>'.$style.'</style>'; }

	}

	add_action( 'login_enqueue_scripts', 'px_custom_admin' );

	function px_custom_admin_css() {
		echo '<style>
				#preview-action {
					display: none;
				}
			  </style>';
	}

	add_action('admin_head', 'px_custom_admin_css');