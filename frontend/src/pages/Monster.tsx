import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Config from '../../../backend/src/config';
import { useNavigate } from 'react-router-dom';
import { monsterInterface, returnInterface } from '../../../backend/src/utils/interfaces';
import background from '../assets/sample_scene.png';
import tokenAuth from '../utils/tokenAuth';
import '../styles/Monster.css';
import { HiArrowCircleLeft, HiArrowCircleRight } from 'react-icons/hi';
import { Carousel } from '@trendyol-js/react-carousel';
import { IconButton, Button, Tooltip } from '@material-tailwind/react';

import { motion } from 'framer-motion';
import clsx from 'clsx';

const images = [
	'https://i.imgur.com/spJyCuT.png',
	'https://i.imgur.com/iLJzFfZ.png',
	'https://i.imgur.com/89u5bMC.png',
	'https://i.imgur.com/b50cjCP.png',
	'https://i.imgur.com/g6CJO26.png',
	'https://i.imgur.com/1CmGi93.png',
	'https://i.imgur.com/bLycv6Y.png',
	'https://i.imgur.com/wu5HvsQ.png',
	'https://i.imgur.com/5towfYp.png',
	'https://i.imgur.com/YumfIWI.png',
];

import { Typography } from '@material-tailwind/react';

import { Progress } from '@material-tailwind/react';

export function ProgressLabelOutside() {
	return (
		<div className="w-full">
			<div className="mb-2 flex items-center justify-between gap-4">
				<Typography placeholder={'head'} color="gray" variant="h6">
					Completed
				</Typography>
				<Typography placeholder={'percent'} color="gray" variant="h6">
					50%
				</Typography>
			</div>
			<Progress placeholder={'progress'} value={50} color="red" />
		</div>
	);
}
function TooltipWithHelperIcon() {
	return (
		<Tooltip
			content={
				<div className="w-80">
					<Typography placeholder={'head'} color="white" className="font-medium">
						Taming monster
					</Typography>
					<Typography placeholder={'info'} variant="small" color="white" className="font-normal opacity-80">
						Choose the right food to tame the monster. The monster will be tamed if you feed it several
						times.
					</Typography>
				</div>
			}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
				strokeWidth={2}
				className="h-7 w-7 cursor-pointer text-gray-500"
			>
				<path
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
				/>
			</svg>
		</Tooltip>
	);
}

const Item = ({ id, handleItemClick }: any) => {
	const [isClicked, setIsClicked] = useState(false);

	return (
		<Tooltip content="Item">
			<div
				id={id}
				// Move image to center of screen when clicked
				className={clsx(
					'pixel-img m-8 relative shadow-lg shadow-black/20',
					isClicked ? 'scale-90' : 'hover:scale-110'
				)}
				onClick={() => {
					setIsClicked(true);
					handleItemClick(id);
					setTimeout(() => setIsClicked(false), 100);
				}}
			>
				<img
					referrerPolicy="no-referrer"
					className="w-full rounded-md opacity-80 hover:opacity-100"
					src={images[id]}
					alt=""
				/>
				<span className="absolute rounded-full py-1 px-1 text-md font-medium content-[''] leading-none grid place-items-center top-[4%] right-[2%] translate-x-2/4 -translate-y-2/4 bg-red-500 text-white min-w-[36px] min-h-[36px] bg-gradient-to-tr from-green-400 to-green-600 border-2 border-white shadow-lg shadow-black/20">
					5
				</span>
			</div>
		</Tooltip>
	);
};

const Monster = () => {
	const [monsters, setMonsters] = useState<monsterInterface[]>([]);
	const navigate = useNavigate();
	const [shake, setShake] = useState(false);

	useEffect(() => {
		tokenAuth(navigate, '/monster');
		const headers = {
			authorization: `Bearer ${localStorage.getItem('access_token')}`,
			refreshToken: `Bearer ${localStorage.getItem('refresh_token')}`,
			email: `${localStorage.getItem('email')}`,
		};

		axios
			.get(`http://localhost:${Config.BACKEND_PORT}/monster`, { headers })
			.then((response) => {
				const result = response.data as returnInterface;
				const monsterResult = result.data['monsters'] as monsterInterface[];

				setMonsters(monsterResult);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	const handleItemClick = (itemId: number) => {
		setShake(true);
		setTimeout(() => setShake(false), 500); // Animation duration is 500ms
	};

	const tameMonster = (item_id: number) => {
		axios
			.post(`http://localhost:${Config.BACKEND_PORT}/monster/tame/${item_id}`)
			.then((response) => {
				console.log(response.data);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<>
			<div className="grid grid-rows-2 grid-container">
				<div className="row-span-1 flex items-center justify-center relative bg-gray-900 ">
					<div className="flex flex-col items-center absolute mt-10">
						{monsters.map((monster) => (
							<div key={monster.monster_id} className="pixel-img flex flex-col">
								<h2
									className="text-3xl font-bold text-center text-white rounded-md shadow-lg shadow-black/20 "
									style={{ background: 'rgba(0, 0, 0, 0.5)' }}
								>
									{monster.monster_name}
								</h2>
								<img
									referrerPolicy="no-referrer"
									src={monster.image_url}
									alt={monster.monster_name}
									className={`w-[16rem] ${shake ? 'shake-animation' : ''}`}
									style={{ height: '270px', width: '270px' }}
								/>
							</div>
						))}
					</div>
					<img src={background} className="object-cover monster-image" style={{ opacity: 0.7 }} alt="" />
				</div>

				{/* Item zone */}
				<div className="pt-8 row-span-1 bg-gray-900 overflow-x-hidden">
					<div className="flex flex-row pl-28">
						<TooltipWithHelperIcon />
						<h1 className="pl-2 text-gray-500 text-xl font-bold">Available foods</h1>
					</div>
					<section>
						<Carousel
							show={6.5}
							slide={3}
							className="gap-2"
							responsive
							leftArrow={
								<IconButton placeholder={'left'} className="mt-28 ml-8 bg-red-400 rounded-full">
									<HiArrowCircleLeft size={24} />
								</IconButton>
							}
							rightArrow={
								<IconButton placeholder={'right'} className="mt-28 mr-8 bg-red-400 rounded-full">
									<HiArrowCircleRight size={24} />
								</IconButton>
							}
						>
							{[...Array(9)].map((_, i) => (
								<Item id={i} key={i} handleItemClick={handleItemClick}></Item>
							))}
						</Carousel>
					</section>
				</div>
			</div>
		</>
	);
};

export default Monster;
