import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const SsoGate = ({ children }) => {
	const { loginWithRedirect, isAuthenticated, isLoading, user } = useAuth0();

	useEffect(() => {
		if (!user) return;

		let freshpaint = window.freshpaint || {};

		console.log('firing freshpaint identify call', freshpaint);

		freshpaint.identify({ email: user.email });
	}, [user]);

	if (window.location.origin.includes('pixelsmith') || window.location.origin.includes('localhost')) return children;

	return isLoading ? null : isAuthenticated ? children : loginWithRedirect({ appState: { returnTo: window.location.pathname } });
};

export default SsoGate;
