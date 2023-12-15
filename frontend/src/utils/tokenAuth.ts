import axios from 'axios';
import { returnInterface } from '../../../backend/src/utils/interfaces';

export default async function tokenAuth(
	navigateFunction: any,
	redirect: string = '/',
	tokenSuccessFunction = () => {},
	tokenFailureFunction = () => {
		localStorage.removeItem('access_token');
		localStorage.removeItem('refresh_token');
		localStorage.removeItem('email');
		navigateFunction('/Log_in');
	},
	tokenNullFunction = () => {
		// หน้า  home redirect ไปหน้า login
		// navigateFunction('/Log_in');
	}
) {
	const headers = {
		authorization: `Bearer ${localStorage.getItem('access_token')}`,
		refreshToken: `Bearer ${localStorage.getItem('refresh_token')}`,
		email: `${localStorage.getItem('email')}`,
	};

	const results = await axios.post('http://localhost:5001/validator', {}, { headers: headers });
	const result = results.data as returnInterface;

	try {
		switch (result.return) {
			// If the token is valid do nothing
			case 0:
				tokenSuccessFunction();
				navigateFunction(redirect);
				return;
			// If the token is not present, return to the login page
			case 1:
				tokenNullFunction();
				return;
			// If the token is invalid, return to the login page
			case 2:
				tokenFailureFunction();
				return;
			case -1:
				localStorage.setItem('access_token', result.data.accessToken);
				localStorage.setItem('refresh_token', result.data.refreshToken);
				navigateFunction(redirect);
				return;
		}
	} catch (error) {
		alert(error + '\n return code' + result.return);
	}
}
