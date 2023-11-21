import { useEffect, useState } from 'react';
import axios from 'axios';
import Config from '../../../backend/src/config';
import { useNavigate } from 'react-router-dom';
import { monsterInterface, returnInterface } from '../../../backend/src/utils/interfaces';
import background from '../assets/sample_scene.png';
import tokenAuth from '../utils/tokenAuth';

const Monster = () => {
	const [monsters, setMonsters] = useState<monsterInterface[]>([]);
	const navigate = useNavigate();

	useEffect(() => {
		tokenAuth(navigate, '/monster');
		const headers = {
			authorization: `Bearer ${localStorage.getItem('access_token')}`,
			refreshToken: `Bearer ${localStorage.getItem('refresh_token')}`,
			email: `${localStorage.getItem('email')}`,
		};
		axios
			.get(`http://localhost:${Config.BACKEND_PORT}/monster`, { headers: headers })
			.then((response) => {
				const result = response.data as returnInterface;
				const monsterResult = result.data['monsters'] as monsterInterface[];

				setMonsters(monsterResult);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

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
			<div className="grid grid-rows-2 ">
				<div className="row-span-1">
					<img src={background} alt="" />
					{monsters.map((monster) => (
						<div className="absolute top-0 middle-0 content-" key={monster.monster_id}>
							<img src={monster.image_url} alt={monster.monster_name} />
							<h2>{monster.monster_name}</h2>
						</div>
					))}
				</div>

				<div className="row-span-1 bg-black ">
					<button
						className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4"
						onClick={() => tameMonster(1)}
					>
						1
					</button>

					<button
						className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4"
						onClick={() => tameMonster(2)}
					>
						2
					</button>

					<button
						className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4"
						onClick={() => tameMonster(3)}
					>
						3
					</button>

					<button
						className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4"
						onClick={() => tameMonster(4)}
					>
						4
					</button>

					<button
						className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4"
						onClick={() => tameMonster(5)}
					>
						5
					</button>
				</div>
			</div>
		</>
	);
};

export default Monster;
