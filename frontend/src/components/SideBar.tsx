import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { TagType } from '../utils/types';
import { IconButton, Button } from '@material-tailwind/react';
import { HiArrowCircleLeft, HiArrowCircleRight } from 'react-icons/hi';
import { MdAdd, MdScience } from 'react-icons/md';
// import { Button } from '@material-tailwind/react';
import { FaGamepad, FaSpaghettiMonsterFlying } from 'react-icons/fa6';

import '../styles/Sidebar.css';
import { List, ListItem, ListItemSuffix, Chip, Card } from '@material-tailwind/react';
import axios from 'axios';
import { HeadersType } from '../utils/types';
import { returnInterface } from '../../../backend/src/utils/interfaces';
import Config from '../../../backend/src/config';

interface BarProps {
	tags: TagType[];
	username: string;
	handleButtonClick: (tag_id: string) => void;
	header:HeadersType
	handleButtonClickResetFilter: () => void;
	showWorkingTags:boolean;
}
//util funciton
const countTag = async (tag_id:string,headers:HeadersType) => {
	try {
		const results = await axios.get(`http://localhost:${Config.BACKEND_PORT}/tag/count`, {
			params: {
				tag_id: tag_id,
			},
			headers: headers,
		});
		const result = results.data as returnInterface;
		const total = result.data.total.toString();
		return total as string;
	} catch (error) {
		console.error('Error to query user', error);
	}
}
export function ListWithBadge({ tags, handleButtonClick, header}: BarProps) {
	console.log('ListWithBadge rendered');
  
	const [tagCounts, setTagCounts] = useState<{ [key: string]: string | undefined }>({});
  
	useEffect(() => {
	  const fetchTagCounts = async () => {
		const counts = await Promise.all(
		  tags.map(async (tag) => {
			const count = await countTag(tag.id.toString().replace('tag-', ''), header);
			return { [tag.id.toString()]: count };
		  })
		);
  
		// Merge counts into a single object
		const mergedCounts = counts.reduce((acc, count) => ({ ...acc, ...count }), {});
		setTagCounts(mergedCounts);
	  };
  
	  fetchTagCounts();
	}, [tags, header]);
  
	return (
	  <Card className="w-full">
		<List>
		  {tags.map((tag: TagType) => (
			<ListItem key={tag.id} onClick={() => handleButtonClick(tag.id.toString())}>
			  {tag.name}
			  <ListItemSuffix>
				<Chip
				  value={tagCounts[tag.id.toString()]}
				  variant="ghost"
				  size="sm"
				  className="rounded-full"
				/>
			  </ListItemSuffix>
			</ListItem>
		  ))}
		</List>
	  </Card>
	);
  }

const SideBar = ({ tags,username ,handleButtonClick,header,handleButtonClickResetFilter,showWorkingTags}: BarProps) => {
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
						{/* ใช้เป็น username */}
						<div className="text-headlines self-center px-4 font-bold text-xl">{username}</div>
					</div>
					<IconButton className="bg-red-400 rounded-full" onClick={() => setOpen(!isOpen)}>
						<HiArrowCircleLeft size={24} />
					</IconButton>
				</div>
				{/* Sidebar content goes here */}
				<div className="w-96">
					<ul className="px-8 flex flex-col gap-4">
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
					{/*  working tags zone*/}

					{showWorkingTags && (
						<div>
							<b className="px-8 text-lg">Working tags</b>
							
							<IconButton className="bg-red-400 rounded-full w-8 h-8" onClick={handleButtonClickResetFilter}>
							<MdAdd color="white" size={24} />
							</IconButton>
							
							<div className="px-8 pt-2">
							<ListWithBadge tags={tags} username={username} handleButtonClick={handleButtonClick} header={header} handleButtonClickResetFilter={handleButtonClickResetFilter} showWorkingTags={showWorkingTags}/>
							</div>
						</div>
						)}
					{/* working tags zone end */}
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
function updateAccessToken(newToken: string, newRefresh: string): Promise<void> {
	throw new Error('Function not implemented.');
}

