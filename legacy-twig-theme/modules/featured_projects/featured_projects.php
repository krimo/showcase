<?php

	$module['arrowSVG'] = '<?xml version="1.0" encoding="UTF-8"?>
				<svg width="18px" height="33px" viewBox="0 0 18 33" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
				    <title>Arrow/Down</title>
				    <g id="Home" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
				        <g id="Homepage" transform="translate(-1358.000000, -2760.000000)" fill="#FFFFFF">
				            <g id="VIDEO-2" transform="translate(0.000000, 2013.000000)">
				                <g id="Arrow/Down" transform="translate(1358.000000, 747.000000)">
				                    <g id="Group-2-Copy">
				                        <path d="M16.6048632,23.5637255 L9.82066869,30.25 L9.82066869,0.808823529 C9.82066869,0.37745098 9.43768997,0 9,0 C8.56231003,0 8.17933131,0.37745098 8.17933131,0.808823529 L8.17933131,30.3039216 L1.39513678,23.5637255 C1.0668693,23.2401961 0.574468085,23.2401961 0.246200608,23.5637255 C-0.0820668693,23.8872549 -0.0820668693,24.372549 0.246200608,24.6960784 L8.45288754,32.7843137 C8.50759878,32.8382353 8.61702128,32.9460784 8.72644377,32.9460784 C8.83586626,33 8.94528875,33 9,33 C9.05471125,33 9.21884498,33 9.27355623,32.9460784 C9.38297872,32.8921569 9.49240122,32.8382353 9.54711246,32.7843137 L17.7537994,24.6960784 C18.0820669,24.372549 18.0820669,23.8872549 17.7537994,23.5637255 C17.4802432,23.2401961 16.9331307,23.2401961 16.6048632,23.5637255 Z" id="Shape" fill-rule="nonzero"></path>
				                    </g>
				                </g>
				            </g>
				        </g>
				    </g>
				</svg>';

	foreach ( $module['project_listing'] as $key => $project ) {

		$project = $project['project'];

		$cats = array();
		$terms = get_the_terms( $project->ID, 'project-type' );
		foreach ( $terms as $term ) {
			$cats[] = $term->name;
		}
		$project->cats = strtoupper(implode(', ', $cats));

		$id = $project->ID;

		if ( false === ( $fields = get_transient( 'project-meta-' . $id ) ) ) {
			 // this code runs when there is no valid transient set
			 $fields = get_fields($id);
			 set_transient('project-meta-' . $id, $fields);
		}

		// modify vimeo iframe
		$project->vimeo = $fields['vimeo'];
		$project->vimeo = str_replace('" width="', '&autoplay=1 width="', $project->vimeo);

		$project->tagline = $fields['tagline'];
		$project->poster = $fields['poster'];
		$project->client = $fields['client'];
		$project->mobile_image = $fields['mobile_featured_image'];
		$project->name = get_the_title($project->ID);
		$project->looping_video = $fields['looping_video'];

		if ( !empty($project->poster) ) {
			mq_bg_image($project->poster);
		}

		if ( !empty($project->mobile_image) ) {
			mq_mobile_bg_image($project->mobile_image, $project->poster['ID']);
		}

		unset($module['project_listing'][$key]['project']);
		$module['project_listing'][$key] = $project;

	}

	echo '<script>';
	echo 'var project_data = project_data || [];' . "\n";
	foreach ( $module['project_listing'] as $key => $project ) {
		echo 'project_data["'.$project->post_name.'"] = ' . json_encode($project->vimeo) . ';' . "\n";
	}
	echo '</script>';
