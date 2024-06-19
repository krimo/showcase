<!DOCTYPE html>
<html class="no-js" <?php language_attributes(); ?>>

<head>
	<meta charset="<?php bloginfo('charset'); ?>" />
	<title><?php wp_title(); ?></title>
	<meta name="viewport" content="width=device-width,initial-scale=1">
	<meta http-equiv="X-UA-Compatible" content="IE=edge" />
	<meta name="theme-color" content="#141e30">
	<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
	<link rel="stylesheet" href="https://use.typekit.net/inj2ylz.css">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.0/animate.min.css" />
	<?php wp_head(); ?>
</head>

<?php $currentID = get_the_ID(); ?>

<body class="<?php echo get_custom_body_class($currentID); ?>">
	<div class="overflow">

	<div class="site-header">

		<div class="container">

			<div class="site-header__content">

				<div class="border">

					<div class="site-header__logo">
						<a href="/"><?php echo bloginfo('name') ?></a>
					</div>
					<!-- /.site-header__logo -->

					<div class="site-header__menu">
						<div class="site-header__menu-close"></div>
						<?php wp_nav_menu( array('menu' => 'Main Menu', 'container'=> false) ) ?>

						<div class="mobile-extras wysiwyg">
							<?php
								$mobile = get_field('mobile_menu', 'options');
								echo $mobile;
							?>
						</div>
						<!-- /.mobile-extras -->
					</div>
					<!-- /.site-header__nav -->

					<div class="mobile-menu-button">
						<span></span>
					</div>
					<!-- /.mobile-menu-button -->

				</div>
				<!-- /.border -->

			</div>
			<!-- /.site-header__content -->

		</div>
		<!-- /.container -->

	</div>
	<!-- /.header -->


	<div id="content-wrapper">
