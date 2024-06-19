<?php
function get_template_type($url){
  global $wp_rewrite;

  foreach( $wp_rewrite->rules as $pattern => $template ) {
    $pattern = '#' . $pattern . '#';
    $parsed = parse_url($template);

    if( preg_match($pattern, $url, $matches) ) {
      parse_str($parsed['query'], $query);
      reset($query);
      $first_key = key($query);

      $postType = $first_key;
      $postSlug = $matches[1];

      return array('post_type' => $postType, 'post_slug' => $postSlug);
    }
  }
}
