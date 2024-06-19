<?php

	if(isset($ajaxed)){
		global $post;
		$post = get_post( $ajaxPostID, OBJECT );
		setup_postdata( $post );
	} else {
		$post = get_post();
	}

	$data['post'] = $post;

	$data['post_password'] = post_password_required($post->ID);

	$data['password_form'] = get_the_password_form($post->ID);

	$data['logged_in'] = ( !is_user_logged_in() && !ajax_cookie_check_user() ) ? 'false' : 'true';

	$login_args = array(
		'echo' => false,
		'redirect' => ( isset($_GET['path']) ) ? $_GET['path'] : $_SERVER['REQUEST_URI']
	);

	$data['login_form'] = wp_login_form($login_args);

	$data['options'] = get_fields('options');
	$fields = get_fields();
	$modules = $fields['modules'];

	if(isset($modules) && !empty($modules)){

		// include each module's model and template
		$i = 0;
		foreach( (array) $modules as $moduleData ){

			$moduleName = $moduleData['acf_fc_layout'];
			$module = $moduleData;

			$moduleView = get_template_directory().'/modules/'. $moduleName .'/'. $moduleName .'.twig';
			$module['exists'] = file_exists($moduleView);

			$model = get_template_directory().'/modules/'. $moduleName .'/'. $moduleName .'.php';
			if(file_exists($model)){ include( $model ); }

			$data['modules'][$i] = $module;

			$i++;
		}

	}

	wp_reset_postdata();
