<?php
	$url = get_the_permalink();
?>
<div class="post">
	<h5 class="post__title"><a href="<?php echo $url ?>"><?php echo the_title(); ?></a></h5>
</div>
