<?php
// add extra data to the module like this:
// $module['my_global_option'] = get_field('field_name', 'option');
// then access in the twig file like this:
// {{ module.my_global_option }}

$module['projects'] = array();

$args = array(
	'post_type' => 'project',
	'posts_per_page' => -1
);

$terms = get_terms('project-type');

$all = array(
	'name' => 'All projects',
	'slug' => 'all-projects',
	'description' => $module['all_projects_description']
);
array_unshift($terms, $all);

$the_query = new WP_Query($args);

if ($the_query->have_posts()) {

	while ($the_query->have_posts()) {
		$the_query->the_post();
		$project_terms = get_the_terms(get_the_id(), 'project-type');

		$classes = array();

		if (is_array($project_terms)) {
			foreach ($project_terms as $term) {
				$classes[] = $term->slug;
			}
		}

		$filter_terms =  implode(' ', $classes);
		$id = $the_query->post->ID;
		if (false === ($fields = get_transient('project-meta-' . $id))) {
			// this code runs when there is no valid transient set
			$fields = get_fields($id);
			set_transient('project-meta-' . $id, $fields);
		}

		$video = $fields['vimeo']; // get_field('vimeo', get_the_id());
		$video = str_replace('" width="', '&autoplay=1 width="', $video);

		$module['projects'][] = array(
			'slug' => $the_query->post->post_name,
			'name' => get_the_title(),
			'terms' => $filter_terms,
			'url' => get_permalink(),
			'image' => $fields['work_page_image'],
			'client' => $fields['client'],
			'tagline' => $fields['tagline'],
			'vimeo' => $video,
			'short_description' => $fields['short_description'],
		);
	}
}

wp_reset_postdata();

// output legend
echo '<script>';
echo 'var project_data = project_data || [];' . "\n";
foreach ($module['projects'] as $key => $project) {
	echo 'project_data["' . $project['slug'] . '"] = ' . json_encode($project['vimeo']) . ';' . "\n";
}
echo '</script>';

$module['terms'] = $terms;
