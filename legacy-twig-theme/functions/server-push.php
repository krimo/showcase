<?php

	function set_ajax_transients() {

		$files = $_POST['files'];
		$url = $_POST['url'];
		$local_files = array();

		foreach( $files as $file ){

			$file_parts = parse_url($file);
			$file_path = $_SERVER['DOCUMENT_ROOT'] . $file_parts['path'];

			if( file_exists( $file_path ) ){

				if( $query = $file_parts['query'] ){
					$file_parts['path'] .= '?' . $query;
				}

				$local_files[] = $file_parts['path'];

				echo "\n";
				echo $file_parts['path'];
				echo "\n";
			}

		}

		set_transient( 'server_push_'. $url, $local_files );

		die();
	}

	add_action('wp_ajax_set_ajax_transients', 'set_ajax_transients');
	add_action('wp_ajax_nopriv_set_ajax_transients', 'set_ajax_transients');



	function push_resources() {

		$url = $_SERVER['REQUEST_URI'];

		// remove any query strings
		if( !empty($_SERVER['QUERY_STRING']) ){
			$query = '?'.$_SERVER['QUERY_STRING'];
			$url = str_replace( $query, '', $url );
		}

		// get transient for page
		if( $transient = get_transient( 'server_push_'. $url) ){

			$resources = array();

			foreach( $transient as $file ){
				$file_type = pathinfo($file);

				// if query string present, remove
				if ( strpos($file_type['extension'], '?') !== false ) {
					$file_type['extension'] = explode('?', $file_type['extension']);
					$file_type['extension'] = $file_type['extension'][0];
				}

				switch($file_type['extension']){
					case 'css':

						if ( !isset($resources['style']) || !in_array($file, $resources['style']) ) {
							$resources['style'][] = $file;
						}

						break;

					case 'js':
						if ( !isset($resources['script']) || !in_array($file, $resources['script']) ) {
							$resources['script'][] = $file;
						}
						break;
				}
			}

			$link_items = array();

			foreach ( $resources as $type => $items ) {
				foreach ( $items as $item ) {
					$link_items[] = '<' .$item . '>; rel=preload; as=' . $type;
				}
			}

			$link_str = implode(',', $link_items);

			// Server push only used with SSL
			if ( !empty($_SERVER['HTTPS']) ) {
				header('Link: ' . $link_str, false);
			}

		}

	}

	add_action( 'send_headers', 'push_resources' );


	// DELETE TRANSIENTS
	// Handy for transient dev
	function delete_all_transients() {

	    global $wpdb;

	    $sql = 'DELETE FROM ' . $wpdb->options . ' WHERE option_name LIKE "_transient_%"';
	    $wpdb->query($sql);

	}

	// add_action( 'init', 'delete_all_transients' );
