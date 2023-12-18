import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import '../styles/Sidebar.css';
import { TagType } from '../utils/types';
import { IconButton, Button } from '@material-tailwind/react';
import { GrPowerReset } from 'react-icons/gr';
import { HiArrowCircleLeft, HiArrowCircleRight } from 'react-icons/hi';
import { FaGamepad, FaSpaghettiMonsterFlying } from 'react-icons/fa6';
import { MdAdd, MdScience, MdOutlinePets } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { SpeedDial, SpeedDialHandler, SpeedDialContent, SpeedDialAction } from '@material-tailwind/react';
import '../styles/Sidebar.css';
import { List, ListItem, ListItemSuffix, Chip, Card } from '@material-tailwind/react';
import axios from 'axios';
import { HeadersType } from '../utils/types';
import { returnInterface } from '../../../backend/src/utils/interfaces';
import Config from '../../../backend/src/config';
import { Menu, MenuHandler, MenuList, MenuItem } from '@material-tailwind/react';
import { InformationTooltip } from './Info';

interface BarProps {
	tags: TagType[];
	username: string;
	handleButtonClick: (tags: string[]) => void;
	header: HeadersType;
	handleButtonClickResetFilter: () => void;
	showWorkingTags: boolean;
	currentPage?: string;
}
import { Checkbox, ListItemPrefix, Typography } from '@material-tailwind/react';
import { Avatar } from '@material-tailwind/react';

export function ListWithBadge({ tags, handleButtonClick, handleButtonClickResetFilter, header }: BarProps) {
	const [tagCounts, setTagCounts] = useState<{ [key: string]: string | undefined }>({});
	// State to store selected checkbox IDs
	const [selectedTags, setSelectedTags] = useState<string[]>([]);
	// Handle checkbox change
	const handleCheckboxChange = (tagId: string) => {
		const values = selectedTags.includes(tagId)
			? selectedTags.filter((id) => id !== tagId)
			: [...selectedTags, tagId];
		setSelectedTags(values);
		handleButtonClick(values);
	};

	const handleResetFilter = () => {
		setSelectedTags([]);
		handleButtonClick([]);
		handleButtonClickResetFilter();
	};

	const countTag = async (tag_id: string, headers: HeadersType) => {
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
	};

	useEffect(() => {
		const fetchTagCounts = async () => {
			const counts = await Promise.all(
				tags.map(async (tag) => {
					const count = await countTag(tag.id.toString().replace('tag-', ''), header);

					if (count === '0') {
						return {};
					}
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
		<div className="px-8 pt-2">
			<div className="flex flex-row gap-2 pb-2 items-center">
				<InformationTooltip heading="Working tags" message="Click to select tags to filter" position="right" />
				<Typography placeholder="" variant="h6">
					Working tags
				</Typography>
				<IconButton
					placeholder="reset"
					className="ml-auto bg-red-400 rounded-full w-8 h-8"
					onClick={handleResetFilter}
				>
					<GrPowerReset color="white" size={18} />
				</IconButton>
			</div>

			<Card placeholder="">
				<List placeholder="">
					{tags.map((tag: TagType) => (
						<ListItem className="p-0" placeholder="" key={tag.id}>
							<label
								htmlFor={`checkbox-tag-${tag.id}`}
								className="flex w-full cursor-pointer items-center px-3 py-2"
							>
								<ListItemPrefix className="mr-3" placeholder="">
									<Checkbox
										color="red"
										key={`checkbox-tag-${tag.id}`}
										id={`checkbox-tag-${tag.id}`}
										ripple={false}
										crossOrigin={'anonymous'}
										className="hover:before:opacity-0"
										checked={selectedTags.includes(tag.id.toString())}
										onChange={() => {
											handleCheckboxChange(tag.id.toString());
										}}
										containerProps={{
											className: 'p-0',
										}}
									/>
								</ListItemPrefix>
								<Typography color="blue-gray" className="font-medium" placeholder="">
									{tag.name}
								</Typography>
								<ListItemSuffix placeholder={'working-tags-list-item-suffix'}>
									<Chip
										value={tagCounts[tag.id.toString()] || '0'}
										variant="ghost"
										color={tag.color.split('-')[1] as any}
										size="sm"
										className="rounded-full"
									/>
								</ListItemSuffix>
							</label>
						</ListItem>
					))}
				</List>
			</Card>
		</div>
	);
}

class SideBar {
	public static profileMenu = ({ logoutFunction }: any) => {
		return (
			<Menu placement="bottom-start">
				<MenuHandler>
					<Avatar
						placeholder=""
						variant="circular"
						alt="tania andrew"
						className="cursor-pointer hover:border-2 hover:border-red-400"
						src="https://avatars.githubusercontent.com/u/66357924?v=4"
					/>
				</MenuHandler>
				<MenuList placeholder="">
					<MenuItem
						placeholder=""
						className="flex items-center gap-2 bg-white border-0 focus:bg-gray-200 outline-none focus:outline-none hover:outline-none active:outline-none"
					>
						<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M9.48999 1.17C9.10999 -0.39 6.88999 -0.39 6.50999 1.17C6.45326 1.40442 6.34198 1.62213 6.18522 1.80541C6.02845 1.9887 5.83063 2.13238 5.60784 2.22477C5.38505 2.31716 5.1436 2.35564 4.90313 2.33709C4.66266 2.31854 4.42997 2.24347 4.22399 2.118C2.85199 1.282 1.28199 2.852 2.11799 4.224C2.65799 5.11 2.17899 6.266 1.17099 6.511C-0.390006 6.89 -0.390006 9.111 1.17099 9.489C1.40547 9.54581 1.62322 9.65719 1.80651 9.81407C1.98979 9.97096 2.13343 10.1689 2.22573 10.3918C2.31803 10.6147 2.35639 10.8563 2.33766 11.0968C2.31894 11.3373 2.24367 11.5701 2.11799 11.776C1.28199 13.148 2.85199 14.718 4.22399 13.882C4.42993 13.7563 4.66265 13.6811 4.90318 13.6623C5.14371 13.6436 5.38527 13.682 5.60817 13.7743C5.83108 13.8666 6.02904 14.0102 6.18592 14.1935C6.34281 14.3768 6.45419 14.5945 6.51099 14.829C6.88999 16.39 9.11099 16.39 9.48899 14.829C9.54599 14.5946 9.65748 14.377 9.8144 14.1939C9.97132 14.0107 10.1692 13.8672 10.3921 13.7749C10.6149 13.6826 10.8564 13.6442 11.0969 13.6628C11.3373 13.6815 11.57 13.7565 11.776 13.882C13.148 14.718 14.718 13.148 13.882 11.776C13.7565 11.57 13.6815 11.3373 13.6628 11.0969C13.6442 10.8564 13.6826 10.6149 13.7749 10.3921C13.8672 10.1692 14.0107 9.97133 14.1939 9.81441C14.377 9.65749 14.5946 9.546 14.829 9.489C16.39 9.11 16.39 6.889 14.829 6.511C14.5945 6.45419 14.3768 6.34281 14.1935 6.18593C14.0102 6.02904 13.8666 5.83109 13.7743 5.60818C13.682 5.38527 13.6436 5.14372 13.6623 4.90318C13.681 4.66265 13.7563 4.42994 13.882 4.224C14.718 2.852 13.148 1.282 11.776 2.118C11.5701 2.24368 11.3373 2.31895 11.0968 2.33767C10.8563 2.35639 10.6147 2.31804 10.3918 2.22574C10.1689 2.13344 9.97095 1.9898 9.81407 1.80651C9.65718 1.62323 9.5458 1.40548 9.48899 1.171L9.48999 1.17ZM7.99999 11C8.79564 11 9.55871 10.6839 10.1213 10.1213C10.6839 9.55871 11 8.79565 11 8C11 7.20435 10.6839 6.44129 10.1213 5.87868C9.55871 5.31607 8.79564 5 7.99999 5C7.20434 5 6.44128 5.31607 5.87867 5.87868C5.31606 6.44129 4.99999 7.20435 4.99999 8C4.99999 8.79565 5.31606 9.55871 5.87867 10.1213C6.44128 10.6839 7.20434 11 7.99999 11Z"
								fill="#90A4AE"
							/>
						</svg>

						<Typography placeholder="" variant="small" className="font-medium">
							Edit Profile
						</Typography>
					</MenuItem>
					<hr className="my-2 border-blue-gray-50" />
					<MenuItem
						placeholder=""
						className="flex items-center gap-2 bg-white border-0 focus:bg-gray-200 outline-none focus:outline-none hover:outline-none active:outline-none"
						onClick={logoutFunction}
					>
						<svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M1 0C0.734784 0 0.48043 0.105357 0.292893 0.292893C0.105357 0.48043 0 0.734784 0 1V13C0 13.2652 0.105357 13.5196 0.292893 13.7071C0.48043 13.8946 0.734784 14 1 14C1.26522 14 1.51957 13.8946 1.70711 13.7071C1.89464 13.5196 2 13.2652 2 13V1C2 0.734784 1.89464 0.48043 1.70711 0.292893C1.51957 0.105357 1.26522 0 1 0ZM11.293 9.293C11.1108 9.4816 11.01 9.7342 11.0123 9.9964C11.0146 10.2586 11.1198 10.5094 11.3052 10.6948C11.4906 10.8802 11.7414 10.9854 12.0036 10.9877C12.2658 10.99 12.5184 10.8892 12.707 10.707L15.707 7.707C15.8945 7.51947 15.9998 7.26516 15.9998 7C15.9998 6.73484 15.8945 6.48053 15.707 6.293L12.707 3.293C12.6148 3.19749 12.5044 3.12131 12.3824 3.0689C12.2604 3.01649 12.1292 2.9889 11.9964 2.98775C11.8636 2.9866 11.7319 3.0119 11.609 3.06218C11.4861 3.11246 11.3745 3.18671 11.2806 3.2806C11.1867 3.3745 11.1125 3.48615 11.0622 3.60905C11.0119 3.73194 10.9866 3.86362 10.9877 3.9964C10.9889 4.12918 11.0165 4.2604 11.0689 4.3824C11.1213 4.50441 11.1975 4.61475 11.293 4.707L12.586 6H5C4.73478 6 4.48043 6.10536 4.29289 6.29289C4.10536 6.48043 4 6.73478 4 7C4 7.26522 4.10536 7.51957 4.29289 7.70711C4.48043 7.89464 4.73478 8 5 8H12.586L11.293 9.293Z"
								fill="#90A4AE"
							/>
						</svg>
						<Typography placeholder="" variant="small" className="font-medium">
							Sign Out
						</Typography>
					</MenuItem>
				</MenuList>
			</Menu>
		);
	};

	private static MenuItemList = ({ icon, currentPage, page, text, onClick }: any) => {
		return (
			<ListItem
				placeholder=""
				className={`
					${currentPage === page ? 'bg-red-400' : 'bg-white'}
					${
						currentPage === page
							? 'hover:bg-red-400 focus:bg-red-400 active:bg-red-400'
							: 'hover:bg-blue-gray-50 focus:bg-blue-gray-50 active:bg-blue-gray-50'
					}`}
				onClick={onClick}
				color="white"
			>
				<ListItemPrefix placeholder="" className="ml-2">
					{icon}
				</ListItemPrefix>
				<Typography placeholder="" variant="lead" className={`${currentPage === page ? 'text-white' : ''} `}>
					{text}
				</Typography>
			</ListItem>
		);
	};

	public static full = ({
		tags,
		username,
		handleButtonClick,
		handleButtonClickResetFilter,
		header,
		showWorkingTags,
		currentPage,
	}: BarProps) => {
		const navigate = useNavigate();

		const [isOpen, setOpen] = React.useState(false);
		return (
			<div className="flex flex-row">
				{/* Sidebar */}
				<div
					className={clsx('bg-gray-100 h-screen overflow-y-auto transition-all duration-200', {
						'w-80': isOpen, // Width when open
						'w-0': !isOpen, // Width when closed
					})}
				>
					<div className="w-full h-auto px-8 py-4 flex flex-row justify-between items-center">
						<div className="flex flex-row ">
							{/* ใช้เป็น username */}
							<this.profileMenu
								logoutFunction={() => {
									console.log('logout');
									localStorage.clear();
									navigate('/');
								}}
							/>

							<div className="text-headlines self-center px-4 font-bold text-xl">{username}</div>
						</div>

						<IconButton
							placeholder="ml-auto close-tab"
							className="bg-red-400 rounded-full"
							onClick={() => setOpen(!isOpen)}
						>
							<HiArrowCircleLeft size={24} />
						</IconButton>
					</div>
					{/* Sidebar content goes here */}
					<div className="w-80">
						<List placeholder="" className="px-8">
							<this.MenuItemList
								currentPage={currentPage}
								page="quest"
								text="Quest"
								onClick={() => navigate('/quest')}
								icon={
									<FaGamepad
										size={25}
										className={`${currentPage === 'quest' ? 'text-white' : ''} `}
									/>
								}
							/>
							<this.MenuItemList
								currentPage={currentPage}
								page="monster"
								text="Monster"
								onClick={() => navigate('/monster')}
								icon={
									<FaSpaghettiMonsterFlying
										size={25}
										className={`${currentPage === 'monster' ? 'text-white' : ''} `}
									/>
								}
							/>
							<this.MenuItemList
								currentPage={currentPage}
								text="Analysis"
								page="analysis"
								onClick={() => navigate('/analysis')}
								icon={
									<MdScience
										size={25}
										className={`${currentPage === 'analysis' ? 'text-white' : ''} `}
									/>
								}
							/>
							<this.MenuItemList
								currentPage={currentPage}
								text="Collection"
								page="collection"
								onClick={() => navigate('/collection')}
								icon={
									<MdOutlinePets
										size={25}
										className={`${currentPage === 'collection' ? 'text-white' : ''} `}
									/>
								}
							/>
						</List>
						<hr className="mt-5 mb-2" />
						{/* working tags zone start */}
						{showWorkingTags && tags.length > 0 && (
							<ListWithBadge
								// Where the tags length is greater than 0
								tags={tags}
								username={username}
								handleButtonClick={handleButtonClick}
								header={header}
								handleButtonClickResetFilter={handleButtonClickResetFilter}
								showWorkingTags={showWorkingTags}
							/>
						)}
						{/* working tags zone end */}
					</div>
				</div>

				{/* Main content */}
				<div className="flex-grow">
					{/* Replace this with your main content */}
					<div className="w-12 p-4 justify-start">
						<div className={clsx({ 'opacity-0': isOpen, 'opacity-100': !isOpen })}>
							<IconButton
								placeholder="open-tab"
								className="bg-red-400 rounded-full"
								onClick={() => setOpen(!isOpen)}
							>
								<HiArrowCircleRight size={24} />
							</IconButton>
						</div>
					</div>
				</div>
			</div>
		);
	};

	public static noWorkingTags = ({ username, header, currentPage }: any) => {
		return this.full({
			tags: [],
			username,
			handleButtonClick: () => {},
			header,
			handleButtonClickResetFilter: () => {},
			showWorkingTags: false,
			currentPage,
		});
	};

	public static speedDial = () => {
		const navigate = useNavigate();
		return (
			<div className="absolute top-0 left-0 z-10 m-4">
				<SpeedDial placement="right">
					<SpeedDialHandler>
						<IconButton placeholder={0} size="lg" className="rounded-full">
							<FaSpaghettiMonsterFlying
								className="h-5 w-5 transition-transform group-hover:rotate-45"
								size={25}
							/>
						</IconButton>
					</SpeedDialHandler>
					<SpeedDialContent placeholder={0} className="flex-row">
						<SpeedDialAction placeholder={0} onClick={() => navigate('/quest')}>
							<FaGamepad className="h-5 w-5" size={25} />
						</SpeedDialAction>
						<SpeedDialAction placeholder={0} onClick={() => navigate('/analysis')}>
							<MdScience className="h-5 w-5" size={25} />
						</SpeedDialAction>
						<SpeedDialAction placeholder={0} onClick={() => navigate('/collection')}>
							<MdOutlinePets className="h-5 w-5" size={25} />
						</SpeedDialAction>
					</SpeedDialContent>
				</SpeedDial>
			</div>
		);
	};
}

export default SideBar;
