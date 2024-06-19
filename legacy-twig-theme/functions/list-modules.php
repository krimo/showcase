<?php

	// use the list_modules() in a template function to list all modules and fields
	// dev use only

	function parseJson($file) {

		// if json file
		if ( strpos($file, 'json') !== false ) {

			$file_contents = json_decode(file_get_contents($file));
			foreach ( $file_contents->fields as $items ) {

				if( $items->label == 'Modules'){

					echo '<div class="acf-debug">';

					foreach ( $items->layouts as $key => $layout ) {

						// check for enabled modules of the correct name
						echo '<span class="acf-json-module">'.$layout->label . ' ('.$layout->name.' | '.$key.')</span>';

						foreach ( $layout->sub_fields as $field ) {
							echo '<dl>';
								echo '<dt><span class="acf-json-label">Label:</span> '.$field->label.'</dt>';
								echo '<dd><span class="acf-json-label">Name:</span> '.$field->name.'</dd>';
								echo '<dd><span class="acf-json-label">Type:</span> '.$field->type.'</dd>';
							echo '</dl>';
						}

						echo '<hr />';


					}

				}

				echo '</div><!-- /.acf-debug -->';

			}

		}

	}

	function list_modules() {

	    // get acf version
	    $json_location = acf_get_setting('load_json');
		$json_location = $json_location[0];

		// scan json director
		$files = scandir($json_location);

		if ( count($files) ) {
			echo '<style>
					.acf-json-section-heading {
						font-size: 30px;
						font-weight: bold;
						display: block;
					}

					.acf-json-module {
						font-size: 24px;
						font-weight: bold;
						display: block;
					}

					.acf-debug {
						border: 1px solid #333;
						padding: 20px;
						margin: 20px;
					}

					.acf-debug dl {
						margin: 20px;
					}

					.acf-debug dt {
						font-weight: bold;
					}

					.acf-debug hr:last-child {
						display: none;
					}

					.acf-debug hr:not(:last-child) {
						border: none;
						height: 1px;
						background: #666;
					}
				</style>';
		}

		// parse json files
		foreach ( $files as $file ) {

			switch ($file) {

				case '.':
				case '..':
					break;

				default:
					parseJson($json_location . '/' . $file);
					break;

			}

		}

	}
