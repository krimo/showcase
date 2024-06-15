</main>
<footer class="site-footer"></footer>
<?php
wp_footer();
include_once('modals.php');
?>
<?= get_field( 'global_footer_scripts', 'option' ); ?>
<?= get_field( 'content_footer_scripts' ); ?>
</body>

</html>
