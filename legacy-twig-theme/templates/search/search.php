<?php
function px_search_posts( $query ) {

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

if( !isset($search_query) && $_GET['s'] ){
	$search_query = $_GET['s'];
}

if(isset($search_query)){

	$search_args = array(
		's' => $search_query,
		'post_type' => 'any'
	);

	$data['search_term'] = $search_query;

	$search = new WP_Query( $search_args );

	$data['posts'] = px_search_posts( $search );
}

$data['searchform'] = file_get_contents(TDIR.'/searchform.php');


ob_start();
get_template_part( 'searchform' );
$data['searchform'] = ob_get_contents();
ob_end_clean();
