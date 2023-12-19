import { useState, useEffect } from 'react';

import tokenAuth from '../utils/tokenAuth.ts';
import { useNavigate } from 'react-router-dom';
import QuestContainer from '../components/QuestContainer.tsx';
import Quest from '../components/Quest.tsx';
import { TagType } from '../utils/types.ts';
import { format } from 'date-fns';
import { Typography } from '@material-tailwind/react';
import { Button } from '@material-tailwind/react';

const Home = () => {
	const navigate = useNavigate();
	const [loaded, setLoaded] = useState(false);
	const [showWelcome, setShowWelcome] = useState(false);

	useEffect(() => {
		setShowWelcome(true);
		if (loaded) {
			return;
		}
		tokenAuth(navigate, '/quest', '/');
		setLoaded(true);
	});
	return (
		<>
			{/* Navbar */}
			<nav className="bg-white h-16 text-white flex flex-wrap items-center fixed top-0 left-0 py-4 px-3 w-full z-10 sm:px-6 lg:px-8 ">
				<div className="text-gray-900 text-home-title pl-52">Habitkub</div>
				<div className="ml-auto mr-40 flex justify-center gap-2 items-center mt-0 w-1/2 sm:mt-0 sm:w-1/2 lg:w-auto">
					<Button variant="outlined" onClick={() => navigate('/sign_up')}>
						Sign Up
					</Button>
					<Button variant="outlined" onClick={() => navigate('/log_in')}>
						Log in
					</Button>
					{/* <button className="bg-gray-400 border-2 border-gray-500 mr-2 text-white text-sm sm:mr-3 sm:text-base">
						<a href="/Sign_up" style={{ color: 'white' }}>
							Sign Up
						</a>
					</button> */}
					{/* <button className="bg-gray-900 border-2 border-gray-500 text-white text-sm sm:text-base">
						<a href="/Log_in" style={{ color: 'white' }}>
							Log in
						</a>
					</button> */}
				</div>
			</nav>

			{/*Hero*/}
			<div
				className="w-full min-h-screen "
				style={{ backgroundImage: 'linear-gradient(to bottom right, #f956b3, #ff7043)' }}
			>
				<svg
					className="fixed pt-16"
					fill="white"
					data-name="Layer 1"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 1200 120"
					preserveAspectRatio="none"
					width={'110%'}
					height={'20%'}
				>
					<path
						d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
						className="shape-fill"
					></path>
				</svg>
				<div className="flex flex-row">
					<div className=" pt-44 pl-80 w-[680px] h-full">
						<QuestContainer id="preview" title="Task">
							<div className="flex flex-col gap-2 w-96">
								<div id="test-quest-1">
									<Quest
										title="Be better today"
										description="Do something that makes you better today"
										id="test-1"
										onEditItem={() => {}}
										tags={
											[
												{ id: 1, name: 'Mental', color: 'bg-red-400' },
												{ id: 2, name: 'Physical', color: 'bg-blue-400' },
												{ id: 3, name: 'Spiritual', color: 'bg-green-400' },
												{ id: 4, name: 'Self development', color: 'bg-purple-400' },
											] as TagType[]
										}
										onDeleteItem={() => {}}
										due_date={format(new Date(), 'dd-MM-yyyy')}
										image_url="https://i.imgur.com/YumfIWI.png"
										item_name={'Mammoth Ribeye'}
										item_description="According to the shamanic stories, the meat of the Mammoth King was imbued with the spirit of the earth itself. It was believed that those who partook in its flesh would be granted the vitality and power of the Mammoth King, a blessing that was sought by warriors and hunters alike."
									/>
								</div>
								<div className="-translate-x-16" id="test-quest-2">
									<Quest
										title="Rest and relax"
										description="Just relax and take a break"
										id="test-2"
										onEditItem={() => {}}
										tags={[{ id: 1, name: 'Relax', color: 'bg-green-400' }] as TagType[]}
										onDeleteItem={() => {}}
										due_date={format(new Date(), 'dd-MM-yyyy')}
										image_url="https://i.imgur.com/audunLD.png"
										item_name={'Glintscale Carp'}
										item_description="The 'Glintscale Carp' is a staple in the diets of many riverside villages. Anglers and fisherfolk often tell tales of the fish's cleverness and how they seem to dance just out of reach of nets and hooks, making them a fun, if sometimes challenging, catch."
									/>
								</div>
							</div>
						</QuestContainer>
					</div>
					<div className="pt-48 pl-28 pr-40">
						<Typography
							variant="h1"
							placeholder=""
							className="text-home"
							style={{ fontFamily: 'Poppins', fontWeight: '900', color: 'white' }}
						>
							Improve Your Day with an Enjoyable To-Do List
						</Typography>
					</div>
				</div>
			</div>

			{/*Footer*/}
			<footer className="bg-gray-900 text-white py-3 sm:py-6 lg:py-2">
				{/* <div className="container mx-auto p-3 flex flex-wrap flex-col justify-around items-center sm:p-6 sm:flex-row lg:p-12 lg:flex-nowrap lg:flex-row">
					<div className="mb-2 text-center sm:mb-4 lg:w-1 lg:mb-0 lg:mr-6">
						<h2 className="text-3xl font-bold">Habitkub</h2>
					</div>
					<div className="lg:flex">
						<div className="sm:flex sm:space-x-5 lg:flex lg:space-x-12">
							<div className="w-full text-center mt-2 sm:w-1/2 sm:mr-0 sm:mt-0 lg:mr-6 lg:w-auto">
								<h2 className="text-2xl font-bold">Company</h2>
								<ul className="mt-2 sm:mt-3">
									<li>
										<a href="#" className="text-white hover:text-gray-400">
											About Us
										</a>
									</li>
									<li>
										<a href="#" className="text-white hover:text-gray-400">
											Our Team
										</a>
									</li>
									<li>
										<a href="#" className="text-white hover:text-gray-400">
											Contact Us
										</a>
									</li>
								</ul>
							</div>
							<div className="w-full text-center mt-2 sm:mt-0 sm:w-1/2 lg:w-auto">
								<h2 className="text-2xl font-bold">Resources</h2>
								<ul className="mt-2 sm:mt-3">
									<li>
										<a href="#" className="text-white hover:text-gray-400">
											Privacy Policy
										</a>
									</li>
									<li>
										<a href="#" className="text-white hover:text-gray-400">
											Terms and Conditions
										</a>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
				<div className="text-center text-md mt-2 sm:mt-4 lg:mt-2">
					<div className="w-1/2 sm:w-1/8 lg:w-1/2 mx-auto border-t-2 border-gray-600 mb-2 sm:mb-3 lg:mb-2"></div>
					<p>&copy; 2023 Habitkub. All rights reserved.</p>
				</div> */}
			</footer>
		</>
	);
};

export default Home;
