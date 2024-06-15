<?php

use Pixelsmith\Core;

require_once __DIR__ . '/Core.php';
require_once __DIR__ . '/PXUtils.php';
require_once __DIR__ . '/WYSIWYG.php';
require_once __DIR__ . '/MenuWalker.php';
require_once __DIR__ . '/PXEditor.php';

class PXGutenbergTheme
{
	public static function init()
	{
		Core::initialize_custom_blocks();
		self::register_actions();
		self::register_filters();
	}

	public static function register_actions()
	{
		add_action('init', [Core::class, 'setup_blocks_and_posts']);
		add_action('wp_enqueue_scripts', [Core::class, 'enqueue_assets']);
		add_action('enqueue_block_editor_assets', [Core::class, 'enqueue_assets']);
		add_action('after_setup_theme', [Core::class, 'theme_setup']);
		add_action('init', [Core::class, 'register_menu_areas']);
		add_action('acf/init', [Core::class, 'add_option_pages']);
		add_action('wp_head', [PXUtils::class, 'add_google_analytics']);
		add_action('login_enqueue_scripts', [PXUtils::class, 'set_login_page_styles']);
		add_action('admin_init', [WYSIWYG::class, 'add_tinymce_editor_styles']);
	}

	public static function register_filters()
	{
		add_filter('acf/format_value/type=image', [PXUtils::class, 'format_acf_images'], 100, 3);
		add_filter('acf/format_value/type=gallery', [PXUtils::class, 'format_acf_gallery_images'], 100, 3);
		add_filter('acf/fields/wysiwyg/toolbars', [WYSIWYG::class, 'modify_acf_wysiwyg_toolbars'], 10, 1);
		add_filter('tiny_mce_before_init', [WYSIWYG::class, 'modify_tiny_mce_format_options'], 10, 1);
		add_filter('upload_mimes', fn ($mimeTypes) => ['svg' => 'image/svg+xml', ...$mimeTypes]);
	}
}
