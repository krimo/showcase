<?php

	function mq_bg_image($image_obj, $size = 'full') {

		if ( isset( $image_obj['ID']) ) {

			$image_sizes = array(
				'full' => $image_obj['url'],
				'large' => $image_obj['sizes']['large'],
				'medium_large' => $image_obj['sizes']['medium_large'],
				'medium' => $image_obj['sizes']['medium'],
				'small' => $image_obj['sizes']['thumbnail']
			);

			if ( $size !== 'full' ) {

				$max_size = wp_get_attachment_image_src($image_obj['ID'], $size);

				foreach ( $image_sizes as $key => $val ) {
					if ( $image_sizes[$key] !== $max_size[0] ) {
						$image_sizes[$key] = $max_size[0];
					} else {
						break;
					}
				}

			}

			echo "\n" . '<style>' . "\n";

				echo '.bg-image-'.$image_obj['ID'].' { background-image: url('.$image_sizes['full'].'); }

@media screen and (max-width: 768px) {
	.bg-image-'.$image_obj['ID'].' { background-image: url('.$image_sizes['large'].'); }
}

@media screen and (max-width: 500px) {
	.bg-image-'.$image_obj['ID'].' { background-image: url('.$image_sizes['medium_large'].'); }
}';

			echo "\n" . '</style>' . "\n";
		}
	}


	function mq_mobile_bg_image($image_obj, $image_ID) {

		if ( isset( $image_obj['ID']) ) {

			$mobile_image_url = $image_obj['url'];

			echo "\n" . '<style>' . "\n";

echo '@media screen and (max-width: 500px) {
	div.bg-image-'.$image_ID.' { background-image: url('.$mobile_image_url.'); }
}';

			echo "\n" . '</style>' . "\n";
		}
	}
