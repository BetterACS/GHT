import React from 'react';
import clsx from 'clsx';
import { TagType } from '../utils/types';
import { IconButton, Button } from '@material-tailwind/react';
import { HiArrowCircleLeft, HiArrowCircleRight } from 'react-icons/hi';
import { MdAdd, MdScience } from 'react-icons/md';
// import { Button } from '@material-tailwind/react';
import { FaGamepad, FaSpaghettiMonsterFlying } from 'react-icons/fa6';

import '../styles/Sidebar.css';
interface BarProps {
	tags: TagType[];
}
import { List, ListItem, ListItemSuffix, Chip, Card } from '@material-tailwind/react';

export function ListWithBadge({ tags }: BarProps) {
	return (
		<Card className="w-full">
			<List>
				{tags.map((tag: TagType) => (
					<ListItem>
						{tag.name}
						<ListItemSuffix>
							<Chip value="14" variant="ghost" size="sm" className="rounded-full" />
						</ListItemSuffix>
					</ListItem>
				))}
			</List>
		</Card>
	);
}

const SideBar = ({ tags }: BarProps) => {
	const [isOpen, setOpen] = React.useState(false);
	return (
		<div className="flex flex-row">
			{/* Sidebar */}
			<div
				className={clsx('bg-gray-100 h-screen overflow-y-auto transition-all duration-200', {
					'w-96': isOpen, // Width when open
					'w-0': !isOpen, // Width when closed
				})}
			>
				<div className="w-full h-auto p-4 flex flex-row">
					<div className="basis-10/12 flex flex-row">
						<div className="text-headlines self-center px-4 font-bold text-xl">Monshinawatra</div>
					</div>
					<IconButton className="bg-red-400 rounded-full" onClick={() => setOpen(!isOpen)}>
						<HiArrowCircleLeft size={24} />
					</IconButton>
				</div>
				{/* Sidebar content goes here */}
				<div className="w-96">
					<ul className="px-8 flex flex-col gap-4">
						<div>
							<IconButton className="bg-red-400 rounded-full w-8 h-8">
								<MdAdd color="white" size={24} />
							</IconButton>

							<span className="pl-2 text-center text-lg">Add task</span>
						</div>
						<Button variant="outlined" className="flex items-center gap-3 text-lg">
							<FaGamepad size={25} />
							Quest
						</Button>
						<Button variant="outlined" className="flex items-center gap-3 text-lg">
							<FaSpaghettiMonsterFlying size={25} />
							Monster
						</Button>
						<Button variant="outlined" className="flex items-center gap-3 text-lg">
							<MdScience size={25} />
							Analytics
						</Button>
					</ul>
					<hr className="mt-5 mb-2" />
					<b className="px-8 text-lg">Working tags</b>
					<div className="px-8 pt-2">
						<ListWithBadge tags={tags} />
					</div>
				</div>
			</div>

			{/* Main content */}
			<div className="flex-grow">
				{/* Replace this with your main content */}
				<div className="w-12 p-4 justify-start">
					<div className={clsx({ 'opacity-0': isOpen, 'opacity-100': !isOpen })}>
						<IconButton className="bg-red-400 rounded-full" onClick={() => setOpen(!isOpen)}>
							<HiArrowCircleRight size={24} />
						</IconButton>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SideBar;
