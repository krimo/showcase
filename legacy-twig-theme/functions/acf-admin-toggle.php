<?php


	// Register meta box(es).
	function acf_admin_toggle_meta() {
		add_meta_box( 'acf-admin-toggle', __('Toggle Modules'), 'acf_admin_toggle_meta_html', 'page', 'side' );
	}
	add_action( 'add_meta_boxes', 'acf_admin_toggle_meta' );


	// Meta box display callback.
	// @param WP_Post $post Current post object.
	function acf_admin_toggle_meta_html( $post ) {
		?>
		<script>
			jQuery(function() {

				jQuery('#expand-acf').on('click', function(e) {
					e.preventDefault();
					jQuery('.layout').removeClass('-collapsed');
				});

				jQuery('#collapse-acf').on('click', function(e) {
					e.preventDefault();
					jQuery('.layout').addClass('-collapsed');
				});

			});
		</script>

		<a href="#" id="expand-acf" class="button button-primary">Expand all</a>
		<a href="#" id="collapse-acf" class="button button-primary">Collapse all</a>
		<?php
	}
