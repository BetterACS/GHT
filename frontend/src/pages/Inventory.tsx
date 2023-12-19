import { useEffect, useState } from 'react';

import '../styles/Inventory.css';
import axios from 'axios';
import tokenAuth from '../utils/tokenAuth';
import { useNavigate } from 'react-router-dom';
import SideBar from '../components/SideBar';
import authorization from '../utils/authorization';
import { returnInterface } from '../../../backend/src/utils/interfaces';
import Config from '../../../backend/src/config';

const Inventory = () => {
	const navigate = useNavigate();
	const [monster, setMonster] = useState<any>([]);
	const [loading, setLoading] = useState(true);
	const [username, setUsername] = useState('');
	const [accessToken, setAccessToken] = useState(localStorage.getItem('access_token'));
	const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refresh_token'));

	const email = localStorage.getItem('email') || '';

	let headers = {
		authorization: `Bearer ${localStorage.getItem('access_token')}`,
		refreshToken: `Bearer ${localStorage.getItem('refresh_token')}`,
		email: `${localStorage.getItem('email')}`,
	};

	const updateAccessToken = async (newToken: string, newRefresh: string) => {
		await setAccessToken(newToken);
		await localStorage.setItem('access_token', newToken);
		await setRefreshToken(newRefresh);
		await localStorage.setItem('refresh_token', newRefresh);
		console.log('update access token', newToken);
	};

	useEffect(() => {
		tokenAuth(navigate, '/collection', '/log_in');
		userQuery();
		fetchMonster();
	}, []);

	const userQuery = async () => {
		try {
			const results = await axios.get(`http://localhost:${Config.BACKEND_PORT}/user`, {
				params: { email: email },
				headers: headers,
			});
			const result = results.data as returnInterface;
			authorization(
				result,
				async () => {
					setUsername(result.data[0].username);
				},
				updateAccessToken
			);
		} catch (error) {
			console.error('Error to query user', error);
		}
	};

	const fetchMonster = async () => {
		setLoading(true);
		const response = await axios.get('http://localhost:5000/monster/user', {
			params: { email: `${localStorage.getItem('email')}` },
		});
		const data = response.data.data['monsters'];

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
			<div className="flex flex-row">
				<SideBar.noWorkingTags username={username} header={headers} currentPage="collection" />
				<div className="w-full">
					<h1 className="text-center text-lg sm:text-xl md:text-3xl lg:text-4xl xl:text-6xl mt-8">
						Monster Collection
					</h1>
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-8 img-pixelated p-4 drop-shadow-xl">
						{monster.map((card: any) => (
							<Card key={card.id} imageUrl={card.imageUrl} description={card.description} />
						))}
					</div>
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
