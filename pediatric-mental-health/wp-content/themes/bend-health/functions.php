<?php
add_theme_support('post-thumbnails');

function bh_add_editor_styles()
{
	add_editor_style();
	add_editor_style(get_stylesheet_directory_uri() . '/wordpress-tailwind-wp.css');
}
add_action('admin_init', 'bh_add_editor_styles');

add_filter('use_block_editor_for_post', '__return_false', 10);
add_filter('acf/fields/wysiwyg/toolbars', 'modify_acf_wysiwyg_toolbars', 10, 1);
add_filter('tiny_mce_before_init', 'modify_tiny_mce_format_options', 10, 1);
add_action('admin_head-post.php', 'hide_publishing_actions');
add_action('admin_head-post-new.php', 'hide_publishing_actions');
add_action('init', function () {
	header('Access-Control-Allow-Origin: *');
	bh_init_hook_functions();
});

function hide_publishing_actions()
{
	global $post;
	if ($post->post_type === 'bh_lesson') {
		echo '
             <style type="text/css">
                #minor-publishing-actions{
                     display:none;
                }
             </style>
           ';
	}
}

function bh_custom_update_messages($messages)
{
	global $post, $post_ID;

	$post_types = get_post_types(['show_ui' => true, '_builtin' => false], 'objects');
	$currentSiteUrlPathArray = explode('/', get_site_url());
	$siteSlug = get_current_blog_id() === 4 ? 'bendcares' : 'learn';
	$root = 'https://' . $siteSlug . '.bendhealth.com';

	foreach ($post_types as $post_type => $post_object) {
		$messages[$post_type] = [
			0 => '',
			1 => $post_type === 'bh_lesson' ? sprintf(__('%s updated. <a href="' . $root . '/lesson/%s">View lesson</a>'), $post_object->labels->singular_name, $post->post_name) : sprintf(__('%s updated.'), $post_object->labels->singular_name),
			2 => __('Custom field updated.'),
			3 => __('Custom field deleted.'),
			4 => $post_type === 'bh_lesson' ? sprintf(__('%s updated. <a href="' . $root . '/lesson/%s">View lesson</a>'), $post_object->labels->singular_name, $post->post_name) : sprintf(__('%s updated.'), $post_object->labels->singular_name),
			5 => isset($_GET['revision']) ? sprintf(__('%s restored to revision from %s'), $post_object->labels->singular_name, wp_post_revision_title((int) $_GET['revision'], false)) : false,
			6 => $post_type === 'bh_lesson' ? sprintf(__('%s published. <a href="' . $root . '/lesson/%s">View lesson</a>'), $post_object->labels->singular_name, $post->post_name) : sprintf(__('%s published.'), $post_object->labels->singular_name),
			7 => sprintf(__('%s saved.'), $post_object->labels->singular_name),
			8 => sprintf(__('%s submitted.'), $post_object->labels->singular_name),
			9 => sprintf(__('%s scheduled for: <strong>%1$s</strong>.'), $post_object->labels->singular_name, date_i18n(__('M j, Y @ G:i'), strtotime($post->post_date))),
			10 => sprintf(__('%s draft updated'), $post_object->labels->singular_name),
		];
	}

	return $messages;
}
add_filter('post_updated_messages', 'bh_custom_update_messages');

function bh_init_hook_functions()
{
	register_post_type('bh_lesson', [
		'labels' => [
			'name' => __('Lessons', 'bh-textdomain'),
			'singular_name' => __('Lesson', 'bh-textdomain'),
		],
		'public' => true,
		'show_ui' => true,
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'hierarchical' => false,
		'graphql_single_name' => 'lesson',
		'graphql_plural_name' => 'lessons',
		'menu_icon' => 'dashicons-welcome-learn-more',
		'supports' => ['title', 'thumbnail'],
		'rewrite' => [
			'slug' => 'lesson',
			'with_front' => false
		]
	]);

	register_taxonomy('lesson_audience', 'bh_lesson', [
		'labels' => [
			'name' => __('Lesson Audiences', 'bh-textdomain'),
			'singular_name' => __('Lesson Audience', 'bh-textdomain'),
		],
		'public' => true,
		'show_ui' => true,
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'hierarchical' => true,
		'graphql_single_name' => 'lessonAudience',
		'graphql_plural_name' => 'lessonAudiences',
		'show_admin_column' => true,
	]);

	register_taxonomy('lesson_topic', 'bh_lesson', [
		'labels' => [
			'name' => __('Lesson Topics', 'bh-textdomain'),
			'singular_name' => __('Lesson Topic', 'bh-textdomain'),
		],
		'public' => true,
		'show_ui' => true,
		'show_in_rest' => true,
		'show_in_graphql' => true,
		'hierarchical' => true,
		'graphql_single_name' => 'lessonTopic',
		'graphql_plural_name' => 'lessonTopics',
		'show_admin_column' => true,
	]);
}

function modify_acf_wysiwyg_toolbars($toolbars)
{
	unset($toolbars['Full'], $toolbars['Basic']);

	$toolbars['Full'] = [];
	$toolbars['Full'][1] = [
		'styleselect',
		'bold',
		'italic',
		'link',
		'unlink',
		'bullist',
		'numlist',
		'blockquote',
		'removeformat'
	];

	$toolbars['Basic'] = [];
	$toolbars['Basic'][1] = [
		'styleselect',
		'bold',
		'italic',
		'link',
		'unlink',
		'removeformat'
	];

	return $toolbars;
}
function modify_tiny_mce_format_options($initArray)
{
	$styleFormats = [];

	$styleFormats = array_merge($styleFormats, [
		[
			'title' => 'Headline 1',
			'block' => 'h1',
			'classes' => 'h1',
		],
		[
			'title' => 'Headline 2',
			'block' => 'h2',
			'classes' => 'h2',
		],
		[
			'title' => 'Headline 3',
			'block' => 'h3',
			'classes' => 'h3',
		],
		[
			'title' => 'Headline 4',
			'block' => 'h4',
			'classes' => 'h4',
		],
		[
			'title' => 'Headline 5',
			'block' => 'h5',
			'classes' => 'h5',
		],
		[
			'title' => 'Paragraph 1',
			'block' => 'p',
			'classes' => 'p1',
		],
		[
			'title' => 'Paragraph 2',
			'block' => 'p',
			'classes' => 'p2',
		],
		[
			'title' => 'Paragraph 3',
			'block' => 'p',
			'classes' => 'p3',
		],
		[
			'title' => 'Paragraph 4',
			'block' => 'p',
			'classes' => 'p4',
		],
		[
			'title' => 'Subhead',
			'block' => 'p',
			'classes' => 'w-subhead',
		],
	]);

	$initArray['relative_urls'] = true;
	$initArray['textcolor_rows'] = 1;
	$initArray['style_formats'] = json_encode($styleFormats);

	return $initArray;
}

add_filter('post_type_link', function ($post_link, $post) {
	if ($post && 'bh_lesson' === $post->post_type) {
		$currentSiteUrlPathArray = explode('/', get_site_url());
		$siteSlug = get_current_blog_id() === 4 ? 'bendcares' : 'learn';
		$link = 'https://' . $siteSlug . '.bendhealth.com/';
		$lessonTopics = get_the_terms($post->ID, 'lesson_topic');
		$lessonAudiences = get_the_terms($post->ID, 'lesson_audience');
		$lessonNumber = get_field('lesson_number', $post->ID, false);
		$link .= $lessonTopics ? $lessonTopics[0]->slug . '/' : 'NO_TOPIC/';
		$link .= $lessonAudiences ? $lessonAudiences[0]->slug . '/' : 'NO_AUDIENCE/';
		$link .= is_int($lessonNumber) || is_string($lessonNumber) ? ($lessonNumber == 00 ? $lessonNumber = 0 . '/' : $lessonNumber . '/') : 'NO_NUMBER/';

		return $link . $post->post_name;
	}
	return $post_link;
}, 10, 2);

// add_filter('tiny_mce_before_init', function ($mce_init) {
// 	$content_css = get_stylesheet_directory_uri() . '/wordpress-tailwind-wp.css';

// 	//Grab existing stylesheets and then add our new $content_css
// 	if (isset($mce_init['content_css'])) {
// 		$content_css_new = $mce_init['content_css'] . ',' . $content_css;
// 	}

// 	$mce_init['content_css'] = $content_css_new;

// 	return $mce_init;
// });

function add_characters_option_page()
{
	if (function_exists('acf_add_options_page') && get_current_blog_id() === 1) {
		acf_add_options_page([
			'page_title' => 'Characters',
			'menu_title' => 'Characters',
			'menu_slug' => 'characters',
			'icon_url' => 'dashicons-welcome-learn-more',
			'redirect' => false,
			'show_in_graphql' => true,
		]);

		acf_add_options_page([
			'page_title' => 'Frontend Redirections',
			'menu_title' => 'Frontend Redirections',
			'menu_slug' => 'frontend-redirection',
			'icon_url' => 'dashicons-redo',
			'redirect' => false,
			'show_in_graphql' => true,
		]);
	}
}

add_characters_option_page();

// add_action('admin_menu', 'add_characters_option_page', 11, 0);

$gradientColors = ['#089C9C', '#39BC66', '#A0D088', '#EED65B', '#FFA578', '#FF7291', '#B666B6', '#6471B4', '#62605C', '#B666B6', '#FB5D80', '#6471B4', '#B666B6', '#089C9C', '#6471B4', '#25AA52', '#089C9C', '#62A540', '#25AA52', '#C18B01', '#62A540', '#ED6E2E', '#C18B01', '#FB5D80', '#ED6E2E', '#62605C', '#97948D'];

function add_custom_admin_js()
{
	?>
<script type="text/javascript">
	(function($) {
		if (typeof acf === 'undefined' || !acf.add_filter) return;

		acf.add_filter('color_picker_args', function(args, field) {
			args.palettes = ['#089C9C', '#39BC66', '#A0D088', '#EED65B', '#FFA578', '#FF7291'];

			return args;
		});
	})(jQuery);
</script>
<?php
}

add_action('admin_footer', 'add_custom_admin_js', 10, 1);

add_filter('upload_mimes', 'extra_mime_types', 1, 1);
function extra_mime_types($mime_types)
{
	$mime_types['riv'] = 'application/octet-stream';

	return $mime_types;
}

/**
 * Display a custom taxonomy dropdown in admin
 * @author Mike Hemberger
 * @link http://thestizmedia.com/custom-post-type-filter-admin-custom-taxonomy/
 */
add_action('restrict_manage_posts', 'tsm_filter_post_type_by_taxonomy');
function tsm_filter_post_type_by_taxonomy()
{
	global $typenow;
	$post_type = 'bh_lesson';
	$taxonomies = ['lesson_topic', 'lesson_audience'];
	if ($typenow == $post_type) {
		foreach ($taxonomies as $taxonomy) {
			$selected = isset($_GET[$taxonomy]) ? $_GET[$taxonomy] : '';
			$info_taxonomy = get_taxonomy($taxonomy);
			wp_dropdown_categories([
				'show_option_all' => sprintf(__('Show all %s', 'textdomain'), $info_taxonomy->label),
				'taxonomy' => $taxonomy,
				'name' => $taxonomy,
				'orderby' => 'name',
				'selected' => $selected,
				'show_count' => true,
				'hide_empty' => true,
			]);
		}
	};
}
/**
 * Filter posts by taxonomy in admin
 * @author  Mike Hemberger
 * @link http://thestizmedia.com/custom-post-type-filter-admin-custom-taxonomy/
 */
add_filter('parse_query', 'tsm_convert_id_to_term_in_query');
function tsm_convert_id_to_term_in_query($query)
{
	global $pagenow;
	$post_type = 'bh_lesson';
	$taxonomies = ['lesson_topic', 'lesson_audience'];
	$q_vars = &$query->query_vars;
	foreach ($taxonomies as $taxonomy) {
		if ($pagenow == 'edit.php' && isset($q_vars['post_type']) && $q_vars['post_type'] == $post_type && isset($q_vars[$taxonomy]) && is_numeric($q_vars[$taxonomy]) && $q_vars[$taxonomy] != 0) {
			$term = get_term_by('id', $q_vars[$taxonomy], $taxonomy);
			$q_vars[$taxonomy] = $term->slug;
		}
	}
}
?>