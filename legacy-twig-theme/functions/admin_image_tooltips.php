<?php

function action_function_name( $field ) {

	if ($field['type'] == 'image') {

		$ID = $field['value'];
		$imagePath = get_attached_file($ID);
		$filename = basename($imagePath);
		$tooltip = '<span class="image-filename">'.$filename.'</span>';

		if ($filename) {
			echo $tooltip;
		}

	}

}
add_action( 'acf/render_field', 'action_function_name', 10, 1 );


function tooltip_styles() {
  echo '<style>

		.image-filename {
			display: none;
		}

  </style>';
}
add_action('admin_head', 'tooltip_styles');


function tooltip_js($hook) {
    wp_enqueue_script( 'admin_js', get_template_directory_uri() . '/assets/js/dist/admin.js', array( 'jquery' ) );
}
add_action( 'admin_footer', 'tooltip_js' );
