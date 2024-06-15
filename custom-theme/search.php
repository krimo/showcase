<?php
get_header();
?>

	<section class="search-results">
		<div class="container">

			<?php if ( have_posts() ) : ?>

				<h1 class="search-results__title">Search results for: <span><?php echo get_search_query(); ?></span></h1>

				<div class="posts">
					<?php
						while ( have_posts() ) :
							the_post();
							get_template_part('template-parts/post');
						endwhile;
					?>
				</div>

			<?php
			else:
				echo '<h1 class="search-results__title">Sorry, no results were found for: <span>'.get_search_query().'</span></h1>';
			endif;
			?>

	</div>
</section>

<?php
get_footer();
