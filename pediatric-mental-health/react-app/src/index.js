import { createRoot } from 'react-dom/client';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { useGetFrontendRedirectsQuery } from './app/services/api';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';

import './index.css';

const container = document.getElementById('root');
const root = createRoot(container);

const AuthProviderWithHistory = ({ children }) => {
	const navigate = useNavigate();
	const { data, isFetching } = useGetFrontendRedirectsQuery();

	if (isFetching) return null;

	const matchingRedirect = data?.find((el) => el.from.replace(/\/$/, '') === window.location.href.replace(/\/$/, ''));

	if (matchingRedirect) {
		window.location.replace(matchingRedirect.to);
		return;
	}

	return window.location.origin.indexOf('learn') > -1 ? (
		<Auth0Provider
			domain={process.env.REACT_APP_AUTH0_CLIENT_DOMAIN}
			clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
			redirectUri={window.location.origin}
			onRedirectCallback={(appState) => {
				console.log(appState);
				if (appState?.returnTo) navigate(appState.returnTo);
			}}>
			{children}
		</Auth0Provider>
	) : (
		children
	);
};

root.render(
	<Provider store={store}>
		<BrowserRouter>
			<AuthProviderWithHistory>
				<App />
			</AuthProviderWithHistory>
		</BrowserRouter>
	</Provider>,
);
