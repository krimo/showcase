<?php

function shuffle_text($attr)
{
	$options = $attr['options'];
	$options = explode('|', $options);

	return '<span data-idx="0" data-transition-duration="' . $attr['transition-duration'] . '" data-word-duration="' . $attr['word-duration'] . '" data-shuffle=\'' . json_encode($options) . '\'>' . $options[0] . '</span>';
}

add_shortcode('shuffle', 'shuffle_text');

function current_year()
{
	return date('Y');
}

add_shortcode('year', 'current_year');

function get_shortcode_menu($attr)
{
	$menu = wp_nav_menu(
		[
			'echo' => false,
			'menu' => $attr['menu'],
			'container' => false,
			'walker' => new Walker_Icon_Menu()
		]
	);
	return $menu;
}

add_shortcode('menu', 'get_shortcode_menu');

function equation_animation_html()
{
	$html = '';
	$html .= '<div class="equation-animation">';
	$html .= '<div class="chat"></div><!-- /.chat -->';
	$html .= '<div class="plus"></div><!-- /.plus -->';
	$html .= '<div class="remedy-equation"></div><!-- /.remedy-equation -->';
	$html .= '<div class="equals"></div><!-- /.equals -->';
	$html .= '<div class="love"></div><!-- /.love -->';
	$html .= '</div><!-- /.equation-animation -->';
	return $html;
}

add_shortcode('equation-animation', 'equation_animation_html');
