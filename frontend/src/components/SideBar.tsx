import React from 'react';
import clsx from 'clsx';
import Activity from './Activity';
import '../styles/Sidebar.css';
interface BarProps {
	isOpen: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Bar = ({ isOpen, setOpen }: BarProps) => {
	return (
		<div className="flex flex-row">
			{/* Sidebar */}
			<div
				className={clsx('bg-gray-800 h-screen overflow-y-auto transition-all duration-200', {
					'w-96': isOpen, // Width when open
					'w-0': !isOpen, // Width when closed
				})}
			>
				<div className="w-full h-auto p-4 flex flex-row">
					<div className="basis-10/12 flex flex-row">
						<img
							src="https://scontent.fbkk12-4.fna.fbcdn.net/v/t39.30808-6/367450487_1410475112858525_1126649449003258948_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=efb6e6&_nc_eui2=AeF2GSPlA0-k5nhSh-LPzQ6OGhcYGNsyLe4aFxgY2zIt7rlUewfPwqtr2HuDgUuPrp9GnFFtlGzr0eWQeJBI8Iya&_nc_ohc=UZr9gBt55oEAX96Knbk&_nc_ht=scontent.fbkk12-4.fna&cb_e2o_trans=t&oh=00_AfBiQ7syIf-XJG9z2-dmAb5Utd8vDj-JjiYS4mWcuofXVw&oe=657949F1"
							className="profile-sidebar"
							alt="Pokemon"
						></img>
						<div className="text-white self-center px-4">Monshinawatra</div>
					</div>
					<button onClick={() => setOpen(!isOpen)}>x</button>
				</div>
				{/* Sidebar content goes here */}
				<div className="w-96">
					<ul className="p-4">
						<button className="my-5 p-2 block text-center text-white w-full bg-transparent border-2 border-white focus:outline-none hover:bg-white hover:text-black hover:border-cyan-300 transition-all duration-300">
							Quest
						</button>
						<button className="my-5 p-2 block text-center text-white w-full bg-transparent border-2 border-white focus:outline-none hover:bg-white hover:text-black hover:border-cyan-300 transition-all duration-300">
							Tasks
						</button>
						<button className="my-5 p-2 block text-center text-white w-full bg-transparent border-2 border-white focus:outline-none hover:bg-white hover:text-black hover:border-cyan-300 transition-all duration-300">
							Achievement
						</button>

						<div className="m-8">
							<Activity />
						</div>
						{/* Add more buttons as needed */}
					</ul>
				</div>
			</div>

			{/* Main content */}
			<div className="flex-grow">
				{/* Replace this with your main content */}
				<div className="w-12 p-4 justify-start">
					<button
						className={clsx({ 'opacity-0': isOpen, 'opacity-100': !isOpen })}
						onClick={() => setOpen(!isOpen)}
					>
						y
					</button>
				</div>
			</div>
		</div>
	);
};

const Sidebar = () => {
	const [open, setOpen] = React.useState(false);
	return <Bar isOpen={open} setOpen={setOpen} />;
};

export default Sidebar;
