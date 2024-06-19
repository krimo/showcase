</div>
<!-- /#content-wrapper -->

<div id="loading">
  <div class="spinner"></div>
</div>
<!-- /#loading-cover -->

<div class="site-footer">

	<div class="container">

        <div class="width-set">

            <div class="footer-columns-container">
                <?php
                    $footer_columns = get_field('footer_columns', 'options');

                    if ($footer_columns) {

                        foreach ( $footer_columns as $column ) {
                            echo '<div class="footer-column wysiwyg">';
                                echo $column['content'];
                            echo '</div><!-- /.footer-column -->';
                        }

                    }
                ?>
            </div>
            <!-- /.footer-columns-container -->

            <div class="copyright">
                <?php
                    $copyright = get_field('copyright', 'options');
                    echo $copyright;
                ?>
            </div>
            <!-- /.copyright -->

        </div>
        <!-- /.width-set -->

	</div>
	<!-- /.container -->

</div>
<!-- /.site-footer -->

</div>
<!-- /.overflow -->

<?php wp_footer(); ?>


<?php include('modals.php') ?>

</body>
</html>
