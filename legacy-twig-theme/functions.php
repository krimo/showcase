<?php

require_once __DIR__ . '/BoxApiSetup.php';

$BoxClient = new BoxAPISetup('xgpy05fdglx6rlx4g0pqpk7uuif4z12i', 'HN5WrWOqBatFB6UTFyompUS5Tf5yzxcX');
add_action('rest_api_init', [$BoxClient, 'register_endpoints']);


define('TDIR', get_bloginfo('template_directory'));

add_filter('use_block_editor_for_post', '__return_false');

$coreFunctions = scandir(dirname(__FILE__) . '/functions/core');

foreach ($coreFunctions as $file) {
	if ($file[0] != '.') {
		include('functions/core/' . $file);
	}
}

$functions = scandir(dirname(__FILE__) . '/functions');

foreach ($functions as $file) {
	if ($file[0] != '.' && $file != 'core') {
		include('functions/' . $file);
	}
}
