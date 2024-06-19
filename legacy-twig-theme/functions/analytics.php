<?php

	// Google Analytics (if applicable)
	function get_ga_code() {

		if( class_exists('acf') ) {
			$ga_code = get_field('tracking_id', 'options');
		}

		if ( class_exists('acf') && !empty($ga_code) ) {
			return $ga_code;
		} else {
			return '';
		}

	}

	function add_ga_code() {
		if ( !empty(get_ga_code()) ) {
		?>
			<!-- Global site tag (gtag.js) - Google Analytics -->
			<script async src="https://www.googletagmanager.com/gtag/js?id=<?php echo get_ga_code(); ?>"></script>
			<script>
				window.dataLayer = window.dataLayer || [];
				function gtag(){dataLayer.push(arguments);}
				gtag('js', new Date());
				gtag('config', '<?php echo get_ga_code(); ?>');
			</script>
		<?php
		}
	}

	add_action('wp_head', 'add_ga_code');

?>
