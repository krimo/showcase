<?php

function tiny_mce_elements($initArray)
{
	$initArray['toolbar1'] = 'styleselect,|,blockquote,|,hr,|,removeformat,|,bullist,numlist,|,link,unlink,|,undo,redo';
	$initArray['toolbar2'] = '';
	$initArray['relative_urls'] = true;

	$style_formats = array(

		array(
			'title' => 'Paragraph',
			'block' => 'p',
		),

		array(
			'title' => 'H1',
			'block' => 'h1',
		),

		array(
			'title' => 'H2',
			'block' => 'h2',
		),

		array(
			'title' => 'H3',
			'block' => 'h3',
		),

		array(
			'title' => 'H4',
			'block' => 'h4',
		),

		array(
			'title' => 'Blue Heading',
			'inline' => 'span',
			'classes' => 'blue',
			'selector' => 'h1, h2, h3, h4'
		),

		array(
			'title' => 'Button',
			'inline' => 'a',
			'selector' => 'a',
			'classes' => 'button'
		)

	);

	$initArray['style_formats'] = json_encode($style_formats);
	// $initArray['theme_advanced_blockformats'] = 'p,h1,h2,h3';
	// $initArray['theme_advanced_styles'] = 'Heading=intro, Subhead=h2, Feature Link=feature-link';

	return $initArray;
}
add_filter('tiny_mce_before_init', 'tiny_mce_elements');


function tiny_css($wp)
{
	$wp .= ',' . TDIR . '/assets/css/styles.min.css';
	return $wp;
}
add_filter('mce_css', 'tiny_css');


// Customize WYSIWYG
$wysiwyg_toolbar = array(
	'styleselect',
	'bold',
	'italic',
	'hr', 'link',
	'unlink',
	'bullist',
	'numlist',
	'indent',
	'blockquote',
	'alignleft',
	'aligncenter',
	'alignright',
	'removeformat'
);

function WYSIWYG_Toolbars($toolbars)
{

	global $wysiwyg_toolbar;
	// global $wysiwyg_toolbar_second;

	// remove the regular toolbars completely
	unset($toolbars['Basic']);
	unset($toolbars['Full']);

	// Custom Toolbar
	$toolbars['custom'] = array();
	$toolbars['custom'][1] = $wysiwyg_toolbar;

	// return $toolbars - IMPORTANT!
	return $toolbars;
}
add_filter('acf/fields/wysiwyg/toolbars', 'WYSIWYG_Toolbars');


// format the content
function format_output($content)
{
	$doc = new DOMDocument();
	$doc->loadHTML(mb_convert_encoding($content, 'HTML-ENTITIES', 'UTF-8'));
	$iframes = $doc->getElementsByTagName('iframe');
	$div = $doc->createElement('div');
	$div->setAttribute('class', 'iframe');

	foreach ($iframes as $f) {
		$iframeContainer = $div->cloneNode();
		$f->parentNode->replaceChild($iframeContainer, $f);
		$iframeContainer->appendChild($f);
	}

	$content = $doc->saveHTML();

	return $content;
}
add_filter('the_content', 'format_output', 10);

add_filter('acf/format_value/type=wysiwyg', 'format_value_wysiwyg', 10, 3);
function format_value_wysiwyg($value, $post_id, $field)
{
	$value = format_output($value);
	return $value;
}
