<?php
get_header();

$error_404_page_obj = get_field('404_page', 'option');
if ($error_404_page_obj) {
	$content = apply_filters('the_content', $error_404_page_obj->post_content); 
	echo $content; 	
} else {
	echo '<div class="pxblock pxblock--text">';
		echo '<div class="container">';
			echo '<div class="wysiwyg">';
				echo '<h1>Error - 404</h1>';
				echo '<p>The page cannot be found.</p>';
			echo '</div>';
		echo '</div>';
	echo '</div>';
}

get_footer();
?>