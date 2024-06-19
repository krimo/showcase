<?php

    function parse_and_check_path($file, $ext) {

        $cpt = get_post_type();

        $file_base = basename($file, '.' . $ext);
        $cpt_file = str_replace($file_base, $file_base . '-' . $cpt, $file);
        $abs_path = ( strpos($file, $_SERVER["DOCUMENT_ROOT"]) === false ) ? @dirname(__FILE__, 3) . '/' . $cpt_file : $cpt_file;

        if ( file_exists($abs_path) ) {
            $file = $cpt_file;
        }

        if ( is_child_theme() ) {
            $parent_dir = get_template_directory();
            $child_dir = get_stylesheet_directory();
            $child_abs_path = str_replace($parent_dir, $child_dir, $file);
            if ( file_exists($child_abs_path) ) {
                $file = $child_abs_path;
            }
        }

        return $file;
    }

    function template_controller( $template ) {

        global $twig;

        echo get_header();

        $baseName = basename( $template, ".php" );
        $templateDir = get_template_directory() . '/templates/' . $baseName . '/';
        $model = $templateDir . $baseName . '.php';
        $view = 'templates/'. $baseName . '/' . $baseName . '.twig';

        if ( file_exists($model) ) {
            $model = parse_and_check_path($model, 'php');
            $view = parse_and_check_path($view, 'twig');
            include($model);
        }

        echo $twig->render($view, $data);

        echo get_footer();

    }

    add_filter('template_include', 'template_controller');
