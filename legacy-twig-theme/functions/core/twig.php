<?php

function include_twig()
{

	$dir = get_template_directory();
	require_once($dir . '/lib/vendor/autoload.php');

	$loader = new \Twig\Loader\FilesystemLoader($dir);

	global $twig;
	$twig = new \Twig\Environment($loader, [
		'autoescape' => false,
		'debug' => true
	]);

	$loader->addPath($dir . '/assets/images', 'images'); // custom namespace

	$twig->addExtension(new \Twig\Extension\DebugExtension());
}

add_action('wp_loaded', 'include_twig');
