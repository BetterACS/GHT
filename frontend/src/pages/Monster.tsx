import { useEffect, useState } from 'react';
import axios from 'axios';
import Config from '../../../backend/src/config';
import { useNavigate } from 'react-router-dom';
import { monsterInterface } from '../../../backend/src/utils/interfaces';
import background from '../assets/sample_scene.png';
import tokenAuth from '../utils/tokenAuth';

/**
 * The Monster component displays a list of monsters.
 */
const Monster = () => {
	/**
	 * @Args monsters: An array of Monster objects
	 * @Args setMonsters: A function that updates the monsters array
	 *
	 * @Args isLoading: A boolean that indicates whether the data is still loading
	 * @Args setIsLoading: A function that updates the isLoading boolean
	 */

	const [loaded, setLoaded] = useState<boolean>(false);
	const [monsters, setMonsters] = useState<monsterInterface[]>([]);
	const navigate = useNavigate();
	// const {timeoutSeconds, start} = useCountdown();

	/**
	 * Use the useEffect hook to make an API call to the backend
	 * when the component is first rendered.
	 */
	useEffect(() => {
		tokenAuth(navigate);
		axios
			.get(`http://localhost:${Config.BACKEND_PORT}/monster`)
			.then((response) => {
				setMonsters(response.data);
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
