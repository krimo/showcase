<?php

function yoastVariableToTitle($post_id) {

    $site_title = get_bloginfo('name');

    if ( class_exists('WPSEO_Option_Titles') ) {

        $yoast_title = get_post_meta($post_id, '_yoast_wpseo_title', true);
        $title = strstr($yoast_title, '%%', true);
        if (empty($title)) {
            $title = get_the_title($post_id);
        }
        $wpseo_titles = get_option('wpseo_titles');

        $sep_options = WPSEO_Option_Titles::get_instance()->get_separator_options();
        if (isset($wpseo_titles['separator']) && isset($sep_options[$wpseo_titles['separator']])) {
            $sep = $sep_options[$wpseo_titles['separator']];
        } else {
            $sep = '-'; //setting default separator if Admin didn't set it from backed
        }

        $meta_title = $title . ' ' . $sep . ' ' . $site_title;

        return $meta_title;

    } else {

        return $site_title;

    }



}
