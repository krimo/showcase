<?php

class BoxAPISetup
{
	protected $clientID;
	protected $clientSecret;

	/**
	 * Basic oAuth 2 setup
	 *
	 * @param String $clientID
	 * @param String $clientSecret
	 */
	public function __construct(String $clientID, String $clientSecret)
	{
		$this->clientID = $clientID;
		$this->clientSecret = $clientSecret;
	}

	public function register_endpoints()
	{
		register_rest_route('box', '/token', [
			[
				'methods' => 'POST',
				'callback' => [$this, 'get_token']
			],
			[
				'methods' => 'GET',
				'callback' => [$this, 'initialize_tokens']
			]
		]);
		register_rest_route('box', '/chunk-upload', [
			[
				'methods' => 'POST',
				'callback' => [$this, 'chunk_upload']
			]
		]);
	}

	public function initialize_tokens()
	{
		if (!isset($_REQUEST['code'])) return new WP_Error(401, 'Missing parameters. Did you include `?code` in your request?', []);

		$response = wp_remote_post('https://api.box.com/oauth2/token', [
			'body' => [
				'client_id' => $this->clientID,
				'client_secret' => $this->clientSecret,
				'grant_type' => 'authorization_code',
				'code' => $_REQUEST['code']
			]
		]);

		$parsedResponse = json_decode($response['body']);
		$parsedResponse->generated_at = time();

		if ($parsedResponse->error) return new WP_Error(500, $parsedResponse->error_description, ['code' => $_REQUEST['code']]);

		update_option('boxTokenData', json_encode($parsedResponse));

		wp_redirect('/');
		die();
	}

	public function get_token()
	{
		$boxTokenData = get_option('boxTokenData');

		if (!$boxTokenData) return new WP_Error(500, 'boxTokenData key not found in the options table, exitting.');

		$currentTime = time();
		$decodedData = json_decode($boxTokenData);

		if ($currentTime - $decodedData->generated_at >= $decodedData->expires_in) {
			$response = wp_remote_post('https://api.box.com/oauth2/token', [
				'body' => [
					'client_id' => $this->clientID,
					'client_secret' => $this->clientSecret,
					'grant_type' => 'refresh_token',
					'refresh_token' => $decodedData->refresh_token
				]
			]);

			$parsedResponse = json_decode($response['body']);
			$parsedResponse->generated_at = time();

			if ($parsedResponse->error) return new WP_Error(500, $parsedResponse->error_description, ['code' => $_REQUEST['code']]);

			update_option('boxTokenData', json_encode($parsedResponse));

			return $parsedResponse->access_token;
		}

		return $decodedData->access_token;
	}

	public function upload_handler($data)
	{
		return $_FILES;
	}

	public function chunk_upload($request)
	{
		$token = $this->get_token();

		$response = wp_remote_post('https://upload.box.com/api/2.0/files/upload_sessions', [
			'headers' => [
				'Authorization' => 'Bearer ' . $token,
				'Content-Type' => 'application/json'
			],
			'body' => json_encode([
				'file_name' => $_REQUEST['filename'],
				'file_size' => (int) $_REQUEST['filesize'],
				'folder_id' => $_REQUEST['folderid'],
			])
		]);

		return json_decode($response['body']);
	}

	/**
	 * Visit this url in the browser to get the API code we need
	 * to generate tokens
	 *
	 * @return string
	 */
	public function get_auth_url()
	{
		return "https://account.box.com/api/oauth2/authorize?client_id=$this->clientID&response_type=code";
	}
}
