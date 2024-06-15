<?php

class PXEDITOR
{
	protected $editorSide;

	public function __construct()
	{
		$this->editorSide = esc_attr(get_field('block_editor_side', 'user_' . get_current_user_id())) === 'left' ? 'e' : 'w';
		add_action('admin_enqueue_scripts', [$this, 'px_enqueue_jquery_ui']);
		add_action('admin_head', [$this, 'px_resizeable_sidebar']);
	}

	//
	// Need to enqueue jquery ui for the editor
	//
	public function px_enqueue_jquery_ui()
	{
		wp_enqueue_script('jquery-ui-resizable');
	}

	public function px_resizeable_sidebar()
	{
		if (!function_exists('acf_register_block_type')) {
			return;
		}

		?>
<style>
	/* Adjust for ACF Page Settings Meta Boxes etc... */
	.edit-post-visual-editor {
		/*GUTENBERG BLOCKS & Title etc.*/
		order: 2;
	}

	.edit-post-visual-editor__post-title-wrapper {
		margin-top: 2rem;
	}

	.edit-post-layout__metaboxes {
		border-bottom: 3px dashed #ccc;
		/*rgba(252,185,0,.75);*/
		order: 1;
		transition: .3s linear all;
	}

	.edit-post-layout__metaboxes #poststuff h2.hndle {
		font-size: 16px;
	}

	.edit-post-layout__metaboxes:hover {
		border-bottom: 3px dashed #f0f0f0;
	}

	.edit-post-layout__metaboxes .postbox-header {
		background: #ccc;
		/*rgba(252,185,0,.75);*/
		transition: .3s linear all;
	}

	.edit-post-layout__metaboxes .postbox-header,
	.edit-post-layout__metaboxes .acf-tab-group li a {
		transition: .3s linear all;
	}

	.edit-post-layout__metaboxes .postbox-header h2.hndle.ui-sortable-handle {
		color: #fff;
	}

	.acf-hndle-cog {
		display: none !important;
	}

	.edit-post-layout__metaboxes .acf-fields.-top {
		background: #ccc;
		padding-bottom: 20px !important;
	}

	.edit-post-layout__metaboxes .acf-tab-group li.active a {
		background: #ccc
			/*rgba(252,185,0,.75)*/
			!important;
	}

	.edit-post-layout__metaboxes .acf-tab-group li a {
		border-top-left-radius: 5px;
		border-top-right-radius: 5px;
	}

	/* ACF FIELDS */
	.clear {
		clear: left !important;
	}

	.acf-image-uploader.has-value img {
		box-shadow: 2px 2px 4px rgba(0, 0, 0, .4);
	}

	/* Alter editor layout to read more naturally (LTR) */

	.editor-styles-wrapper.block-editor-writing-flow {
		margin-left: 20px;
		margin-right: 20px;
	}

	<?php if($this->editorSide == 'e') : ?>
	.interface-interface-skeleton__sidebar {
		order: 1;
	}

	.interface-interface-skeleton__secondary-sidebar {
		order: 2;
	}

	.interface-interface-skeleton__content {
		order: 5;
	}

	<?php endif;
		?>
	/* end layout change */

	.editor-styles-wrapper .edit-post-visual-editor__post-title-wrapper {
		padding: 5px 0;
	}

	.interface-interface-skeleton__sidebar .interface-complementary-area {
		width: 100%;
	}

	.edit-post-layout:not(.is-sidebar-opened) .interface-interface-skeleton__sidebar {
		display: none;
	}

	.is-sidebar-opened .interface-interface-skeleton__sidebar {
		width: 350px;
	}

	/*UI Styles*/
	.ui-dialog .ui-resizable-n {
		height: 2px;
		top: 0;
	}

	.ui-dialog .ui-resizable-e {
		width: 6px;
		right: 0;
	}

	.ui-dialog .ui-resizable-s {
		height: 2px;
		bottom: 0;
	}

	.ui-dialog .ui-resizable-w {
		width: 6px;
		left: 0;
	}

	.ui-dialog .ui-resizable-se,
	.ui-dialog .ui-resizable-sw,
	.ui-dialog .ui-resizable-ne,
	.ui-dialog .ui-resizable-nw {
		width: 7px;
		height: 7px;
	}

	.ui-dialog .ui-resizable-se {
		right: 0;
		bottom: 0;
	}

	.ui-dialog .ui-resizable-sw {
		left: 0;
		bottom: 0;
	}

	.ui-dialog .ui-resizable-ne {
		right: 0;
		top: 0;
	}

	.ui-dialog .ui-resizable-nw {
		left: 0;
		top: 0;
	}

	.ui-draggable .ui-dialog-titlebar {
		cursor: move;
	}

	.ui-draggable-handle {
		-ms-touch-action: none;
		touch-action: none;
	}

	.ui-resizable {
		position: relative;
	}

	.ui-resizable-handle {
		position: absolute;
		font-size: 0.1px;
		display: block;
		-ms-touch-action: none;
		touch-action: none;
	}

	.ui-resizable-disabled .ui-resizable-handle,
	.ui-resizable-autohide .ui-resizable-handle {
		display: none;
	}

	.ui-resizable-e {
		background-color: #e0e0e0 !important;
		margin-right: 14px;
		cursor: ew-resize;
		width: 7px;
		right: -14px;
		top: 0;
		height: 100%;
	}

	.ui-resizable-w {
		background-color: #e0e0e0 !important;
		margin-left: 14px;
		cursor: ew-resize;
		width: 7px;
		left: -14px;
		top: 0;
		height: 100%;
	}
</style>

<script>
	jQuery(window).ready(function() {
		setTimeout(function() {
			jQuery('.interface-interface-skeleton__sidebar').width(localStorage.getItem('toast_sidebar_width'))
			jQuery('.interface-interface-skeleton__sidebar').resizable({
				handles: '<?= $this->editorSide ?>', //'e', //'w' if gutenburg default
				resize: function(event, ui) {
					jQuery(this).css({
						'left': 0
					});
					localStorage.setItem('toast_sidebar_width', jQuery(this).width());
				}
			});
		}, 250)
	});
</script>
<?php
	}
}
?>