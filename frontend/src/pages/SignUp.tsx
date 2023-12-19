import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { returnInterface } from '../../../backend/src/utils/interfaces.ts';
import tokenAuth from '../utils/tokenAuth.ts';
import Config from '../../../backend/src/config.ts';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Input, Button, Typography } from '@material-tailwind/react';

const SignUp = () => {
	// Define state variables for form fields
	const [loaded, setLoaded] = useState(false);

	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const navigate = useNavigate();

	useEffect(() => {
		if (loaded) {
			return;
		}
		tokenAuth(navigate, '/quest', '/sign_up');
		setLoaded(true);
	});

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		axios
			.post(`http://localhost:${Config.BACKEND_PORT}/register`, { username, email, password })
			.then((results) => {
				const result = results.data as returnInterface;
				if (result.return !== 0) {
					setUsername('');
					setEmail('');
					setPassword('');
					setError(result.message);
					const MySwal = withReactContent(Swal);
					MySwal.fire({
						title: 'Error!',
						text: result.message,
						icon: 'error',
						confirmButtonText: 'Ok',
					});
					console.log(result.data.error);
					return;
				}
				//ตรงนี้อยากให้มีขึ้นว่าสมัครสำเร็จ แล้วก็ให้ไป verify email
				const MySwal = withReactContent(Swal);
				MySwal.fire({
					title: 'Sign up success!',
					text: 'Please verify your email',
					icon: 'success',
					confirmButtonText: 'Ok',
				});
				navigate('/log_in');
			})
			.catch((err) => console.log(err));
	};

	return (
		<div className="h-screen text-center flex flex-col justify-center items-center lg:flex-row lg:justify-around">
			<div className="font-bold typewriter">
				<h1>HABITKUB</h1>
			</div>
			<div className="bg-gray-100 rounded-[1.0rem] md:rounded-[1.5rem] mt-5 w-2/3 lg:mt-0 lg:rounded-[2.5rem] lg:w-1/3">
				<h1 className="text-3xl font-bold text-center mt-8">SIGN UP</h1>
				{error && <div className="text-red-500">{error}</div>}
				<form className="mt-4 text-center" onSubmit={handleSubmit}>
					{/* Username Input */}
					<div className="my-5 mx-8 sm:mx-10 lg:mx-12 xl:mx-14">
						<Input
							type="text"
							id="username"
							name="username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							className="border-2 shadow-sm shadow-white rounded-md p-2 w-full"
							placeholder="Username"
							label="Username"
							required
						/>
					</div>

					{/* Email Input */}
					<div className="my-5 mx-8 sm:mx-10 lg:mx-12 xl:mx-14">
						<Input
							type="email"
							id="email"
							name="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="border-2 shadow-sm shadow-white rounded-md p-2 w-full"
							placeholder="Email"
							label="Email"
							required
						/>
					</div>

					{/* Password Input */}
					<div className="my-5 mx-8 sm:mx-10 lg:mx-12 xl:mx-14">
						<Input
							type="password"
							id="password"
							name="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="border-2 shadow-sm shadow-white rounded-md p-2 w-full"
							placeholder="Password"
							label="Password"
							required
						/>
					</div>

					{/* Submit Button */}
					<div className="text-center mb-5">
						<button
							type="submit"
							className="bg-gray-900 border-2 border-gray-500 text-white px-5 py-3 rounded-md mt-3 hover-bg-gray-900 transform hover:scale-105 transition-transform text-xs sm:text-sm"
						>
							Sign Up
						</button>

						<Typography color="gray" className="mt-4 text-center font-normal">
							Already have an account?{' '}
							<a className="font-medium text-gray-900" onClick={() => navigate('/log_in')}>
								Sign In
							</a>
						</Typography>
					</div>
				</form>
			</div>
		</div>
	);
};

export default SignUp;
