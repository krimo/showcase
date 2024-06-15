<?php

/**
 * Plugin Name: Geocode locations
 * Plugin URI: https://pixelsmith.co
 * Description: Geocode locations and store them in a custom table
 */

require_once __DIR__ . '/PXGeocodeAddresses.class.php';

$config = ['api' => 'place'];

$PXGeocoder = new PXGeocodeAddresses($config);

register_activation_hook(__FILE__, [$PXGeocoder, 'createTable']);
