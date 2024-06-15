// import ReactGA from 'react-ga4';
import { useAuth0 } from '@auth0/auth0-react';
// import { useEffect } from 'react';

const LoginForm = (props) => {
	const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0();

	// useEffect(() => {
	// 	if (!user) return;

	// 	ReactGA.event({
	// 		category: 'User',
	// 		action: 'Login',
	// 		label: user.sub,
	// 	});
	// }, [user]);

	return (
		<div className="container space-y-4 py-4">
			<h1>Auth0 Login Test</h1>

			{!isAuthenticated && !isLoading && (
				<button className="btn-primary" onClick={() => loginWithRedirect()}>
					Log In with Auth0
				</button>
			)}
			{isAuthenticated && (
				<button className="btn-primary" onClick={() => logout({ returnTo: window.location.origin })}>
					Log out
				</button>
			)}
			{user && (
				<div>
					<h4>You are logged in as: </h4>
					{Object.keys(user).map((k) => (
						<p>
							<b>{k}</b>: {user[k]}
						</p>
					))}
				</div>
			)}
		</div>
	);
};

export default LoginForm;
