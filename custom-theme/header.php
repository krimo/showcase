<!DOCTYPE html>
<html class="no-js <?= isset($_GET['grid']) ? 'debug' : '' ?>" <?php language_attributes(); ?>>

<head>
	<meta charset="<?php bloginfo('charset'); ?>" />
	<meta name="viewport" content="width=device-width,initial-scale=1">
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />

	<?php
		$favicon = get_field('favicon', 'options');
if ($favicon) {
	echo '<link rel="icon" type="image/png" href="' . $favicon['url'] . '">';
}
?>

	<title><?php wp_title(); ?></title>

	<?= get_field('global_header_scripts', 'option'); ?>
	<?= get_field('content_header_scripts'); ?>

	<?php wp_head(); ?>
</head>

<body>

	<?php wp_body_open(); ?>


	<a href="#pxMainContent" class="skip_to_main_link"><?= get_field('skip_content_label', 'option') ?></a>

	<?php if (!isset($_COOKIE['acceptedCookiePrompt']) && get_field('activate_gdpr', 'option')) : ?>
	<div role="region" aria-label="<?php _e('Cookie consent banner', 'pxdomain') ?>" class="cookie-banner">
		<div class="container">
			<p><?= get_field('gdpr_label', 'option') ?></p>
			<div class="cookie-banner__actions">
				<button class="accept"><?php _e('Accept', 'pxdomain') ?></button>
				<button class="dismiss"><?php _e('Dismiss', 'pxdomain') ?></button>
			</div>
		</div>
	</div>
	<?php endif; ?>

	<header class="site-header">
		<div class="container">

			<nav class="flex items-center justify-between">

				<a href="/" class="logo">
					<?php if(empty(get_field('site_logo', 'option'))) : ?>
					<?= file_get_contents(get_template_directory() . '/assets/images/logo.svg'); ?>
					<?php elseif(!empty(get_field('site_logo', 'option')['svg'])) : ?>
					<?= get_field('site_logo', 'option')['svg']; ?>
					<?php else : ?>
					<?= get_field('site_logo', 'option')['html']; ?>
					<?php endif; ?>
				</a>

				<?php
				//
			// check for existence of menu
				//
			if (has_nav_menu('main-menu')) :

				wp_nav_menu([
					//'menu' => 'Main Menu',
					'menu_class' => 'nav-items',
					'container' => false,
					'walker' => new CustomMenu(),
					'theme_location' => 'main-menu'
				]);

			else :
				echo 'Main Menu Not Found';
			endif;
?>

			</nav>

			<button class="lg:hidden" aria-expanded="false" aria-controls="menu">
				<span></span>
				<span></span>
				<span></span>
				<span></span>
			</button>

		</div>
	</header>

	<main id="pxMainContent">