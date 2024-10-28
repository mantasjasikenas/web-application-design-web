import { browser } from '$app/environment';
import { jwtDecode, type JwtPayload } from 'jwt-decode';

export type User = {
	username: string;
	roles: string[];
};

export interface Token extends JwtPayload {
	user: User;
}

// TODO: loading state and rename
function createAccessToken() {
	let accessToken = $state<string | null>(browser ? localStorage.getItem('accessToken') : null);
	// eslint-disable-next-line prefer-const
	let decodedToken = $derived.by(() => {
		if (!accessToken) return null;

		return jwtDecode<Token>(accessToken);
	});

	function setAccessToken(value: string | null) {
		console.log('setToken', value);

		if (!browser) {
			accessToken = value;
			return;
		}

		if (value) {
			localStorage.setItem('accessToken', value);
		} else {
			localStorage.removeItem('accessToken');
		}

		accessToken = value;
	}

	return {
		get accessToken() {
			return accessToken;
		},
		get decodedToken() {
			return decodedToken;
		},
		set: setAccessToken
	};
}

export const token = createAccessToken();
