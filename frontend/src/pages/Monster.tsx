import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Config from '../../../backend/src/config';
import { useNavigate } from 'react-router-dom';
import { monsterInterface, returnInterface } from '../../../backend/src/utils/interfaces';
import background from '../assets/sample_scene.png';
import tokenAuth from '../utils/tokenAuth';
import '../styles/Monster.css';
import Swiper from 'swiper';
import { Carousel } from '@trendyol-js/react-carousel';

const Monster = () => {
	const [monsters, setMonsters] = useState<monsterInterface[]>([]);
	const [items, setItems] = useState<number[]>([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]);
	const navigate = useNavigate();

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

		// const swiper = new Swiper('.swiper-container', {
		//   effect: 'coverflow',
		//   grabCursor: true,
		//   centeredSlides: true,
		//   slidesPerView: "auto",
		//   coverflowEffect: {
		//     rotate: 0,
		//     stretch: 0,
		//     depth: 100,
		//     modifier: 2,
		//     slideShadows: true,
		//   },
		//   spaceBetween: 0,
		//   loop: true,
		//   pagination: {
		//     el: '.swiper-pagination',
		//     clickable: true,
		//   },
		// });

		// return () => {
		// 	// Clean up Swiper instance when component unmounts
		// 	swiper.destroy();
		// };
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

	const handleItemClick = (itemId: number) => {
		console.log(`Item ${itemId} clicked`);
	};

	return (
		<>
			<div className="grid grid-rows-2 grid-container">
				<div className="row-span-1 flex items-center justify-center relative">
					<img src={background} className="object-cover monster-image" alt="" />
					<div className="flex flex-col items-center absolute mt-10">
						{monsters.map((monster) => (
							<div key={monster.monster_id}>
								<h2 className="text-3xl font-bold text-center text-red-600">
									{monster.monster_name}
								</h2>
								<img src={monster.image_url} alt={monster.monster_name} className="w-[16rem]" />
							</div>
						))}
					</div>
				</div>

				{/* Item zone */}
				<div className="row-span-1 bg-gray-800 text-center overflow-x-hidden">
					<h1 className="text-white text-4xl font-bold m-4">ITEM</h1>
					<section>
						{/* <div className="swiper-container">
              <div className="swiper-wrapper">
                {items.map((item) => (
                  <div
                    key={item}
                    className="swiper-slide bg-transparent border-4 border-white rounded-full hover:scale-110 font-bold h-12 w-12"
                    onClick={() => handleItemClick(item)}
                  >
                    <span className="text-white">{item}</span>
                  </div>
                ))}
              </div>
            </div> */}
						{/*<div>
							<Carousel show={5} slide={3} swiping={true} className='mt-10'>
								{items.map((item) => (
									<div
										key={item}
										className="swiper-slide bg-transparent border-4 border-white rounded-full hover:scale-110 font-bold h-24 w-24"
										onClick={() => handleItemClick(item)}
									>
										<span className="text-white">{item}</span>
									</div>
								))}
							</Carousel>
								</div> */}
						<div>

						</div>
					</section>
				</div>
			</div>
		</>
	);
};

export default Monster;
