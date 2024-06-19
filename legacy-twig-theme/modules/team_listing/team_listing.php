<?php
	// add extra data to the module like this:
	// $module['my_global_option'] = get_field('field_name', 'option');
	// then access in the twig file like this:
	// {{ module.my_global_option }}

	$team = array();

	foreach ( $module['team'] as $member ) {
		$member = $member['member'];

		$team[] = array(
			'name' => $member->post_title,
			'title' => get_field('title', $member->ID),
			'photo' => get_field('photo', $member->ID)
		);
	}

	$module['team'] = $team;
