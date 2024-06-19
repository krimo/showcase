<?php
function px_get_posts( $query ) {

	global $post;
	$posts = $query->posts;

	foreach( $posts as $post) {

		setup_postdata($post);

		// add custom data here
		$post->acf = get_fields();
		$post->link = wp_make_link_relative( get_the_permalink() );
		$post->date = get_the_time('F j, Y');
		$post->post_thumbnail =  get_the_post_thumbnail_url();		
		$post->content = wpautop( $post->post_content );

	}

	wp_reset_postdata();
	return $posts;

}
