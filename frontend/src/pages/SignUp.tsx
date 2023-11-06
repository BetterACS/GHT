import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { returnInterface } from '../../../backend/src/utils/interfaces.ts';
import tokenAuth from '../utils/tokenAuth.ts';
const SignUp = () => {
	// Define state variables for form fields
	const [loaded, setLoaded] = useState(false);

	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const navigate = useNavigate();

	// Handle form submission

	useEffect(() => {
		if (loaded) {
			return;
		}
		tokenAuth(navigate);
		setLoaded(true);
	});

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		axios
			.post('http://localhost:5000/register', { username, email, password })
			.then((results) => {
				const result = results.data as returnInterface;
				if (result.return === 1 || result.return === 2) {
					setUsername('');
					setEmail('');
					setPassword('');
					setError(result.message);
					return;
				}

				navigate('/Login');
			})
			.catch((err) => console.log(err));
	};

	return (
		<div className="container mx-auto mt-8">
			<h1 className="text-3xl font-bold text-center">Sign Up</h1>
			{error && <div className="text-red-500">{error}</div>}
			<form className="mt-4" onSubmit={handleSubmit}>
				{/* Username Input */}
				<div className="mb-4">
					<label htmlFor="username" className="block text-sm font-semibold">
						Username
					</label>
					<input
						type="text"
						id="username"
						name="username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						className="border rounded-md p-2 w-full"
						required
					/>
				</div>

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
						Sign Up
					</button>
				</div>
			</form>
		</div>
	);
};

export default SignUp;
