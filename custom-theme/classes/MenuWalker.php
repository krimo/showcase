<?php

class CustomMenu extends Walker_Nav_Menu {

    //
    // Begin SubMenu Output if needed
    //
    function start_lvl( &$output, $depth = 0, $args = array() ) {

        $indent = str_repeat("\t", $depth);

        if ( $depth == 0 ) :
            $output .= "\n$indent<div class='sub-menu-wrap'><ul class='sub-menu flex'>\n";
        else :
            $output .= "\n$indent<ul class='sub-menu'>\n";
        endif;

    }

    function start_el( &$output, $item, $depth = 0, $args = [],  $id = 0 ) {

        // Example: Setup Variables & get custom fields that are attached to the menu item 
        //
        $item_id = $item->ID;		

        $color      = ( !empty( get_field('color', $item_id) ) ) ? get_field('color', $item_id) : null;
        $image      = ( !empty( get_field('off_image', $item_id) ) ) ? get_field('off_image', $item_id) : null;
        $field_1    = ( !empty( get_field('example_field_1', $item_id) ) ) ? get_field('example_field_1', $item_id) : null;
        $field_2    = ( !empty( get_field('example_field_2', $item_id) ) ) ? get_field('example_field_2', $item_id) : null;

        $classes = null;
        foreach( $item->classes as $class ) {
            $classes .= ' '.$class;
        }

        // Example: Alter and/or Add additional classes
        //
        if ( in_array('current-menu-item', $item->classes) ) :
            $current_item_class = ' active';
        else :
            $current_item_class = 'current';
        endif;

        // Example: Additional logic based on menu level/position etc
        //
        // if ( in_array('menu-item-has-children', $item->classes) ) :
        //  do something...
        // else :
        // 	do something else...
        // endif;


        // Example: Wrapping fields
        //
        // if ( $field_1 || $field_2 ) :
        //     $output .= '<div class="wrapper-example">';
        // endif;

        // if ( $field_1 ) :
        //     $output .= '<p class="class-example">'.$field_1.'</p>';
        // endif;

        // if ( $field_2) :
        //     $output .= '<p>'.$field_2.'</p>';
        // endif;

        // if ( $field_1 || $field_2 ) :
        //     $output .= '</div>';
        // endif;

        $output .= '<li class="'. $classes . ' '. strtolower($item->title) .' menu-item-'.$item_id.'">';	

        $output .= '<a href="'.$item->url.'" class="'.$current_item_class.'">';

        // Example: Add items/markup to menu
        //
        // if ( $image ) :
        //     $output .= '<img src="'.$image['url'].'" alt="" /></a>';
        // endif;

        $output .= '<a href="'.$item->url.'" class="'.$current_item_class.'">';
        $output .= $item->title;
        $output .= '</a>';
        
        // Example : Add an inline SVG to menu item 
        //
        // $output .= '<svg class="triangle" width="60px" height="25px" viewBox="0 0 60 25" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><polygon id="Triangle" fill="#FFFFFF" fill-rule="nonzero" points="30 0 60 25 0 25"></polygon></g></svg>';

        $output .= '' . "\n";

    }

    //
    // Wrap up SubMenu output if needed
    //
    function end_lvl( &$output, $depth = 0, $args = array() ) {
        $indent = str_repeat("\t", $depth);
        if ( $depth == 0 ) :
            $output .= "$indent</ul></div>\n";
        else :
            $output .= "$indent</ul>\n";
        endif;
    }

}

//
// Build menu as a select dropdown 
//
class Walker_Select_List extends Walker_Nav_Menu {

    function start_el(&$output, $item, $depth = 0, $args = [], $id = 0){
        $url = $item->url;
        $title = $item->title;
        $output = $output.'<option value="'.$url.'">'.$title.'</option>';
    }

}
