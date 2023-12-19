import { useEffect, useState } from 'react';
import axios from 'axios';
import Config from '../../../backend/src/config';
import { useNavigate } from 'react-router-dom';
import { monsterInterface, returnInterface } from '../../../backend/src/utils/interfaces';
import background from '../assets/sample_scene.png';
import tokenAuth from '../utils/tokenAuth';
import '../styles/Monster.css';
import { Carousel } from '@trendyol-js/react-carousel';
import { IconButton, Tooltip } from '@material-tailwind/react';
import { HiArrowCircleLeft, HiArrowCircleRight } from 'react-icons/hi';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import SideBar from '../components/SideBar';
import { Typography } from '@material-tailwind/react';
import Item from '../components/Item';

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

const Monster = () => {
	const [monsters, setMonsters] = useState<monsterInterface[]>([]);
	const [items, setItems] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [itemLoading, setItemLoading] = useState(false);
	const navigate = useNavigate();
	const [shake, setShake] = useState(false);
	const email = localStorage.getItem('email');

	const headers = {
		authorization: `Bearer ${localStorage.getItem('access_token')}`,
		refreshToken: `Bearer ${localStorage.getItem('refresh_token')}`,
		email: email,
	};

	const handleItemClick = (itemId: number) => {
		setShake(true);
		tameMonster(itemId);
		setTimeout(() => setShake(false), 500); // Animation duration is 500ms
	};

	useEffect(() => {
		tokenAuth(navigate, '/monster');
		getMonsters();
		getItems();
	}, []);

	const getMonsters = async () => {
		try {
			const response = await axios.get(`http://localhost:${Config.BACKEND_PORT}/monster`, { headers });
			const result = response.data as returnInterface;
			const monsterResult = result.data['monsters'] as monsterInterface[];

			setMonsters(monsterResult);
		} catch (err) {
			console.log(err);
		}
	};

	const getItems = async () => {
		try {
			const response = await axios.get(`http://localhost:${Config.BACKEND_PORT}/items`, {
				params: {
					email: email,
				},
				headers: headers,
			});

			// Filter out items with quantity greater than 0 and map to create item fetch requests
			const itemRequests = response.data
				.map((quantity: number, item_id: number) => {
					if (quantity > 0) {
						return axios
							.get(`http://localhost:${Config.BACKEND_PORT}/item`, {
								params: { id: item_id },
								headers: headers,
							})
							.then((itemResponse) => ({
								item_id: item_id.toString(),
								quantity: quantity,
								...itemResponse.data.data,
							}))
							.catch((err) => {
								console.log(`Error fetching item with ID ${item_id}:`, err);
								return null; // Return null for failed requests
							});
					}
					return null;
				})
				.filter((quantity: number) => quantity !== null); // Filter out nulls which represent items with quantity 0 or less

			const fetchedItems = await Promise.all(itemRequests);
			const validItems = fetchedItems.filter((item) => item !== null); // Filter out null values from failed requests

			setItems(validItems);
			setLoading(false);
		} catch (err) {
			console.log('Error fetching items:', err);
		}
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
					if (item.item_id === item_id) {
						if (item.quantity > 0) {
							item.quantity -= 1;
						} else {
							setItemLoading(true);
							item.quantity = 0;

							// update item quantity
							console.log('update item quantity');
							const newItems = items.filter((item) => item.quantity > 0);
							setItems(newItems);
							setItemLoading(false);
						}
					}
				});
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
	};

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<>
			<SideBar.speedDial />
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
						{itemLoading ? (
							<div>Loading...</div>
						) : (
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
								{items.map((item) => (
									// Check if item quantity is > 0
									<Item
										key={item.item_id}
										handleItemClick={handleItemClick}
										item={item}
										id={item.item_id}
										img_url={item.image_url}
										quantiy={item.quantity}
									/>
								))}
							</Carousel>
						)}
					</section>
				</div>
			</div>
		</>
	);
};

export default Monster;
