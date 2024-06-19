<?php

if (isset($ajaxed)) {
	global $post;
	$post = get_post($ajaxPostID, OBJECT);
	setup_postdata($post);
} else {
	$post = get_post();
}

$data['post'] = $post;
$data['post']->fields = get_fields($post);

wp_reset_postdata();
