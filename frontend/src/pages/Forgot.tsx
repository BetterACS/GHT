import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { returnInterface } from '../../../backend/src/utils/interfaces.ts';
import tokenAuth from '../utils/tokenAuth.ts';
import axios from 'axios';
import Config from '../../../backend/src/config.ts';
import { Input, Button } from '@material-tailwind/react';
import { IoIosMail } from 'react-icons/io';
import { Card, IconButton, Typography } from '@material-tailwind/react';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';

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
	const errorSweetAlert = (text: string) => {
		const MySwal = withReactContent(Swal);
				MySwal.fire({
					title: 'Error occured!',
					text: text,
					icon: 'error',
					confirmButtonText: 'Ok',
				});
		return;
	}
	useEffect(() => {
		if (loaded) {
			return;
		}

		tokenAuth(navigate, '/quest', '/forgot');
		setLoaded(true);
	});

	const handleSubmit = async (e: any) => {
		e.preventDefault();
		console.log('New password: ', newPassword);
		console.log('Confirm new password: ', confirmNewPassword);
		console.log('OTP: ', otp);
		console.log('Email: ', email);
		if (email == ''||email==null||otp == ''||otp==null||newPassword == ''||newPassword==null||confirmNewPassword == ''||confirmNewPassword==null) {
			errorSweetAlert('Please fill in all the fields');
			setError('Please fill in all the fields');
			return;
		}
		try {
			const results = await axios.post(`http://localhost:${Config.BACKEND_PORT}/forgot_password/change`, {
				email: email,
				OTP: otp,
				password: newPassword,
				confirm_password: confirmNewPassword
			});
			const result = results.data as returnInterface;
			if (result.return==0){
				//alert the user that the OTP has been sent
				const MySwal = withReactContent(Swal);
				MySwal.fire({
					title: 'Success!',
					text: 'Your password has been changed',
					icon: 'success',
					confirmButtonText: 'Ok',
				});
				navigate('/log_in');
			}
			else{
				setError(result.message);
				errorSweetAlert(result.message);
				return;
			}
			
		} catch (err) {
			console.log(err)
		}
	};

	const handleSendOTP = async (e: any) => {
		e.preventDefault();

		if (email == ''||email==null) {
			setError('Please enter your email');
			errorSweetAlert("Please enter your email");
			return;
		}
		try {
			const results = await axios.post(`http://localhost:${Config.BACKEND_PORT}/forgot_password`, {
				email: email
			});
			const result = results.data as returnInterface;
			if (result.return==0){
				//alert the user that the OTP has been sent
				const MySwal = withReactContent(Swal);
				MySwal.fire({
					title: 'OTP has been sent!',
					text: 'Please check out your email',
					icon: 'success',
					confirmButtonText: 'Ok',
				});
			}
			else{
				setError(result.message);
				errorSweetAlert(result.message);
				return;
			}
			
		} catch (err) {
			console.log(err)
		}

	};

	return (
		<div className="h-screen flex flex-col justify-center items-center">
			<div className="mb-8 typewriter">
				<h1>HABITKUB</h1>
			</div>

			{/* <div className='text-red-400'>{error}</div> */}

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
