import clsx from 'clsx';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faArrowPointer, faTrash } from '@fortawesome/free-solid-svg-icons';
import { BsCalendar2Date } from 'react-icons/bs';
import { UniqueIdentifier } from '@dnd-kit/core';
import { TagType } from '../utils/types';
import TagDisplay from './Tag';
import { useState } from 'react';
import { Tooltip, Typography } from '@material-tailwind/react';

type QuestType = {
	id: UniqueIdentifier;
	title: string;
	description: string;
	tags: TagType[];
	image_url: string;
	onEditItem: () => void;
	onDeleteItem: () => void;
	due_date: string;
	item_name: string;
	item_description: string;
};

const Quest = ({
	id,
	title,
	description,
	tags,
	image_url,
	onEditItem,
	onDeleteItem,
	due_date,
	item_name,
	item_description,
}: QuestType) => {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: id,
		data: {
			type: 'item',
		},
	});
	const [isHovered, setIsHovered] = useState(false);

	return (
		<div
			className="w-full relative"
			onMouseEnter={() => {
				setIsHovered(true);
			}}
			onMouseLeave={() => {
				setIsHovered(false);
			}}
		>
			{isHovered && (
				<div className="flex flex-row absolute right-0 m-2">
					<button
						className="mx-1 border text-xs rounded-xl shadow-lg hover:shadow-xl px-25"
						onClick={onEditItem}
					>
						<FontAwesomeIcon icon={faPenToSquare} size="lg" />
					</button>

					<button
						className="mx-1 border text-xs rounded-xl shadow-lg hover:shadow-xl px-25"
						onClick={onDeleteItem}
					>
						<FontAwesomeIcon icon={faTrash} size="lg" />
					</button>
				</div>
			)}
			<div
				ref={setNodeRef}
				{...attributes}
				{...listeners}
				style={{
					transition,
					transform: CSS.Translate.toString(transform),
				}}
				className={clsx(
					'px-2 py-2 bg-white shadow-md rounded-xl w-full h-full border border-transparent hover:bg-gray-100 hover:border-gray-200 cursor-pointer',
					isDragging && 'opacity-50'
				)}
			>
				{/* <img className="mx-2 w-1/12 h-1/12" src={image_url} alt="item" /> */}
				<div className="mx-2 h-full pb-1">
					<div className="flex flex-wrap">
						{tags.map((tag) => (
							<TagDisplay.previewTag key={tag.id} tag={tag} />
						))}
					</div>
					<div className="min-w-0">
						<div className="break-all min-w-0 pt-2">
							<div className="text-lg">{title}</div>
							<div className="text-xs">{description}</div>
						</div>
					</div>

					<div className="flex flex-row pt-1">
						<div className="ml-auto pt-1 flex flex-row">
							<BsCalendar2Date size="24" />
							{/*need to edit  */}
							<span className="text-sm pt-1 px-2"> {due_date} </span>
						</div>
						<Tooltip
							content={
								<div className="w-96 flex flex-row m-2">
									<img
										className="h-16 rounded-lg"
										referrerPolicy="no-referrer"
										// need to edit
										src={image_url}
										alt="item"
									/>
									<div className="pl-2">
										<Typography
											placeholder={'working-tags-list-item'}
											color="white"
											className="font-medium"
										>
											{/* need to edit */}
											{item_name}
										</Typography>
										<Typography
											placeholder={'working-tags-list-item'}
											variant="small"
											color="white"
											className="font-normal opacity-80"
										>
											{/*  need to edit*/}
											{item_description}
										</Typography>
									</div>
								</div>
							}
							animate={{
								mount: { scale: 1, y: 0 },
								unmount: { scale: 0, y: 25 },
							}}
						>
							{/* need to edit */}
							<img className="h-8 rounded-full" referrerPolicy="no-referrer" src={image_url} alt="item" />
						</Tooltip>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Quest;
