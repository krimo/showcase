<?php
get_header();

	if (have_posts()) :
		while (have_posts()) :
			the_post();
			?>

			<section class="single-post">
				<div class="container">
					<?php echo the_content(); ?>
				</div>
			</section>

			<?php
		endwhile;
	endif;

get_footer();
?>