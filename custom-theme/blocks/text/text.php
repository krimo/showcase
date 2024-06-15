<?php
$blockFields = get_fields();
$customBlock = PXUtils::parse_custom_block($block, $blockFields);

if (is_array($blockFields)) {
	extract($blockFields);
}
?>

<div id="<?= $customBlock->id ?>" class=" <?= $customBlock->classesString ?>">

	<?= $is_preview ? '<span class="block-preview-label">' . $customBlock->title . '</span>' : '' ?>

	<div class="container">
		<div class="wysiwyg">
			<?= $text ?>
		</div>
	</div>
</div>