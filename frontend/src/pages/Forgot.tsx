import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { returnInterface } from '../../../backend/src/utils/interfaces.ts';
import tokenAuth from '../utils/tokenAuth.ts';
import axios from 'axios';
import Config from '../../../backend/src/config.ts';
import { Input, Button } from '@material-tailwind/react';
import { IoIosMail } from 'react-icons/io';
import { Card, IconButton, Typography } from '@material-tailwind/react';

const Forgot = () => {
	// Define state variables for form fields
	const [loaded, setLoaded] = useState(false);
	// const [password, setPassword] = useState('');
	const [error, setError] = useState('');

	const [email, setEmail] = useState('');
	const [otp, setOtp] = useState('');

	const [newPassword, setNewPassword] = useState('');
	const [confirmNewPassword, setConfirmNewPassword] = useState('');

	const navigate = useNavigate();
	// Handle form submission

	useEffect(() => {
		if (loaded) {
			return;
		}

		tokenAuth(navigate, '/quest', '/forgot');
		setLoaded(true);
	});

	const handleSubmit = (e: any) => {
		e.preventDefault();
		console.log('New password: ', newPassword);
		console.log('Confirm new password: ', confirmNewPassword);
	};

	const handleSendOTP = (e: any) => {
		e.preventDefault();
		console.log('Email: ', email);
		console.log('OTP: ', otp);
	};

	return (
		<div className="h-screen flex flex-col justify-center items-center">
			<div className="mb-8 typewriter">
				<h1>HABITKUB</h1>
			</div>

			<div>{error}</div>

			<Card color="transparent" shadow={false}>
				<Typography variant="h4" color="blue-gray">
					Did you forget your password?
				</Typography>
				<Typography color="gray" className="mt-1 font-normal">
					Click the button below to request an OTP.
				</Typography>
				<div className="flex flex-row items-center gap-4 pt-2">
					<IconButton
						color="red"
						onClick={(e) => {
							handleSendOTP(e);
						}}
					>
						<IoIosMail />
					</IconButton>
					<Input
						type="email"
						placeholder="Email"
						label="Email"
						onChange={(e) => setEmail(e.target.value)}
						value={email}
					/>
				</div>
				<form className="mt-8 mb-2 w-80 max-w-screen-lg sm:w-96">
					<div className="mb-1 flex flex-col gap-6">
						<Typography variant="h6" color="blue-gray" className="-mb-3">
							Your OTP
						</Typography>
						<Input
							crossOrigin={'anonymous'}
							type="text"
							label="OTP"
							size="lg"
							placeholder=""
							onChange={(e) => setOtp(e.target.value)}
							value={otp}
						/>
						<Typography variant="h6" color="blue-gray" className="-mb-3">
							Your New Password
						</Typography>
						<Input
							size="lg"
							type="password"
							placeholder="***************"
							label="New password"
							onChange={(e) => setNewPassword(e.target.value)}
							value={newPassword}
						/>
						<Typography variant="h6" color="blue-gray" className="-mb-3">
							Password
						</Typography>
						<Input
							type="password"
							size="lg"
							placeholder="***************"
							label="Confirm new password"
							onChange={(e) => setConfirmNewPassword(e.target.value)}
							value={confirmNewPassword}
						/>
					</div>

					<Button className="mt-6" fullWidth onClick={(e) => handleSubmit(e)}>
						Change password
					</Button>
					<Typography color="gray" className="mt-4 text-center font-normal">
						Already have an account?{' '}
						<a className="font-medium text-gray-900" onClick={() => navigate('/log_in')}>
							Sign In
						</a>
					</Typography>
				</form>
			</Card>
		</div>
	);
};

export default Forgot;
