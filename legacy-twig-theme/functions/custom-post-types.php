<?php

	// ADDING CUSTOM POST TYPE
	add_action('init', 'all_custom_post_types');

	// icons: https://developer.wordpress.org/resource/dashicons/

	function all_custom_post_types() {

		global $CUSTOM_POST_TYPES;
		$CUSTOM_POST_TYPES = array();

		$types = array(

			// Project
			array('the_type' => 'project',
					'single' => 'Project',
					'plural' => 'Projects',
					'hierarchical' => false,
					'support' => array('title'),
					'taxonomy' => array(),
					'menu_icon' => 'dashicons-format-video'
				),

			// Team
			array('the_type' => 'team-member',
					'single' => 'Team Member',
					'plural' => 'Team Members',
					'hierarchical' => false,
					'support' => array('title'),
					'taxonomy' => array(),
					'menu_icon' => 'dashicons-smiley'
				),

		);

		foreach ($types as $type) {

			$the_type = $type['the_type'];
			$single = $type['single'];
			$plural = $type['plural'];

			$CUSTOM_POST_TYPES[] = $the_type;

			$labels = array(
				'name' => _x($plural, 'post type general name'),
				'singular_name' => _x($single, 'post type singular name'),
				'add_new' => _x('Add New', $single),
				'add_new_item' => __('Add New '. $single),
				'edit_item' => __('Edit '.$single),
				'new_item' => __('New '.$single),
				'view_item' => __('View '.$single),
				'search_items' => __('Search '.$plural),
				'not_found' =>  __('No '.$plural.' found'),
				'not_found_in_trash' => __('No '.$plural.' found in Trash'),
				'parent_item_colon' => ''
			);

			$args = array(
				'labels' => $labels,
				'public' => true,
				'publicly_queryable' => true,
				'show_ui' => true,
				'query_var' => true,
				'rewrite' => true, // $rewriter,
				'capability_type' => 'post',
				'hierarchical' => $type['hierarchical'],
				'menu_position' => 5,
				'supports' => $type['support'],
				'menu_icon' => $type['menu_icon'],
				'taxonomies' => $type['taxonomy']
			);

		  	register_post_type($the_type, $args);


			// add custom post types to rest api
			// example link - /wp-json/wp/v2/news
			global $wp_post_types;
	    	$wp_post_types[$the_type]->show_in_rest = true;
	    	$wp_post_types[$the_type]->rest_base = $the_type;
	    	$wp_post_types[$the_type]->rest_controller_class = 'WP_REST_Posts_Controller';

		}


		// register custom taxonomies
		$taxonomies = array(

			array(
				'slug' => 'project-type',
				'single' => 'Project Type',
				'plural' => 'Project Types',
				'hierarchical' => true,
				'post_type' => 'project',
			),
			//
			// array(
			// 	'slug' => 'news-tag',
			// 	'single' => 'News Tag',
			// 	'plural' => 'News Tags',
			// 	'hierarchical' => false,
			// 	'post_type' => 'news',
			// ),

		);


		foreach ($taxonomies as $tax) {
			$slug = $tax['slug'];
			$single = $tax['single'];
			$plural = $tax['plural'];
			$hierarchical = $tax['hierarchical'];
			$postType = $tax['post_type'];


			$labels = array(
				'name'              => _x( $plural, 'taxonomy general name', 'textdomain' ),
				'singular_name'     => _x( $single, 'taxonomy singular name', 'textdomain' ),
				'search_items'      => __( 'Search '.$plural, 'textdomain' ),
				'all_items'         => __( 'All '.$plural, 'textdomain' ),
				'parent_item'       => __( 'Parent '.$single, 'textdomain' ),
				'parent_item_colon' => __( 'Parent '.$single, 'textdomain' ),
				'edit_item'         => __( 'Edit '.$single, 'textdomain' ),
				'update_item'       => __( 'Update '.$single, 'textdomain' ),
				'add_new_item'      => __( 'Add New '.$single, 'textdomain' ),
				'new_item_name'     => __( 'New '.$single.' Name', 'textdomain' ),
				'menu_name'         => __( $single, 'textdomain' ),
			);

			$args = array(
				'hierarchical'      => $hierarchical,
				'labels'            => $labels,
				'show_ui'           => true,
				'show_admin_column' => true,
				'query_var'         => true,
				'has_archive' 		=> true,
				'rewrite'           => array( 'slug' => $slug, 'with_front' => false ) // 'with_front' => false
			);

			register_taxonomy( $slug, array( $postType ), $args );

			// if your custom taxonomy pages aren't showing,
			// you may need to flush the rewrite rules
			// flush_rewrite_rules();
		}

	}

	function get_id_by_post_type($post_type) {
		global $wpdb;
		$query = 'SELECT post_id from wp_postmeta WHERE meta_key = "aggregator_post_type" AND meta_value = "'.$post_type.'" LIMIT 1';
		$row = current($wpdb->get_results($query, ARRAY_A));
		return (!empty($row['post_id']) && isset($row['post_id']) ) ? $row['post_id'] : false;
	}


	function getParents($results, $id_key, $db) {

	    // Init result
	    $actives = array();

	    // Loop through rows
	    foreach ($results as $result) {

            if ( !empty($result[$id_key]) ) {

	            // Store current to result
	            $actives[] = $result[$id_key];

	            // Query for parent
	            $parent_query = 'SELECT meta_value FROM wp_postmeta WHERE post_id = '.$result[$id_key].' AND meta_key = "_menu_item_menu_item_parent"';
	            $parent_rows = $db->get_results($parent_query, ARRAY_A);

	            // If we have results from the recursive parent, merge them here
	            if ($parent_actives = getParents($parent_rows, 'meta_value', $db)) {
	            	$actives = array_merge($actives, $parent_actives);
	            }

            }

	    }

	    // Return actives in an array
	    return $actives;

	}


	function custom_post_type_add_class_to_menu($classes) {

		global $post,
				$wpdb;

		if ( is_object($post) && $post->post_type != 'post' && $post->post_type != 'page' && !is_search() ) {

			// forms-resources
			$post_type_id = get_id_by_post_type($post->post_type);
			if ( $post_type_id ) {

				// Init Query
				$query = 'SELECT post_id FROM wp_postmeta WHERE meta_value = '.$post_type_id.' AND meta_key = "_menu_item_object_id"';
				$rows = $wpdb->get_results($query, ARRAY_A);

				// Get actives and parent actives and return array
				$actives = getParents($rows, 'post_id', $wpdb);


				foreach ( $actives as $active ) {
					if ( in_array('menu-item-'.$active, $classes) ) {
						$classes[] = 'current-menu-ancestor';
					}
				}

			}

		}

		return $classes;
	}

	if (!is_admin()) { add_filter('nav_menu_css_class', 'custom_post_type_add_class_to_menu'); }
