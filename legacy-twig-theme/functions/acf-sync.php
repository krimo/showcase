<?php

	function check_acf_sync() {

		if ( class_exists('acf_admin_field_groups') ) {
			$acf = new acf_admin_field_groups;
			$acf->check_sync();
			$sync = $acf->sync;

			if ( !empty($sync) ) {
				echo '<div class="notice notice-error is-dismissible">';
					echo '<p>Your custom fields are out of date, please update here:
						<a href="'.admin_url('edit.php?post_type=acf-field-group&post_status=sync').'">Sync available</a>.
						</p>';
				echo '</div>';
			}
		}

	}

	add_action( 'admin_notices', 'check_acf_sync' );