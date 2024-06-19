<?php

function my_acf_format_value($value, $post_id, $field)
{
	if (!$value) {
		return $value;
	}

	$url = parse_url($value['url']);
	$pathInfo = pathinfo($url['path']);

	if (!isset($pathInfo['extension'])) {
		return $value;
	}

	if ($pathInfo['extension'] === 'svg') {
		$svg = file_get_contents($_SERVER['DOCUMENT_ROOT'] . $url['path']);
		return $svg;
	}

	return $value;
}

add_filter('acf/format_value/type=image', 'my_acf_format_value', 100, 3);
