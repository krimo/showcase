<?php

// options reference - https://gist.github.com/sambody/5781062
function remove_page_meta_boxes() {
 remove_meta_box( 'postimagediv' , 'page' , 'normal' );
 // remove_meta_box( 'pageparentdiv' , 'page' , 'normal' );
 // remove_meta_box( 'commentstatusdiv','page', 'normal' );
}
add_action( 'admin_menu' , 'remove_page_meta_boxes' );
