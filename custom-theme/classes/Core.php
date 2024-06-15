<?php
namespace Pixelsmith;

require_once get_template_directory() . '/constants/CustomBlocks.php';
require_once get_template_directory() . '/constants/CustomPostTypes.php';
require_once get_template_directory() . '/constants/CustomTaxonomies.php';

class Core
{
	public static function setup_blocks_and_posts()
	{
		self::initialize_custom_post_types(PX_CUSTOM_POST_TYPES, PX_CUSTOM_TAXONOMIES);
	}

	public static function enqueue_assets()
	{
		wp_dequeue_style('wp-block-library');
		wp_dequeue_style('wp-block-library-theme');

		$manifestFile = json_decode(file_get_contents(get_template_directory() . '/mix-manifest.json'));

		foreach ($manifestFile as $key => $value) {
			if (strpos($key, 'app.css') !== false) {
				wp_enqueue_style('main', get_template_directory_uri() . $value, [], null);
			}

			if (strpos($key, 'manifest.js') !== false) {
				wp_enqueue_script('manifest', get_template_directory_uri() . $value, [], null, true);
			}

			if (strpos($key, 'vendor.js') !== false) {
				wp_enqueue_script('vendor', get_template_directory_uri() . $value, ['manifest'], null, true);
			}

			if (strpos($key, 'app.js') !== false) {
				wp_enqueue_script('main', get_template_directory_uri() . $value, ['vendor'], null, true);
			}
		}
	}

	public static function add_option_pages()
	{
		if (function_exists('acf_add_options_page')) {
			acf_add_options_page([
				'page_title' => 'Theme General Settings',
				'menu_title' => 'Theme Settings',
				'menu_slug' => 'theme-general-settings',
				'capability' => 'edit_posts',
				'redirect' => false
			]);

			acf_add_options_page([
				'page_title' => 'Modals',
				'menu_title' => 'Modals',
				'menu_slug' => 'theme-modals',
				'capability' => 'edit_posts',
				'icon_url' => 'dashicons-editor-expand',
				'redirect' => false
			]);
		}
	}

	public static function register_menu_areas()
	{
		register_nav_menus(
			[
				'main-menu' => __('Main Menu'),
				// 'main-menu-mobile'  => __( 'Main Mobile Menu'), // Use in case of emergency ;-)
				'footer-col-one' => __('Footer Column One'),
				'footer-col-two' => __('Footer Column Two'),
				'footer-col-three' => __('Footer Column Three'),
				// 'footer-mobile' 	=> __('Footer Mobile'),	// Use in case of emergency ;-)
			]
		);

		// Important for calling proper menus
		global $theme_locations;
		$theme_locations = get_nav_menu_locations();
	}

	public static function initialize_custom_post_types(array $customPostTypes = [], array $customTaxonomies = [])
	{
		foreach ($customPostTypes as $p) {
			$args = [
				'labels' => [
					'name' => _x($p['plural'], 'post type general name'),
					'singular_name' => _x($p['single'], 'post type singular name'),
					'add_new' => _x('Add New', $p['single']),
					'add_new_item' => __('Add New ' . $p['single']),
					'edit_item' => __('Edit ' . $p['single']),
					'new_item' => __('New ' . $p['single']),
					'view_item' => __('View ' . $p['single']),
					'search_items' => __('Search ' . $p['plural']),
					'not_found' => __('No ' . $p['plural'] . ' found'),
					'not_found_in_trash' => __('No ' . $p['plural'] . ' found in Trash'),
					'parent_item_colon' => ''
				],
				'public' => true,
				'publicly_queryable' => true,
				'show_ui' => true,
				'show_in_rest' => true,
				'query_var' => true,
				'rewrite' => true,
				'capability_type' => 'post',
				'hierarchical' => $p['hierarchical'],
				'menu_position' => 5,
				'supports' => $p['supports'],
				'menu_icon' => $p['menu_icon'],
				'taxonomies' => $p['taxonomy']
			];

			register_post_type($p['slug'], $args);
		}

		foreach ($customTaxonomies as $t) {
			$args = [
				'labels' => [
					'name' => _x($t['plural'], 'taxonomy general name', 'textdomain'),
					'singular_name' => _x($t['single'], 'taxonomy singular name', 'textdomain'),
					'search_items' => __('Search ' . $t['plural'], 'textdomain'),
					'all_items' => __('All ' . $t['plural'], 'textdomain'),
					'parent_item' => __('Parent ' . $t['single'], 'textdomain'),
					'parent_item_colon' => __('Parent ' . $t['single'], 'textdomain'),
					'edit_item' => __('Edit ' . $t['single'], 'textdomain'),
					'update_item' => __('Update ' . $t['single'], 'textdomain'),
					'add_new_item' => __('Add New ' . $t['single'], 'textdomain'),
					'new_item_name' => __('New ' . $t['single'] . ' Name', 'textdomain'),
					'menu_name' => __($t['single'], 'textdomain')
				],
				'hierarchical' => $t['hierarchical'],
				'show_ui' => true,
				'show_admin_column' => true,
				'show_in_rest' => true,
				'query_var' => true,
				'has_archive' => true,
				'rewrite' => ['slug' => $t['slug'], 'with_front' => false]
			];

			register_taxonomy($t['slug'], [$t['post_type']], $args);
		}
	}

	public static function initialize_custom_blocks()
	{
		if (!function_exists('acf_register_block_type') || !is_array(PX_CUSTOM_BLOCKS)) {
			return;
		}

		$customBlockCategories = [
			[
				'slug' => 'custom-blocks',
				'title' => __('Custom Blocks', 'custom-blocks')
			]]
		;

		add_action('acf/init', function () {
			foreach (PX_CUSTOM_BLOCKS as $block) {
				acf_register_block_type($block);
			}
		});

		add_filter('allowed_block_types_all', fn () => [
			'core/block',
			'gravityforms/form',
			...array_map(fn ($block) => 'acf/' . $block['name'], PX_CUSTOM_BLOCKS)
		]);

		add_filter('block_categories_all', fn ($categories) => [...$categories, ...$customBlockCategories], 10, 2);
	}

	public static function theme_setup()
	{
		add_theme_support('menus');
	}
}
