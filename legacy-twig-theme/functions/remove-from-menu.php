<?php
	// control menu items on admin page
	function remove_stuff_from_admin() {
		// Dashboard
		// remove_menu_page( 'upload.php' );

		// Posts
		// remove_menu_page( 'edit.php' );

		// Media
		//remove_menu_page( 'upload.php' );

		// Links
		//remove_menu_page( 'link-manager.php' );

		// Pages
		// remove_menu_page( 'edit.php?post_type=page' );

		// Comments
		remove_menu_page( 'edit-comments.php' );

		// Appearance
		remove_menu_page( 'themes.php' );
		add_menu_page('Menus', 'Menus', 'manage_options', 'nav-menus.php', '', 'dashicons-menu');
		add_menu_page('Themes', 'Themes', 'manage_options', 'themes.php');
		// remove_submenu_page( 'themes.php', 'themes.php' );
		// remove_submenu_page( 'themes.php', 'theme-editor.php' );
		// remove_submenu_page( 'themes.php', 'nav-menus.php' );
		// remove_submenu_page( 'themes.php', 'customize.php' );

		// Plugins
		// remove_menu_page( 'plugins.php' );

		// Users
		// remove_menu_page( 'users.php' );

		// Tools
		remove_menu_page( 'tools.php' );

		// Settings
		//remove_menu_page( 'options-general.php' );
	}
	add_action( 'admin_menu', 'remove_stuff_from_admin' );
?>
