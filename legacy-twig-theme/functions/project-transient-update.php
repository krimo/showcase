<?php

	function project_update_transient( $post_id, $post, $update ) {

		$post_type = get_post_type($post_id);

		// If this isn't a 'project' post, don't update it.
		if ( "project" != $post_type ) return;

		// - Update the post's metadata.
		$fields = get_fields($post_id);
		set_transient('project-meta-' . $post_id, $fields);

	}

	add_action( 'save_post', 'project_update_transient', 10, 3 );