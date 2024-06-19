<?php

	function sync_module($layout_name, $sub_fields) {
		$tdir = get_template_directory();

		// check for general modules folder
		if ( !file_exists( $tdir . '/modules' ) ) {
			mkdir($tdir . '/modules');
		}

		// check for specific module folder
		if ( !file_exists( $tdir . '/modules/' . $layout_name ) ) {
			mkdir($tdir . '/modules/' . $layout_name);
		}

		// check all 4 subfiles exist:
		if ( !file_exists( $tdir . '/modules/' . $layout_name . '/' . $layout_name . '.php' ) ) {

			$fh = fopen($tdir . '/modules/' . $layout_name . '/' .$layout_name.'.php', 'w');
			$file_contents =
"<?php
	// add extra data to the module like this:
	// \$module['my_global_option'] = get_field('field_name', 'option');
	// then access in the twig file like this:
	// {{ module.my_global_option }}";

			fwrite($fh, $file_contents);
			fclose($fh);

		}
		if ( !file_exists( $tdir . '/modules/' . $layout_name . '/' . $layout_name . '.scss' ) ) {

			$fh = fopen($tdir . '/modules/' . $layout_name . '/' .$layout_name.'.scss', 'w');
			$file_contents =
".mod--".$layout_name." {

}";
			fwrite($fh, $file_contents);
			fclose($fh);

		}

		$js_class_name = str_replace('_', ' ', $layout_name);
		$js_class_name = ucwords($js_class_name);
		$js_class_name = str_replace(' ', '', $js_class_name);

		if ( !file_exists( $tdir . '/modules/' . $layout_name . '/' . $js_class_name . '.js' ) ) {
			$fh = fopen($tdir . '/modules/' . $layout_name . '/' .$js_class_name.'.js', 'w');

			$file_contents =

"var PX".$js_class_name." = (function() {
	'use strict';

	// var;

	function init() {

		events();
	}

	function events() {

	}

	return {
		init:init
	};
}());";
			fwrite($fh, $file_contents);
			fclose($fh);

		}
		if ( !file_exists( $tdir . '/modules/' . $layout_name . '/' . $layout_name . '.twig' ) ) {

			$file_contents = '<section class="mod mod--'.$layout_name.'">
';

			foreach($sub_fields as $sub_field){
				$sub_field_name = $sub_field->name;
				$sub_field_type = $sub_field->type;

				if($sub_field_type == 'image'){

					$file_contents = $file_contents .'
	{% if module.'.$sub_field_name.' %}
		<img src="{{ module.'.$sub_field_name.'.url }}" alt="{{ module.'.$sub_field_name.'.alt }}" />
	{% endif %}

';
				} else {

					$file_contents = $file_contents .'
	{% if module.'.$sub_field_name.' %}
		{{ module.'.$sub_field_name.' }}
	{% endif %}

';
				}

			}

			$file_contents = $file_contents . '</section>';

			$fh = fopen($tdir . '/modules/' . $layout_name . '/' .$layout_name.'.twig', 'w');
			fwrite($fh, $file_contents);
			fclose($fh);
		}

	}


	function sync_modules() {

	    // get acf version
	    $json_location = acf_get_setting('load_json');
		$json_location = $json_location[0];

		// scan json director
		$files = scandir($json_location);

		// parse json files
		foreach ( $files as $file ) {

			switch ($file) {

				case '.':
				case '..':
					break;

				default:

					if ( strpos($file, 'json') !== false ) {
						$file_contents = json_decode(file_get_contents($json_location.'/'.$file));

						foreach( $file_contents->fields as $items ) {

							if($items->name == 'modules'){
								if($items){
									foreach ( $items->layouts as $key => $layout ) {
										sync_module($layout->name, $layout->sub_fields);
									}
								}
							}
						}
					}

					break;

			}

		}

	}

	add_action('acf/field_group/admin_head', 'sync_modules', 20);
