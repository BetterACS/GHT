import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { returnInterface } from '../../../backend/src/utils/interfaces.ts';
import tokenAuth from '../utils/tokenAuth.ts';
import axios from 'axios';
import Config from '../../../backend/src/config.ts';

const Login = () => {
	// Define state variables for form fields
	const [loaded, setLoaded] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	const navigate = useNavigate();
	// Handle form submission

	useEffect(() => {
		if (loaded) {
			return;
		}

		tokenAuth(navigate,'/quest','/log_in');
		setLoaded(true);
	});
	const handleSubmit = (e: any) => {
		e.preventDefault();
		// You can add your logic for handling the form submission here
		// Typically, this is where you'd make an API request to register the user.
		axios
			.post(`http://localhost:${Config.BACKEND_PORT}/login`, { email, password })
			.then((results) => {
				const result = results.data as returnInterface;

				if (result.return !== 0 || result.data === undefined) {
					setEmail('');
					setPassword('');
					navigate('/Log_in');
					setError(result.message);
					return;
				}

				localStorage.setItem('access_token', result.data.accessToken);
				localStorage.setItem('refresh_token', result.data.refreshToken);
				localStorage.setItem('email', email);

				navigate('/');
			})
			.catch((err) => console.log(err));
	};

	return (
		<div className="h-screen bg-gray-900 flex flex-col justify-center items-center">
			<div className="text-white mb-8 typewriter">
				<h1>HABITKUB</h1>
			</div>
			<div className="bg-gray-800 p-8 rounded-md shadow-sm shadow-white">
				<h1 className="text-3xl font-bold text-white text-center">Log In</h1>
				{error && <div className="text-red-500">{error}</div>}
				<form className="mt-4 text-center" onSubmit={handleSubmit}>
					{/* Email Input */}
					<div className="mb-4">
						<input
							type="email"
							id="email"
							name="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="border rounded-md p-2 w-64"
							placeholder="Username"
							required
						/>
					</div>

					{/* Password Input */}
					<div className="mb-4">
						<input
							type="password"
							id="password"
							name="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="border rounded-md p-2 w-64"
							placeholder="Password"
							required
						/>
					</div>

					{/* Submit Button */}
					<div className="text-center">
						<button
							type="submit"
							className="bg-gray-900 border-2 border-gray-500 text-white px-5 py-3 rounded-md mt-3 hover-bg-gray-900 transform hover:scale-105 transition-transform text-xs sm:text-sm"
						>
							Log In
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default Login;
