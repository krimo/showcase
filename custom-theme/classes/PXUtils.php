<?php

class PXUtils
{
	public static function add_google_analytics()
	{
		$code_type = (!empty(get_field('tracking_id_option', 'option'))) ? get_field('tracking_id_option', 'option') : null;
		$hostBlacklist = ['pixelsmith.co', 'wpengine.com', '.test', 'localhost'];

		$code = get_field('tracking_ga4', 'option');
		$initActive = !empty($code) && $_COOKIE['acceptedCookiePrompt'] !== 'no';

		$analyticsActive = array_reduce($hostBlacklist, function ($carry, $item) {
			return $carry && (strpos($_SERVER['HTTP_HOST'], $item) === false);
		}, $initActive);

		echo $code;
	}

	public static function include_svg_markup($value, $post_id, $field)
	{
		$url = parse_url($value['url']);
		$pathInfo = pathinfo($url['path']);

		if (!isset($pathInfo['extension'])) {
			return $value;
		}

		if ($pathInfo['extension'] === 'svg') {
			$svg = file_get_contents($_SERVER['DOCUMENT_ROOT'] . $url['path']);
			$value['svg'] = $svg;
		}

		return $value;
	}

	public static function format_acf_images($value, $post_id, $field)
	{
		if (isset($value['url'])) {
			$url = parse_url($value['url']);
			$pathInfo = pathinfo($url['path']);
		}

		// add inline svg to image array
		if (isset($pathInfo['extension']) && $pathInfo['extension'] === 'svg') {
			$svg = file_get_contents($_SERVER['DOCUMENT_ROOT'] . $url['path']);
			$value['svg'] = $svg;
		}

		if (isset($value['ID'])) {
			$value['html'] = wp_get_attachment_image($value['ID'], 'original');
		}

		return $value;
	}

	public static function format_acf_gallery_images($value, $post_id, $field)
	{
		if (!is_iterable($value)) {
			return;
		}

		foreach ($value as $i => $image) {
			if (isset($image['ID'])) {
				$value[$i]['html'] = wp_get_attachment_image($image['ID'], 'original');
			}
		}

		return $value;
	}

	public static function set_login_page_styles()
	{
		wp_enqueue_style('custom-login', get_template_directory_uri() . '/dist/login-page.min.css');

		$style = '';
		$logo = get_field('admin_logo', 'options');
		$background_color = get_field('background_color', 'options');
		$background_image = get_field('background_image', 'options');
		$background_image_position = get_field('background_image_position', 'options');
		$background_size = get_field('background_size', 'options');

		if (!empty($logo)) {
			$width = ((int) $logo['width'] > 320) ? 'auto' : $logo['width'] . 'px';
			$style .= '#login h1 a,
					.login h1 a {
						background-image: url(' . $logo['url'] . ');
						width: ' . $width . ';
						background-size: contain;
					}';
		}

		if (!empty($background_color)) {
			$style .= 'body.login {
				background-color: ' . $background_color . ';
			}';
		}

		if (!empty($background_image)) {
			$style .= 'body.login {
				background-image: url(' . $background_image['url'] . ');
				background-repeat: no-repeat;
			}';
		}

		if (!empty($background_image_position)) {
			$style .= 'body.login {
				background-position: ' . $background_image_position . ';
			}';
		}

		if (!empty($background_size)) {
			$style .= 'body.login {
				background-size: ' . $background_size . ';
			}';
		}

		echo '<style>' . $style . '</style>';
	}

	//
	// Pagination (Alter as needed)
	//
	public static function pagination_bar($query, $args_array = null)
	{
		$total_pages = $query->max_num_pages;
		$big = 999999999; // need an unlikely integer

		if ($total_pages > 1) {
			$paginate = paginate_links([
				'base' => str_replace($big, '%#%', esc_url(get_pagenum_link($big))),
				'total' => $query->max_num_pages,
				'current' => max(1, get_query_var('paged')),
				'format' => '?paged=%#%',
				'show_all' => false,
				'type' => 'plain',
				'end_size' => 2,
				'mid_size' => 4,
				'prev_next' => true,
				'prev_text' => sprintf('<i></i> %1$s', __('<', 'text-domain')),
				'next_text' => sprintf('%1$s <i></i>', __('>', 'text-domain')),
				'add_args' => $args_array, //add query string array( 'category' => $_GET['cat'] ) OR false
				'add_fragment' => '',
			]);
		}

		return $paginate;
	}

	public static function parse_custom_block(array $block, array|bool $blockFields): object
	{
		$b = new stdClass();

		$b->title = $block['title'];
		$b->name = $block['name'];
		$b->id = $blockFields['block_id'] ? str_replace(' ', '-', strtolower($blockFields['block_id'])) : $block['name'] . '-' . $block['id'];
		$b->classes = array_filter([...explode(' ', 'pxblock pxblock--' . str_replace('acf/', '', $block['name'])), $block['className'] ?? '', !empty($block['align']) ? ' align' . $block['align'] : '']);
		$b->classesString = implode(' ', $b->classes);

		return $b;
	}
}
