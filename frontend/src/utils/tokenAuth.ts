import axios from 'axios';
import { returnInterface } from '../../../backend/src/utils/interfaces';

export default async function tokenAuth(
	navigateFunction: any,
	tokenSuccessFunction = () => {},
	tokenFailureFunction = () => {},
	tokenNullFunction = () => {}
) {
	const headers = {
		authorization: `Bearer ${localStorage.getItem('access_token')}`,
		refreshToken: `Bearer ${localStorage.getItem('refresh_token')}`,
		email: `${localStorage.getItem('email')}`,
	};

	const results = await axios.post('http://localhost:5001/validator', { headers });
	const result = results.data as returnInterface;

	try {
		switch (result.return) {
			// If the token is valid, redirect to the home page
			case 0:
				tokenSuccessFunction();
				navigateFunction('/');
				return;
			// If the token is not present, return to the login page
			case 1:
				tokenNullFunction();
				return;
			// If the token is invalid, return to the login page
			case 2:
				tokenFailureFunction();
				return;
		}

		// If the token is refreshed, save the new tokens
		localStorage.setItem('access_token', result.data.accessToken);
		localStorage.setItem('refresh_token', result.data.refreshToken);
		navigateFunction('/');
	} catch (error) {
		alert(error + '\n return code' + result.return);
	}
}