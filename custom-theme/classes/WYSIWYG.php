<?php

class WYSIWYG
{
	public static function add_tinymce_editor_styles()
	{
		add_editor_style('dist/app.css');
	}

	public static function modify_acf_wysiwyg_toolbars($toolbars)
	{
		$fullToolbar = [
			'formatselect',
			'styleselect',
			'removeformat',
			'|',
			'bold',
			'italic',
			'blockquote',
			'hr',
			'|',
			'numlist',
			'bullist',
			'|',
			'link',
			'unlink',
			'|',
			'outdent',
			'indent',
			'alignleft',
			'aligncenter',
			'alignright'
		];

		$basicToolbar = [
			'bold',
			'italic',
			'link',
			'unlink',
			'forecolor',
			'removeformat'
		];

		unset($toolbars['Full'], $toolbars['Basic']);

		$toolbars['Full'] = [];
		$toolbars['Full'][1] = $fullToolbar;

		$toolbars['Basic'] = [];
		$toolbars['Basic'][1] = $basicToolbar;

		return $toolbars;
	}

	public static function modify_tiny_mce_format_options($initArray)
	{
		$styleFormats = [];
		$header_formats = [];

		for ($i = 1; $i < 7; $i++) {
			$header_formats[] = [
				'title' => 'Header' . $i,
				'selector' => 'h1, h2, h3, h4, h5, p, a, li, blockquote',
				'inline' => 'span',
				'classes' => 'h' . $i
			];
		}

		$text_colors = [
			[
				'title' => 'Dark Blue',
				'selector' => 'span, p, h1, h2, h3, h4, h5, a, ul, li, blockquote',
				'inline' => 'span',
				'classes' => 'color-dark-blue',
			],
			[
				'title' => 'Royal Blue',
				'selector' => 'span, p, h1, h2, h3, h4, h5, a, ul, li, blockquote',
				'inline' => 'span',
				'classes' => 'color-royal-blue',
			],
			[
				'title' => 'Cyan',
				'selector' => 'span, p, h1, h2, h3, h4, h5, span, a, ul, li, blockquote',
				'inline' => 'span',
				'classes' => 'color-cyan',
			],
			[
				'title' => 'Magenta',
				'selector' => 'span, p, h1, h2, h3, h4, h5, span, a, ul, li, blockquote',
				'inline' => 'span',
				'classes' => 'color-magenta',
			]
		];

		$styleFormats = array_merge($styleFormats, [
			[
				'title' => 'Header Formats',
				'items' => $header_formats
			],
			[
				'title' => 'Text Color',
				'items' => $text_colors
			],
			[
				'title' => 'Button',
				'inline' => 'a',
				'classes' => 'btn',
				'selector' => 'a'
			]
		]);

		// $custom_colors = '
		// "160f46", "Dark Blue",
		// "0e0fed", "Royal Blue",
		// "00a9e0", "Cyan",
		// "c529bb", "Magenta",
		// ';

		$initArray['block_formats'] = 'Paragraph=p; Header 1=h1; Header 2=h2; Header 3=h3; Header 4=h4; Header 5=h5';
		$initArray['body_class'] = 'wysiwyg';
		$initArray['style_formats_autohide'] = true;
		$initArray['relative_urls'] = true;
		// $initArray['textcolor_map'] = '[' . $custom_colors . ']';
		// $initArray['textcolor_rows'] = 1;
		$initArray['style_formats'] = json_encode($styleFormats);

		return $initArray;
	}
}
