import { useEffect, useState } from 'react';
import '../styles/Monster.css';
import { Tooltip } from '@material-tailwind/react';
import { Typography } from '@material-tailwind/react';
import clsx from 'clsx';

const Item = ({ handleItemClick, item, onZero }: any) => {
	const [isClicked, setIsClicked] = useState(false);
	const [num, setNum] = useState(item.quantity);

	// Use ref of parent component to update item quantity

	useEffect(() => {
		if (num === 0) {
			onZero();
			setIsClicked(false);
		}
	}, [num]);

	const onClick = () => {
		setIsClicked(true);
		handleItemClick(item.item_id);
		setNum(num - 1);
		setTimeout(() => setIsClicked(false), 100);
	};

	return (
		<Tooltip
			content={
				<div className="w-96">
					<Typography placeholder={'head'} color="white" className="font-medium">
						{item.item_name}
					</Typography>
					<Typography placeholder={'info'} variant="small" color="white" className="font-normal opacity-80">
						{item.description}
					</Typography>
				</div>
			}
		>
			<div
				id={item.item_id}
				// Move image to center of screen when clicked
				className={clsx(
					'pixel-img m-8 relative shadow-lg shadow-black/20',
					isClicked ? 'scale-90' : 'hover:scale-110',
					num <= 0 && 'opacity-0 hidden transition-all duration-200'
				)}
				onClick={() => onClick()}
			>
				<img
					referrerPolicy="no-referrer"
					className="w-full rounded-md opacity-80 hover:opacity-100"
					src={item.image_url}
					alt=""
				/>
				<span className="absolute rounded-full py-1 px-1 text-md font-medium content-[''] leading-none grid place-items-center top-[4%] right-[2%] translate-x-2/4 -translate-y-2/4 bg-red-500 text-white min-w-[36px] min-h-[36px] bg-gradient-to-tr from-green-400 to-green-600 border-2 border-white shadow-lg shadow-black/20">
					{num}
				</span>
			</div>
		</Tooltip>
	);
};

export default Item;
