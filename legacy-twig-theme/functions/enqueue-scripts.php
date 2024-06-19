<?php

// include twig templates
function add_twig_templates()
{
	$dir = get_template_directory();
	$scan_dir = $dir . '/templates/';
	$folders = scandir($scan_dir);
	$twig_folders = [];
	foreach ($folders as $folder) {
		if ($folder !== '.' && $folder !== '..') {
			if (file_exists($scan_dir . $folder . '/' . $folder . '.twig')) {
				$twig_folders[] = $folder;
			}
		}
	}

	return $twig_folders;
}

// Load the scripts
function load_custom_scripts()
{
	// CSS
	wp_register_style('main-styles', TDIR . '/assets/css/styles.min.css');
	wp_enqueue_style('main-styles');

	wp_dequeue_script('jquery');
	wp_enqueue_script('main-js', TDIR . '/assets/js/dist/scripts.min.js', [], filemtime(get_template_directory() . '/assets/js/dist/scripts.min.js'), true);

	// use rewrite rules within js
	global $wp_rewrite;

	// save all module and template js files for use in InitModules.js
	$jsReInit = [];
	$themeFilePath = get_theme_file_path();

	$moduleFolders = scandir($themeFilePath . '/modules');
	foreach ($moduleFolders as $folder) {
		if ($folder[0] != '.') {
			$moduleFiles = scandir($themeFilePath . '/modules/' . $folder);

			foreach ($moduleFiles as $file) {
				if ($file[0] != '.' && strpos($file, '.js') !== false) {
					$js_class_name = str_replace('_', ' ', $file);
					$js_class_name = ucwords($js_class_name);
					$js_class_name = str_replace(' ', '', $js_class_name);

					$jsReInit[] = $js_class_name;
				}
			}
		}
	}

	$templateFolders = scandir($themeFilePath . '/templates');
	foreach ($templateFolders as $folder) {
		if ($folder[0] != '.') {
			$templateFiles = scandir($themeFilePath . '/templates/' . $folder);

			foreach ($templateFiles as $file) {
				if ($file[0] != '.' && strpos($file, '.js') !== false) {
					$js_class_name = str_replace('_', ' ', $file);
					$js_class_name = ucwords($js_class_name);
					$js_class_name = str_replace(' ', '', $js_class_name);

					$jsReInit[] = $js_class_name;
				}
			}
		}
	}

	wp_localize_script(
		'main-js',
		'php_vars',
		[
			'rewriteRules' => $wp_rewrite,
			'template_directory' => get_template_directory_uri(),
			'ajax_url' => admin_url('admin-ajax.php'),
			'modules_to_reinit' => $jsReInit
		]
	);

	$twig_folders = add_twig_templates();
	wp_localize_script('main-js', 'twig_templates', $twig_folders);
}
add_action('wp_enqueue_scripts', 'load_custom_scripts');

function load_admin_styles()
{
	wp_enqueue_style('admin_css', get_template_directory_uri() . '/assets/css/admin.min.css', false, '1.0.0');
}
add_action('admin_enqueue_scripts', 'load_admin_styles');

// Modify script URLs
// - avoid URLs to wrong domain
// - avoid caching errors
function modify_script_src($url)
{
	// lets leave admin out of this
	if (is_admin()) {
		return $url;
	}

	// remove version
	$url = explode('?ver=', $url);
	$url = $url[0];

	// remove site URL
	$url = str_replace(site_url(), '', $url);

	$abs_path = $_SERVER['DOCUMENT_ROOT'] . $url;

	// add modified time
	if (file_exists($abs_path) && $mod_time = filemtime($abs_path)) {
		$url .= '?update=' . $mod_time;
	}

	return $url;
}
add_filter('script_loader_src', 'modify_script_src');
add_filter('style_loader_src', 'modify_script_src');
