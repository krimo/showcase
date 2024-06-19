<?php

	$posts = new WP_Query(array (
		// 'post_type' => 'news',
		// 'posts_per_page' => $module['post_count'],
		'posts_per_page' => -1
	));

	$module['posts'] = px_get_posts($posts);
