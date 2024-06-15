<?php

set_time_limit(60 * 5); // try to push timeout limit to 5min

class PXGeocodeAddresses
{
	protected $tableName;
	protected $geocodingEndpoint;
	protected $config;

	/**
	 * __construct
	 *
	 * @param  mixed $config
	 * @return void
	 */
	public function __construct(array $config = [
		'api' => 'geocode',
		'location_data_type' => 'custom-post',
		'api_key' => ''
	])
	{
		global $wpdb;

		$this->config = $config;
		$this->tableName = $wpdb->prefix . 'pxgeocodeaddresses';

		if ($this->config['api'] === 'geocode') {
			$this->geocodingEndpoint = sprintf('https://maps.googleapis.com/maps/api/geocode/json?key=%s', get_field('maps_api', 'options'));
		}

		if ($this->config['api'] === 'place') {
			$this->geocodingEndpoint = sprintf('https://maps.googleapis.com/maps/api/place/details/json?key=%s', get_field('maps_api', 'options'));
		}

		add_action('admin_menu', [$this, 'createOptionPage']);
		add_action('save_post', [$this, 'processLocationPost'], 10, 3);
		add_action('wp_ajax_nopriv_get_all_locations', [$this, 'getAllLocations']);
		add_action('wp_ajax_get_all_locations', [$this, 'getAllLocations']);
		add_action('wp_ajax_nopriv_get_locations_by_state', [$this, 'getLocationsByState']);
		add_action('wp_ajax_get_locations_by_state', [$this, 'getLocationsByState']);
		add_action('wp_ajax_nopriv_get_locations_by_distance', [$this, 'getLocationsByDistance']);
		add_action('wp_ajax_get_locations_by_distance', [$this, 'getLocationsByDistance']);
	}

	public function createOptionPage()
	{
		add_options_page('Geocode locations', 'Geocode locations', 'manage_options', 'px-geocode-addresses', [$this, 'createOptionPageHTML']);
	}

	/**
	 * Wrapper to display a wordpress admin notice
	 *
	 * @param string $class Use either 'error', 'warning', 'success', or 'info'
	 * @param string $message
	 * @return void
	 */
	private function printNotice($class, $message)
	{
		printf('<div class="%1$s"><p>%2$s</p></div>', esc_attr('is-dismissible notice notice-' . $class), esc_html(__($message, 'px-geocodeaddresses')));
	}

	public function createOptionPageHTML()
	{
		global $wpdb;

		$dbOverview = $wpdb->get_results($wpdb->prepare("SELECT state, COUNT(state) AS 'count' FROM {$this->tableName} GROUP BY state"), ARRAY_A);

		if (isset($_POST['batchGeocode'])) {
			$locations = get_posts(['post_type' => 'locations', 'posts_per_page' => -1]);
			if (count($locations) > 0) {
				$this->batchGeocodeAndInsert($locations);
			}
		}

		echo '<h1>Locations batch geocoding</h1>';
		echo '<p>Locations will be stored in the database</p>';
		echo '<form action="?page=px-geocode-addresses" method="POST" enctype="multipart/form-data" id="PxGeocodeAddressesForm">';
		echo '<input type="hidden" name="batchGeocode" value="yes">';

		submit_button('Batch geocode locations');

		echo '</form>';

		echo '<table class="blueTable"><thead><tr><th>State</th><th>Count</th></tr></thead>';

		foreach ($dbOverview as $stat) {
			echo '<tr><td>' . $stat['state'] . '</td><td>' . $stat['count'] . '</td></tr>';
		}

		echo '</table>';
	}

	public function processLocationPost($post_id, $post, $update)
	{
		if ('locations' !== $post->post_type) {
			return;
		}

		$this->singleGeocodeAndInsert($post);
	}

	public function createTable()
	{
		global $wpdb;

		$charset_collate = $wpdb->get_charset_collate();

		$sql = "CREATE TABLE IF NOT EXISTS $this->tableName (
				id mediumint(9) NOT NULL AUTO_INCREMENT,
				wordpress_id mediumint(9) NOT NULL,
				link text NOT NULL,
				name text NOT NULL,
				address varchar(255) DEFAULT '' NOT NULL,
				city varchar(255) DEFAULT '' NOT NULL,
				county varchar(255) DEFAULT '',
				state varchar(255) DEFAULT '' NOT NULL,
				zip varchar(10) DEFAULT '' NOT NULL,
				type text NOT NULL,
				hours longtext DEFAULT '',
				coordinates POINT NOT NULL,
				geojson longtext DEFAULT '',
				PRIMARY KEY  (id),
				UNIQUE KEY unique_address (address)
			) $charset_collate;";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';

		dbDelta($sql);
	}

	/**
	 * getLocationsByDistance
	 * Gets all the locations stored in a database that are within `radiusInMiles` distance of the provided center point
	 * @return void
	 */
	public function getLocationsByDistance()
	{
		global $wpdb;

		$sql = "SELECT ST_X(coordinates) as lng, ST_Y(coordinates) as lat, link, name, address, city, county, state, zip, type, hours FROM {$this->tableName} AS T WHERE ST_DISTANCE_SPHERE(POINT(%f, %f), T.`coordinates`)/1609 <= %d";
		$sql = $wpdb->prepare($sql, floatval($_POST['centerLng']), floatval($_POST['centerLat']), intval($_POST['radiusInMiles']));

		echo json_encode($wpdb->get_results($sql));

		wp_die();
	}

	/**
	 * getLocationsByState
	 * Pass in a state (abbreviation, i.e. MN), get all locations stored in the database in that state
	 * @return void
	 */
	public function getLocationsByState()
	{
		global $wpdb;

		$sql = "SELECT ST_X(coordinates) as lng, ST_Y(coordinates) as lat, link, name, address, city, county, state, zip, type, hours FROM {$this->tableName} WHERE state = %s";
		$sql = $wpdb->prepare($sql, $_POST['state']);

		echo json_encode($wpdb->get_results($sql));

		wp_die();
	}

	public function getAllLocations()
	{
		global $wpdb;

		$sql = "SELECT ST_X(coordinates) as lng, ST_Y(coordinates) as lat, link, name, address, city, county, state, zip, type, hours, geojson FROM {$this->tableName}";
		$sql = $wpdb->prepare($sql);

		echo json_encode($wpdb->get_results($sql));

		wp_die();
	}

	private function parse_geocoding_response($response, WP_Post $location)
	{
		global $wpdb;

		$coordinates = $response->result->geometry->location;
		$geoJSON = json_encode($response->result);

		$city = array_values(array_filter($response->result->address_components, function ($component) {
			return $component->types[0] === 'locality';
		}))[0]->long_name;

		$potentialCounty = array_values(array_filter($response->result->address_components, function ($component) {
			return $component->types[0] === 'administrative_area_level_2';
		}));

		$county = count($potentialCounty) > 0 ? $potentialCounty[0]->long_name : 'NO_COUNTY';

		$state = array_values(array_filter($response->result->address_components, function ($component) {
			return $component->types[0] === 'administrative_area_level_1';
		}))[0]->short_name;

		$zip = array_values(array_filter($response->result->address_components, function ($component) {
			return $component->types[0] === 'postal_code';
		}))[0]->long_name;

		$term_obj_list = get_the_terms($location->ID, 'location_type');
		$locationTypes = join(',', wp_list_pluck($term_obj_list, 'slug'));

		$sql = "INSERT INTO {$this->tableName} (wordpress_id, link, name, address, city, county, state, zip, type, hours, coordinates, geojson) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, POINT(%f, %f), %s) ON DUPLICATE KEY UPDATE address=address";
		$sql = $wpdb->prepare(
			$sql,
			$location->ID,
			get_permalink($location),
			$location->post_title,
			$response->result->formatted_address,
			$city,
			$county,
			$state,
			$zip,
			$locationTypes,
			$response->result->current_opening_hours ? json_encode($response->result->current_opening_hours) : '{}',
			$coordinates->lng,
			$coordinates->lat,
			$geoJSON
		);

		$wpdb->query($sql);
	}

	private function singleGeocodeAndInsert(WP_Post $location)
	{
		$placeId = get_field('place_id', $location);

		if (!$placeId) {
			return $this->printNotice('error', "$location->post_name has no place ID set");
		}

		$response = wp_remote_get($this->geocodingEndpoint . '&place_id=' . $placeId);
		$parsedResponse = json_decode($response['body']);

		if ($parsedResponse->status === 'OK') {
			$this->parse_geocoding_response($parsedResponse, $location);
		} else {
			$this->printNotice('error', 'Error getting a geocoding result: ' . $parsedResponse->error_message);
		}
	}

	protected function batchGeocodeAndInsert(array $locations)
	{
		foreach ($locations as $location) {
			sleep(1 / 50);
			$this->singleGeocodeAndInsert($location);
		}
		$this->printNotice('success', 'Successfully geocoded.');
	}
}
