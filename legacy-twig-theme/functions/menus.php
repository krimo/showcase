<?php

	class Walker_Icon_Menu extends Walker {

		// Tell Walker where to inherit it's parent and id values
		var $db_fields = array(
			'parent' => 'menu_item_parent',
			'id'     => 'db_id'
		);

		function start_el( &$output, $item, $depth = 0, $args = array(), $id = 0 ) {

			$img_url = get_field('icon', $item->object_id);
			// $img_url = $img_url->url;

			// echo "<pre>", print_r($img_url), "</pre>";

			$output .= sprintf( "\n<li><a href='%s'%s>%s</a></li>\n",
				$item->url,
				'',
				$img_url
			);
		}

	}

	function menu_root_relative_urls( $atts, $item, $args ) {

		if ( !isset($atts['href']) ) { return $atts; }

		$atts['href'] = str_replace(site_url(), '', $atts['href']);

		if (is_multisite() && substr($atts['href'], 0, 1) === '/') {
			$currentBlog = get_blog_details();

			$atts['href'] = $currentBlog->siteurl . $atts['href'];
		}

		return $atts;
	}

	add_filter( 'nav_menu_link_attributes', 'menu_root_relative_urls', 10, 3 );
