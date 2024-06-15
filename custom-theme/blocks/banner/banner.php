<?php

$blockFields = get_fields();
$customBlock = PXUtils::parse_custom_block($block, $blockFields);

if (is_array($blockFields)) {
	extract($blockFields);
}

?>
<div id="<?= $customBlock->id ?>" class="<?= $customBlock->classesString ?> aspect-video bg-cover bg-no-repeat bg-center"
	style="<?= $background_image ? "background-image: url({$background_image['url']});" : '' ?>">
	<?= $is_preview ? '<span class="block-preview-label">' . $block['title'] . '</span>' : '' ?>

	<div class="container">
		<h1><?= $headline ?? '' ?></h1>
	</div>
</div>