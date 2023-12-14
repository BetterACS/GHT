import { returnInterface } from '../../../backend/src/utils/interfaces';
export default async function authorization(
	result: returnInterface,
	tokenSuccessFunction = () => {},
	tokenCreateFunction = async (newToken: string, newRefresh: string) => {},
	tokenFailureFunction = () => {
		console.log(result.message);
	}
) {
	try {
		switch (result.return) {
			// If the token is valid, redirect to the home page
			case 0:
				tokenSuccessFunction();
				return;
			// If the token
			case -1:
				tokenCreateFunction(result.data.accessToken, result.data.refreshToken);
				return;
			default:
				tokenFailureFunction();
				return;
		}
	} catch (error) {
		alert(error + '\n return code' + result.return);
	}
}
