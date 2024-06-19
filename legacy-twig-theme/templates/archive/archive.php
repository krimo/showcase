<?php
$qo = get_queried_object();

if( isset($ajaxed) ){
	$isTaxonomy = $archiveType == 'taxonomy';
	$isDateArchive = $archiveType == 'date';
} else {
	$isTaxonomy = isset($qo);
	$isDateArchive = !isset($qo);
}

// taxonomy archive
if( $isTaxonomy ){

	if( isset($ajaxed) ){
		$data['title'] = $term->name;
	} else {
		$data['title'] = single_term_title("", false);
		$taxonomy = $qo->taxonomy;
		$termSlug = $qo->slug;
	}

	$tax_posts = new WP_Query(array (
		'post_type' => 'any',
		'tax_query' => array(
			array(
				'taxonomy' => $taxonomy,
				'field'    => 'slug',
				'terms'    => $termSlug,
			),
		),
		'posts_per_page' => -1,
	));

	$data['test'] = $tax_posts;

}

// date archive
elseif( $isDateArchive ) {

	if( isset($ajaxed) ){
		$monthName = date('F', mktime(0, 0, 0, $month, 10));
		$data['title'] = $monthName . ' ' . $year;
	} else {
		$data['title'] = single_month_title(' ', false);
		$month = get_the_date('n');
		$year = get_the_date('Y');
	}

	$tax_posts = new WP_Query(array (
		'post_type' => 'any',		
		'date_query' => array(
			'year'  => $year,
			'month' => $month,
	  	),
		'posts_per_page' => -1,
	));

}


$data['posts'] = px_get_posts($tax_posts);
