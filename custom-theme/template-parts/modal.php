<?php
$args = wp_parse_args($args, ['id' => null, 'content' => null]);
$modalID = sanitize_title($args['id'])
?>

<?php if ($args['content'] !== null && $args['id'] !== null) :?>
<div id="<?= $modalID ?>" aria-hidden="true" class="modal relative z-10">
	<div class="fixed inset-0 bg-black bg-opacity-75 transition-opacity" tabindex="-1" data-micromodal-close>
		<div class="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0" role="dialog" aria-modal="true" aria-labelledby="<?= $modalID ?>">
			<div id="<?= $modalID ?>-content"
				class="relative bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 rounded-sm text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full">
				<button class="absolute top-3 right-3" aria-label="Close modal" data-micromodal-close>Close Modal</button>
				<?= $args['content'] ?>
			</div>
		</div>
	</div>
</div>
<?php endif; ?>