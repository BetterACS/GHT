import React from 'react';
import clsx from 'clsx';
import { TagType } from '../utils/types';
import { IconButton } from '@material-tailwind/react';
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

				{/* <ListItem>
					Inbox
					<ListItemSuffix>
						<Chip value="14" variant="ghost" size="sm" className="rounded-full" />
					</ListItemSuffix>
				</ListItem>
				<ListItem>
					Spam
					<ListItemSuffix>
						<Chip value="2" variant="ghost" size="sm" className="rounded-full" />
					</ListItemSuffix>
				</ListItem>
				<ListItem>
					Trash
					<ListItemSuffix>
						<Chip value="40" variant="ghost" size="sm" className="rounded-full" />
					</ListItemSuffix>
				</ListItem> */}
			</List>
		</Card>
	);
}

import { Menu, MenuHandler, MenuList, MenuItem, Button } from '@material-tailwind/react';

export function MenuDefault() {
	return (
		<Menu>
			<MenuHandler>
				<Button>Menu</Button>
			</MenuHandler>
			<MenuList>
				<MenuItem>Menu Item 1</MenuItem>
				<MenuItem>Menu Item 2</MenuItem>
				<MenuItem>Menu Item 3</MenuItem>
			</MenuList>
		</Menu>
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

					{/* <Switch size={100} crossOrigin={'anonymous'} label="Night" /> */}
					{/* <button className="ml-5 bg-button" onClick={() => setOpen(!isOpen)}>
						<HiChevronDoubleLeft />
					</button> */}
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

							<span className="pl-2 text-center">Add task</span>
						</div>
						<Button fullWidth variant="outlined" className="flex items-center gap-3">
							<FaGamepad size={25} />
							Quest
						</Button>
						<Button variant="outlined" className="flex items-center gap-3">
							<FaSpaghettiMonsterFlying size={25} />
							Monster
						</Button>
						<Button variant="outlined" className="flex items-center gap-3">
							<MdScience size={25} />
							Analytics
						</Button>
					</ul>

					{/* Collapsible toggle list (filter) */}
					{/* <div className="px-8 pt-6">
						<div className="flex flex-row">
							<b className="pl-2 text-lg">Working tags</b>
						</div>
						<div className="flex flex-col">
							{tags.map((tag: TagType) => (
								<div className="flex flex-row py-2 mx-2 hover:bg-secondary-light rounded-md ">
									<div className={clsx('ml-2 w-5 h-5 rounded-full', tag.color)}></div>
									<div className="pl-2">{tag.name}</div>
									<div className="ml-auto mr-2">5/10</div>
								</div>
							))}
						</div>
					</div> */}
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
