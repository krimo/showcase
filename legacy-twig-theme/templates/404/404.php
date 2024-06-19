<?php
	$post = get_field('404_page', 'option');

	if($post){

		$postID = $post->ID;

		if(isset($ajaxed)){
			global $post;
			$post = get_post( $postID, OBJECT );
			setup_postdata( $post );
			$ajaxPostID = $postID;
		}

		$data['post'] = $post;
		$data['options'] = get_fields('options');
		$fields = get_fields($post);
		$modules = $fields['modules'];

		if(isset($modules) && !empty($modules)){

			// include each module's model and template
			$i = 0;
			foreach( (array) $modules as $moduleData ){

				$moduleName = $moduleData['acf_fc_layout'];
				$module = $moduleData;

				$moduleView = get_template_directory().'/modules/'. $moduleName .'/'. $moduleName .'.twig';
				$module['exists'] = file_exists($moduleView);

				$model = get_template_directory().'/modules/'. $moduleName .'/mod-'. $moduleName .'.php';
				if(file_exists($model)){ include( $model ); }

				$data['modules'][$i] = $module;

				$i++;
			}

		}

		wp_reset_postdata();

	} // end if $post
