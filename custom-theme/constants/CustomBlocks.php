<?php

define('PX_CUSTOM_BLOCKS', [
	/* PLOP_INJECT_EXPORT */

	[
		'name'            => 'banner',
		'title'           => __('Banner'),
		'description'     => __('A custom banner block.'),
		'render_template' => get_template_directory() . '/blocks/banner/banner.php',
		'category'        => 'custom-blocks',
		'icon'            => 'format-image',
		'keywords'        => ['banner', 'display'],
		'supports' => [
			'align' => false
		]
	],
	[
		'name'            => 'text',
		'title'           => __('Text'),
		'description'     => __('A custom text block.'),
		'render_template' => get_template_directory() . '/blocks/text/text.php',
		'category'        => 'custom-blocks',
		'icon'            => 'editor-textcolor',
		'keywords'        => ['text', 'editor', 'heading', 'paragraph', 'content'],
		'supports' => [
			'align' => false
		]
	]
]);
