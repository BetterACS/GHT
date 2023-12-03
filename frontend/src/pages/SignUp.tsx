import React ,{ useEffect, useState } from 'react';
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
		tokenAuth(navigate, '/quest');
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
		<div className="h-screen bg-gray-900 text-center flex flex-col justify-center items-center lg:flex-row lg:justify-around">
			<div className='font-bold text-white typewriter'>
				<h1>HABITKUB</h1>
			</div>
			<div className="bg-gray-800 rounded-[1.0rem] md:rounded-[1.5rem] mt-5 w-2/3 lg:mt-0 lg:rounded-[2.5rem] lg:w-1/3">
				<h1 className="text-3xl font-bold text-center text-white mt-8">SIGN UP</h1>
				{error && <div className="text-red-500">{error}</div>}
				<form className="mt-4 text-center" onSubmit={handleSubmit}>
					{/* Username Input */}
					<div className="my-5 mx-8 sm:mx-10 lg:mx-12 xl:mx-14">
						<input
							type="text"
							id="username"
							name="username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							className="border-2 shadow-sm shadow-white rounded-md p-2 w-full"
							placeholder='Username'
							required
						/>
					</div>

					{/* Email Input */}
					<div className="my-5 mx-8 sm:mx-10 lg:mx-12 xl:mx-14">
						<input
							type="email"
							id="email"
							name="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="border-2 shadow-sm shadow-white rounded-md p-2 w-full"
							placeholder='Email'
							required
						/>
					</div>

					{/* Password Input */}
					<div className="my-5 mx-8 sm:mx-10 lg:mx-12 xl:mx-14">
						<input
							type="password"
							id="password"
							name="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="border-2 shadow-sm shadow-white rounded-md p-2 w-full"
							placeholder='Password'
							required
						/>
					</div>

					{/* Submit Button */}
					<div className="text-center mb-5">
						<button type="submit" className="bg-gray-900 border-2 border-gray-500 text-white px-5 py-3 rounded-md mt-3 hover-bg-gray-900 transform hover:scale-105 transition-transform text-xs sm:text-sm">
							Sign Up
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default SignUp;
