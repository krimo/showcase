<?php
get_header();
?>

	<section class="post-archive">
		<div class="container">

			<?php if ( have_posts() ) : ?>
				<div class="posts">
					<?php
						while ( have_posts() ) :
							the_post();
							get_template_part('template-parts/post');
						endwhile;
					?>
				</div>
			<?php endif; ?>

	</div>
</section>

<?php
get_footer();
