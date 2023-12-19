import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { returnInterface } from '../../../backend/src/utils/interfaces.ts';
import tokenAuth from '../utils/tokenAuth.ts';
import axios from 'axios';
import Config from '../../../backend/src/config.ts';
import { Input, Button } from '@material-tailwind/react';
import { Typography } from '@material-tailwind/react';

const Login = () => {
	// Define state variables for form fields
	const [loaded, setLoaded] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	const [isError, setIsError] = useState(false);

	const navigate = useNavigate();
	// Handle form submission

	useEffect(() => {
		if (loaded) {
			return;
		}

		tokenAuth(navigate, '/quest', '/log_in');
		setLoaded(true);
	});
	const handleSubmit = (e: any) => {
		e.preventDefault();
		if (email === '' || password === '') {
			setError('Please enter email and password');
			return;
		}
		// You can add your logic for handling the form submission here
		// Typically, this is where you'd make an API request to register the user.
		axios
			.post(`http://localhost:${Config.BACKEND_PORT}/login`, { email, password })
			.then((results) => {
				const result = results.data as returnInterface;

				if (result.return !== 0 || result.data === undefined) {
					setEmail('');
					setPassword('');
					navigate('/log_in');
					setError(result.message);
					return;
				}

				localStorage.setItem('access_token', result.data.accessToken);
				localStorage.setItem('refresh_token', result.data.refreshToken);
				localStorage.setItem('email', email);

				navigate('/quest');
			})
			.catch((err) => console.log(err));
	};

	return (
		<div className="h-screen flex flex-col justify-center items-center">
			<div className="mb-8 typewriter">
				<h1>HABITKUB</h1>
			</div>
			<div className="bg-gray-100 p-8 rounded-md shadow-sm shadow-white w-96">
				<h1 className="text-3xl font-bold text-center">Log In</h1>
				{error && <div className="text-red-500">{error}</div>}
				<form className="mt-4 text-center" onSubmit={handleSubmit}>
					{/* Email Input */}
					<div className="mb-4">
						<Input
							crossOrigin={'anonymous'}
							label="Email"
							type="email"
							id="email"
							name="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="border rounded-md p-2 w-64"
							error={error !== ''}
						/>
					</div>

					{/* Password Input */}
					<div className="mb-4">
						<Input
							crossOrigin={'anonymous'}
							label="Password"
							type="password"
							id="password"
							name="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="border rounded-md p-2 w-64"
							error={error !== ''}
						/>
					</div>
					<a className="cursor-pointer text-gray-700 hover:text-red-500" onClick={() => navigate('/forgot')}>
						Forgot password?
					</a>
					{/* Submit Button */}
					<div className="text-center pt-4">
						<button
							type="submit"
							className="bg-gray-900 border-2 border-gray-500 text-white px-5 py-3 rounded-md mt-3 hover-bg-gray-900 transform hover:scale-105 transition-transform text-xs sm:text-sm"
						>
							Log In
						</button>
					</div>
					<Typography color="gray" className="mt-4 text-center font-normal">
						Don't have an account?{' '}
						<a className="font-medium text-gray-900" onClick={() => navigate('/sign_up')}>
							Sign Up
						</a>
					</Typography>
				</form>
			</div>
		</div>
	);
};

export default Login;
