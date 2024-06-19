<?php
function get_instagram($user_id = 254100412, $count = 20){

	$url = 'https://api.instagram.com/v1/users/'.$user_id.'/media/recent/?access_token=254100412.6098ab4.909cb1765fd046b6a7561cc7ba0a0a4c&count='.$count;

	$cache = get_template_directory() . '/instagram_cache/' .sha1($url).'.json';

	// If a cache file exists, and it is newer than 1 hour, use it
	if(file_exists($cache) && filemtime($cache) > time() - 60*60){
		$jsonData = json_decode(file_get_contents($cache));
	} else {
		$jsonData = json_decode((file_get_contents($url)));
		file_put_contents($cache,json_encode($jsonData));
	}

	if ( is_array($jsonData->data) ) {
		$noVideosArray = array_filter($jsonData->data, function($d) {
			return $d->type !== 'video';
		});

		return array_map(function($idx) use ($noVideosArray){
			return $noVideosArray[$idx];
		}, array_rand($noVideosArray, 16));
	}



}

$module['instagramFeed'] = get_instagram();
