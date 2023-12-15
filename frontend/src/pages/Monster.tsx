import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Config from '../../../backend/src/config';
import { useNavigate } from 'react-router-dom';
import { monsterInterface, returnInterface } from '../../../backend/src/utils/interfaces';
import background from '../assets/sample_scene.png';
import tokenAuth from '../utils/tokenAuth';
import '../styles/Monster.css';
import { Carousel } from '@trendyol-js/react-carousel';
import { IconButton, Button, Tooltip } from '@material-tailwind/react';
import { HiArrowCircleLeft, HiArrowCircleRight } from 'react-icons/hi';
import { FaGamepad, FaSpaghettiMonsterFlying } from 'react-icons/fa6';
import { MdAdd, MdScience, MdOutlinePets, MdEmail } from 'react-icons/md';
import clsx from 'clsx';

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

const Item = ({ id, handleItemClick, img_url, quantiy }: any) => {
	const [isClicked, setIsClicked] = useState(false);
	const [num, setNum] = useState(quantiy);

	return (
		// div when number of item is 0
		//

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
					setNum(num - 1);
					setTimeout(() => setIsClicked(false), 100);
				}}
			>
				<img
					referrerPolicy="no-referrer"
					className="w-full rounded-md opacity-80 hover:opacity-100"
					src={img_url}
					alt=""
				/>
				<span className="absolute rounded-full py-1 px-1 text-md font-medium content-[''] leading-none grid place-items-center top-[4%] right-[2%] translate-x-2/4 -translate-y-2/4 bg-red-500 text-white min-w-[36px] min-h-[36px] bg-gradient-to-tr from-green-400 to-green-600 border-2 border-white shadow-lg shadow-black/20">
					{num}
				</span>
			</div>
		</Tooltip>
	);
};

import { SpeedDial, SpeedDialHandler, SpeedDialContent, SpeedDialAction } from '@material-tailwind/react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export function DefaultSpeedDial() {
	const navigate = useNavigate();
	return (
		<div className="absolute top-0 left-0 z-10 m-4">
			<SpeedDial placement="right">
				<SpeedDialHandler>
					<IconButton placeholder={0} size="lg" className="rounded-full">
						<FaSpaghettiMonsterFlying
							className="h-5 w-5 transition-transform group-hover:rotate-45"
							size={25}
						/>
					</IconButton>
				</SpeedDialHandler>
				<SpeedDialContent placeholder={0} className="flex-row">
					<SpeedDialAction placeholder={0} onClick={() => navigate('/quest')}>
						<FaGamepad className="h-5 w-5" size={25} />
					</SpeedDialAction>
					<SpeedDialAction placeholder={0} onClick={() => navigate('/analysis')}>
						<MdScience className="h-5 w-5" size={25} />
					</SpeedDialAction>
					<SpeedDialAction placeholder={0} onClick={() => navigate('/collection')}>
						<MdOutlinePets className="h-5 w-5" size={25} />
					</SpeedDialAction>
				</SpeedDialContent>
			</SpeedDial>
		</div>
	);
}

const Monster = () => {
	const [monsters, setMonsters] = useState<monsterInterface[]>([]);
	const [items, setItems] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();
	const [shake, setShake] = useState(false);

	useEffect(() => {
		tokenAuth(navigate, '/monster');
		const headers = {
			authorization: `Bearer ${localStorage.getItem('access_token')}`,
			refreshToken: `Bearer ${localStorage.getItem('refresh_token')}`,
			email: `${localStorage.getItem('email')}`,
		};

		const fetchData = async () => {
			setLoading(true); // Set loading to true when data fetch begins
			try {
				const response = await axios.get(`http://localhost:${Config.BACKEND_PORT}/monster`, { headers });
				const result = response.data as returnInterface;
				const monsterResult = result.data['monsters'] as monsterInterface[];

				setMonsters(monsterResult);
				await getItems();
			} catch (err) {
				console.log(err);
			}
		};

		Promise.all([fetchData()]);
	}, []);

	const handleItemClick = (itemId: number) => {
		setShake(true);
		tameMonster(itemId);
		setTimeout(() => setShake(false), 500); // Animation duration is 500ms
	};

	const tameMonster = async (item_id: number) => {
		console.log('tame monster');
		const results = await axios
			.put(
				`http://localhost:${Config.BACKEND_PORT}/item/use`,
				{
					email: localStorage.getItem('email'),
					item_id: item_id,
				},
				{
					headers: {
						authorization: `Bearer ${localStorage.getItem('access_token')}`,
						refreshToken: `Bearer ${localStorage.getItem('refresh_token')}`,
						email: `${localStorage.getItem('email')}`,
					},
				}
			)
			.then(async (response) => {
				console.log(response);
				items.map((item) => {
					if (item.item.item_id === item_id) {
						item.quantity -= 1;
					}
				});

				// Delete item if quantity is 0
				// const newItems = items.filter((item) => item.quantity > 0);
				// setItems(newItems);

				await axios
					.post(`http://localhost:${Config.BACKEND_PORT}/monster/tame/${item_id}`, {
						email: localStorage.getItem('email'),
					})
					.then((response) => {
						const result = response.data.progress;
						if (result >= 100) {
							const MySwal = withReactContent(Swal);
							MySwal.fire({
								title: 'You have tamed the monster!',
								icon: 'success',
								confirmButtonText: 'Ok',
							});
						}
					})
					.catch((err) => {
						console.log(err);
					});
			});

		const newItems = items.filter((item) => item.quantity > 0);
		setItems(newItems);
	};

	const getItems = async () => {
		const email = localStorage.getItem('email');
		const headers = {
			authorization: `Bearer ${localStorage.getItem('access_token')}`,
			refreshToken: `Bearer ${localStorage.getItem('refresh_token')}`,
			email: email,
		};
		await axios
			.get(`http://localhost:${Config.BACKEND_PORT}/items`, {
				params: {
					email: email,
				},
				headers: headers,
			})
			.then(async (response) => {
				const result = response.data;
				const itemsss = Object.keys(result);
				const allItems: any = [];

				itemsss.map(async (itemsad: any) => {
					const idd = itemsad;
					console.log('idd', result[idd]);

					if (result[idd] !== null && result[idd] !== 0) {
						const item = await axios.get(`http://localhost:${Config.BACKEND_PORT}/item/`, {
							params: {
								id: itemsad,
							},
							headers: headers,
						});

						const newItem = {
							item: item.data.data,
							quantity: result[idd],
						};
						// console.log(newItem);
						await allItems.push(newItem);
					}
				});

				setItems(allItems);
				await setLoading(false); // Set loading to false when data fetch is complete
				console.log('allItems', allItems);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	if (loading) {
		return <></>;
	}

	return (
		<>
			<DefaultSpeedDial />
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
						{/* {items.length} */}
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
							{/* If item have quantity */}
							{items.map((item) => (
								<Item
									key={item.item.item_id}
									id={item.item.item_id}
									handleItemClick={handleItemClick}
									img_url={item.item.image_url}
									quantiy={item.quantity}
								/>
							))}
						</Carousel>
					</section>
				</div>
			</div>
		</>
	);
};

export default Monster;
