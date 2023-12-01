import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { returnInterface } from '../../../backend/src/utils/interfaces.ts';
import tokenAuth from '../utils/tokenAuth.ts';
import axios from 'axios';

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

		tokenAuth(navigate,'/quest');
		setLoaded(true);
	});
	const handleSubmit = (e: any) => {
		e.preventDefault();
		// You can add your logic for handling the form submission here
		// Typically, this is where you'd make an API request to register the user.
		axios
			.post('http://localhost:5000/login', { email, password })
			.then((results) => {
				const result = results.data as returnInterface;

				if (result.return !== 0 || result.data === undefined) {
					setEmail('');
					setPassword('');
					navigate('/Log_in');
					setError(result.message);
				}

				localStorage.setItem('access_token', result.data.accessToken);
				localStorage.setItem('refresh_token', result.data.refreshToken);
				localStorage.setItem('email', email);

				navigate('/');
			})
			.catch((err) => console.log(err));
	};

	return (
		<div className="container mx-auto mt-8">
			<h1 className="text-3xl font-bold text-center">Log In</h1>
			{error && <div className="text-red-500">{error}</div>}
			<form className="mt-4" onSubmit={handleSubmit}>
				{/* Email Input */}
				<div className="mb-4">
					<label htmlFor="email" className="block text-sm font-semibold">
						Email
					</label>
					<input
						type="email"
						id="email"
						name="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="border rounded-md p-2 w-full"
						required
					/>
				</div>

				{/* Password Input */}
				<div className="mb-4">
					<label htmlFor="password" className="block text-sm font-semibold">
						Password
					</label>
					<input
						type="password"
						id="password"
						name="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="border rounded-md p-2 w-full"
						required
					/>
				</div>

				{/* Submit Button */}
				<div className="text-center">
					<button type="submit" className="bg-purple-800 text-white py-2 px-4 rounded-md hover:bg-purple-600">
						Log In
					</button>
				</div>
			</form>
		</div>
	);
};

export default Login;
