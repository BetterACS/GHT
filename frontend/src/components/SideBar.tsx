import React from 'react';
import clsx from 'clsx';
import '../styles/Sidebar.css';
import { TagType } from '../utils/types';
import { IconButton, Button } from '@material-tailwind/react';
import { HiArrowCircleLeft, HiArrowCircleRight } from 'react-icons/hi';
import { BsBackpackFill } from 'react-icons/bs';
import { MdAdd, MdScience } from 'react-icons/md';
import { FaGamepad, FaSpaghettiMonsterFlying } from 'react-icons/fa6';
import { Tooltip } from '@material-tailwind/react';

interface BarProps {
	tags: TagType[];
	active_site?: string;
}
import { List, ListItem, ListItemSuffix, Chip, Card } from '@material-tailwind/react';
import { divider } from '@nextui-org/react';

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

const MenuSideBar = ({ name, icon, content, href }: any) => {
	return (
		<div className="w-full">
			<Tooltip content={content}>
				<Button fullWidth variant="outlined" className="flex items-center gap-3 text-lg">
					{icon}
					{name}
				</Button>
			</Tooltip>
		</div>
	);
};

const SideBar = ({ tags, active_site }: BarProps) => {
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
						<MenuSideBar
							icon={<FaGamepad size={25} />}
							name={<span>Quest</span>}
							content="Navigate to quest page"
						/>
						<MenuSideBar
							icon={<BsBackpackFill size={25} />}
							name={<span>Inventory</span>}
							content="User inventory"
						/>
						<MenuSideBar
							icon={<FaSpaghettiMonsterFlying size={25} />}
							name={<span>Monster</span>}
							content="Hunt a monster!!"
						/>
						<MenuSideBar
							icon={<MdScience size={25} />}
							name={<span>Analytics</span>}
							content="Time to analysed your work"
						/>
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
