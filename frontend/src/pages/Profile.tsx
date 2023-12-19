import React, { useEffect, useState } from 'react';
import { UserCircleIcon, ShieldCheckIcon } from '@heroicons/react/24/solid';
import {
	List,
	ListItem,
	ListItemPrefix,
	Card,
	Input,
	Button,
	Dialog,
	DialogHeader,
	DialogBody,
	DialogFooter,
	IconButton,
} from '@material-tailwind/react';
import Avatar from 'react-avatar-edit';
import { faPenToSquare, faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FaCamera } from 'react-icons/fa';
import userProfile from '../assets/sample.txt';
import axios from 'axios';
import authorization from '../utils/authorization';
import { returnInterface } from '../../../backend/src/utils/interfaces';
import Config from '../../../backend/src/config';
import tokenAuth from '../utils/tokenAuth';
import { useNavigate } from 'react-router-dom';
export default function Profile() {
	const [activeTab, setActiveTab] = useState('profile');
	const [open, setOpen] = React.useState(false);
	const [imgCrop, setImgCrop] = useState<string | null>(null);
	const [storeImage, setStoreImage] = useState<Array<{ imgCrop: string | null }>>([]);

	const onClose = () => {
		setImgCrop(null);
	};

	const onCrop = (view: any): void => {
		setImgCrop(view);
	};

	const saveImage = async () => {
		try {
			if (imgCrop !== null) {
				// Find the index of the existing image in the array
				const existingImageIndex = storeImage.findIndex((item) => item.imgCrop !== null);

				// If an existing image is found, update it; otherwise, add a new one
				if (existingImageIndex !== -1) {
					console.log('-1');
					const updatedStoreImage = [...storeImage];
					updatedStoreImage[existingImageIndex] = { imgCrop };
					setStoreImage(updatedStoreImage);
					await updateImageOnServer(imgCrop);
				}

				handleModalOpen();
			}
		} catch (err) {
			console.log('Error saving image', err);
		}
	};
	// image;
	const updateImageOnServer = async (imgCrop: string) => {
		console.log('Updating image on the server');
		try {
			const results = await axios.post(
				`http://localhost:${Config.BACKEND_PORT}/user/no-sql`,
				{
					email: email,
					image: imgCrop,
				},
				{ headers: headers }
			);

			const result = results.data as returnInterface;
			if (result.return === 0) {
				console.log('Updated image on the server', result);
			}
		} catch (err) {
			alert('Please crop your image smaller or reduce the quality of your image');
			// Handle the error if needed, and possibly throw it
			throw err;
		}
	};
	const queryImage = async () => {
		try {
			const results = await axios.get(`http://localhost:${Config.BACKEND_PORT}/user/no-sql`, {
				params: {
					email: email,
				},
				headers: headers,
			});

			const result = results.data as returnInterface;
			const image = result.data.image.toString();

			// Assuming setStoreImage returns a Promise
			return image; // Now the function returns the image string
		} catch (err) {
			console.log('Error querying user', err);
			// Handle the error if needed, and possibly throw it
			throw err;
		}
	};

	const profileImagesShow = storeImage.map((item) => item.imgCrop);

	const handleModalOpen = () => setOpen(!open);

	const onEditItem = () => {
		console.log('Edit username');
	};

	const handleForgotPasswordClick = () => {
		// Add your logic for handling the "forgot password" click event
		console.log('Forgot password clicked!');
	};

	//variable for query user
	const [username, setUsername] = useState<string | null>(null);
	let headers = {
		authorization: `Bearer ${localStorage.getItem('access_token')}`,
		refreshToken: `Bearer ${localStorage.getItem('refresh_token')}`,
		email: `${localStorage.getItem('email')}`,
	};
	const email = localStorage.getItem('email');
	const [accessToken, setAccessToken] = useState<string>(localStorage.getItem('access_token') || '');
	const [refreshToken, setRefreshToken] = useState<string>(localStorage.getItem('refresh_token') || '');
	const updateAccessToken = async (newToken: string, newRefresh: string) => {
		await setAccessToken(newToken);
		await localStorage.setItem('access_token', newToken);
		await setRefreshToken(newRefresh);
		await localStorage.setItem('refresh_token', newRefresh);
	};
	const userQuery = async () => {
		try {
			const results = await axios.get(`http://localhost:${Config.BACKEND_PORT}/user`, {
				params: {
					email: email,
				},
				headers: headers,
			});
			const result = results.data as returnInterface;

			setUsername(result.data[0].username);
		} catch (error) {
			console.error('Error to query user', error);
		}
	};
	const handleUsernameChange = (event: { target: { value: React.SetStateAction<string | null> } }) => {
		setUsername(event.target.value);
	};

	const updateUsername = async () => {
		try {
			const results = await axios.put(
				`http://localhost:${Config.BACKEND_PORT}/user`,
				{
					username: username,
					email: email,
				},
				{ headers: headers }
			);
			const result = results.data as returnInterface;
			authorization(
				result,
				() => {
					console.log(result);
				},
				updateAccessToken
			);
		} catch (error) {
			console.error('Error to query user', error);
		}
	};
	//variable for password zone
	const [new_password, setNewPassword] = useState<string>('');
	const [old_password, setOldPassword] = useState<string>('');
	const [confirm_password, setConfirmPassword] = useState<string>('');
	const handleNewPasswordChange = (event: { target: { value: React.SetStateAction<string> } }) => {
		setNewPassword(event.target.value);
	};
	const handleOldPasswordChange = (event: { target: { value: React.SetStateAction<string> } }) => {
		setOldPassword(event.target.value);
	};
	const handleConfirmPasswordChange = (event: { target: { value: React.SetStateAction<string> } }) => {
		setConfirmPassword(event.target.value);
	};
	const updatePassword = async () => {
		if (!old_password || !new_password || !confirm_password) {
			alert('Please fill in all password fields');
			return;
		}
		try {
			const results = await axios.put(
				`http://localhost:${Config.BACKEND_PORT}/user/password`,
				{
					old_password: old_password,
					email: email,
					new_password: new_password,
					confirm_password: confirm_password,
				},
				{ headers: headers }
			);
			const result = results.data as returnInterface;
			authorization(
				result,
				() => {
					console.log(result);
				},
				updateAccessToken
			);
		} catch (error) {
			console.error('Error to query user', error);
		}
	};
	useEffect(() => {
		const load = async () => {
			await userQuery();
			const image = await queryImage();
			await setStoreImage([{ imgCrop: image }]);
		};
		load();
	}, []);
	const navigate = useNavigate();
	useEffect(() => {
		tokenAuth(navigate, '/profile', '/log_in');
	}, [accessToken]);
	return (
		<>
			<div className="flex flex-row items-baseline">
				<Card placeholder="List" className="w-72 shadow-xl ml-4 mt-4">
					<List>
						<ListItem onClick={() => setActiveTab('profile')}>
							<ListItemPrefix>
								<UserCircleIcon className="w-5 h-10" />
							</ListItemPrefix>
							Profile
						</ListItem>

						<ListItem onClick={() => setActiveTab('account')}>
							<ListItemPrefix>
								<ShieldCheckIcon className="w-5 h-10" />
							</ListItemPrefix>
							Password
						</ListItem>
					</List>
				</Card>

				<Card placeholder="Content" className="mx-4 w-full shadow-xl">
					{activeTab === 'profile' && (
						<div className="mx-10">
							<h1 className="text-2xl">Profile</h1>
							<div className="w-1/2 sm:w-full lg:w-full mx-auto border-[1px] border-gray-300 mb-4 sm:mb-6 lg:mb-8"></div>

							<div className="flex justify-center">
								<div className="group relative">
									{profileImagesShow.length > 0 ? (
										profileImagesShow.map((item, index) => (
											<img
												key={index}
												className="h-72 w-72 rounded-full object-cover object-center cursor-pointer group-hover:opacity-80 transition-opacity duration-300 ease-in-out"
												src={item || userProfile}
												alt={`userProfile-${index}`}
												onClick={handleModalOpen}
											/>
										))
									) : (
										<img
											className="h-72 w-72 rounded-full object-cover object-center cursor-pointer group-hover:opacity-80 transition-opacity duration-300 ease-in-out"
											src={userProfile}
											alt="userProfile"
											onClick={handleModalOpen}
										/>
									)}
									<div
										className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 hover:z-10 transition-opacity duration-300 ease-in-out"
										onClick={handleModalOpen}
									>
										<FaCamera size={70} color="white" />
									</div>
								</div>
							</div>

							<div className="w-1/2 sm:w-full lg:w-full mx-auto border-[1px] border-gray-300 mt-8 mb-2 sm:mb-3 lg:mb-4"></div>
							<div className="flex w-1/2">
								<Input
									label="Name"
									crossOrigin={undefined}
									value={username || ''}
									onChange={handleUsernameChange}
								/>
								{/* <Button
                                    className=" bg-orange-700 mx-1 border border-[1px] border-gray-400 text-xs rounded-md shadow-lg hover:shadow-xl px-25"
                                    onClick={onEditItem}
                                >
                                    <FontAwesomeIcon icon={faPenToSquare} size="lg" />
                                </Button> */}
							</div>
							<p className="text-xs text-gray-600 ml-2 mt-2">
								Your name may appear here. You can change it at any time.
							</p>

							<Button className=" bg-green-500 my-4" onClick={updateUsername}>
								<p className="b">updated profile</p>
							</Button>
						</div>
					)}

					{activeTab === 'account' && (
						<div className="mx-10">
							<h1 className="text-2xl">Password</h1>
							<div className=" w-1/2 sm:w-full lg:w-full mx-auto border-[1px] border-gray-300 mb-4 sm:mb-6 lg:mb-8"></div>
							<div className="w-1/2">
								<Input
									label="Old password"
									value={old_password}
									type="password"
									onChange={handleOldPasswordChange}
									required
								/>
								<div className="my-4"></div>
								<Input
									label="New password"
									value={new_password}
									type="password"
									onChange={handleNewPasswordChange}
									required
								/>
								<div className="my-4"></div>
								<Input
									label="Confirm new password"
									value={confirm_password}
									type="password"
									onChange={handleConfirmPasswordChange}
									required
								/>
							</div>
							<div className="flex gap-8 items-center mt-2">
								<Button
									className="bg-gray-200 border border-[1px] border-gray-600 text-black my-4"
									onClick={updatePassword}
								>
									Update password
								</Button>
								<p
									className="text-blue-600 cursor-pointer hover:text-blue-800 hover:underline transition"
									onClick={handleForgotPasswordClick}
								>
									I forgot my password
								</p>
							</div>
						</div>
					)}
				</Card>

				<Dialog open={open} handler={handleModalOpen}>
					<DialogHeader className="flex justify-between">
						Update Profile
						<IconButton variant="outlined" className="rounded-full" onClick={handleModalOpen}>
							<FontAwesomeIcon icon={faX} size="xl" />
						</IconButton>
					</DialogHeader>
					<DialogBody>
						<Avatar width={580} height={400} onCrop={onCrop} onClose={onClose} />
					</DialogBody>
					<DialogFooter>
						<Button variant="gradient" color="green" onClick={saveImage}>
							<span>Save</span>
						</Button>
					</DialogFooter>
				</Dialog>
			</div>
		</>
	);
}
