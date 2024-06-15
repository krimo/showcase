const NetworkTest = (props) => {
	return (
		<div className="container space-y-7">
			<h1 className="text-4xl font-bold">Network Test</h1>
			<p className="text-lg">This is a test of the network.</p>

			<p>
				<b>Current domain/origin:</b> {window.location.origin}
			</p>
		</div>
	);
};

export default NetworkTest;
