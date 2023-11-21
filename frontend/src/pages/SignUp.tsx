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
		tokenAuth(navigate, '/');
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
		<div className="h-screen bg-black top-0 left-0 flex items-center">
			<div className='w-1/2 font-bold text-white tracking-[.75em]'>
				<h1>HABITKUB</h1>
			</div>
			<div className="w-1/2 container mx-auto">
				<h1 className="text-3xl font-bold text-center text-white">SIGN UP</h1>
				{error && <div className="text-red-500">{error}</div>}
				<form className="mt-4" onSubmit={handleSubmit}>
					{/* Username Input */}
					<div className="m-5">
						<input
							type="text"
							id="username"
							name="username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							className="border-2 border-red-500  shadow-sm shadow-white rounded-md p-2 w-1/2"
							placeholder='Username'
							required
						/>
					</div>

					{/* Email Input */}
					<div className="m-5">
						<input
							type="email"
							id="email"
							name="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="border-2 border-red-500  shadow-sm shadow-white rounded-md p-2 w-1/2"
							placeholder='Email'
							required
						/>
					</div>

					{/* Password Input */}
					<div className="m-5">
						<input
							type="password"
							id="password"
							name="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="border-2 border-red-500  shadow-sm shadow-white rounded-md p-2 w-1/2"
							placeholder='Password'
							required
						/>
					</div>

					{/* Submit Button */}
					<div className="text-center">
						<button type="submit" className="bg-black border-2 border-gray-500 shadow-sm shadow-white text-white px-5 py-3 rounded-md mt-3 hover-bg-gray-900 transform hover:scale-105 transition-transform text-xs sm:text-sm sm:mt-4">
							Sign Up
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default SignUp;
