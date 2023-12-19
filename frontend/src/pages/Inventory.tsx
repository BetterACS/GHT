import React, { useEffect } from 'react';
import Image1 from '../assets/1.png';
import Image2 from '../assets/2.png';
import Image3 from '../assets/3.png';
import Image4 from '../assets/4.png';

import '../styles/Inventory.css';
import axios from 'axios';
import { set } from 'date-fns';
import tokenAuth from '../utils/tokenAuth';
import { useNavigate } from 'react-router-dom';

const Inventory = () => {
	const navigate = useNavigate();
	const [monster, setMonster] = React.useState<any>([]);
	const [loading, setLoading] = React.useState(true);
	useEffect(() => {
		tokenAuth(navigate,'/collection', '/log_in');
		fetchMonster();
	}, []);

	const fetchMonster = async () => {
		setLoading(true);
		const response = await axios.get('http://localhost:5000/monster/user', {
			params: {
				email: `${localStorage.getItem('email')}`,
			},
			// headers: {
			// 	authorization: `Bearer ${localStorage.getItem('access_token')}`,
			// 	refreshToken: `Bearer ${localStorage.getItem('refresh_token')}`,
			// 	email: `${localStorage.getItem('email')}`,
			// },
		});
		const data = response.data.data['monsters'];
		// setMonster([]);

		// console.log(response.data);

		data.map((mon: any) => {
			if (mon.progress >= 100) {
				const monCollection = { id: mon.monster, imageUrl: mon.image, description: mon.name };
				monster.push(monCollection);
			}
		});

		setMonster(monster);
		setLoading(false);
	};

	if (loading) {
		return (
			<div className="flex justify-center items-center h-screen">
				<h1 className="text-3xl">Loading...</h1>
			</div>
		);
	}

	return (
		<>
			<div>
				<h1 className="text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl mt-8">Monster Collection</h1>
				<div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-8 img-pixelated p-8 drop-shadow-xl">
					{/* {monster.length === 0 ? (
						<h1 className="text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl mt-8">
							No Monster Collected
						</h1>
					) : null} */}

					{monster.map((card: any) => (
						<Card key={card.id} imageUrl={card.imageUrl} description={card.description} />
					))}
				</div>
			</div>
		</>
	);
};

const Card: React.FC<{ imageUrl: any; description: string }> = ({ imageUrl, description }) => {
	return (
		<div className="card-container">
			<div className="card-content">
				<img
					src={imageUrl}
					alt={description}
					className="w-full object-cover mb-4 rounded-md card-image undrag-img"
				/>
				<p className="text-sm text-gray-600">{description}</p>
			</div>
		</div>
	);
};

export default Inventory;
