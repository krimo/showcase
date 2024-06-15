<?php
$modals = get_field('modals', 'options');

if ($modals) :
	foreach ($modals as $modal) :
		$modalID = str_replace(' ', '-', strtolower($modal['modal_id']));

		get_template_part('template-parts/modal', null, [
			'id' => $modal['modal_id'],
			'content' => $modal['modal_content']
		]);
	endforeach;
endif;
