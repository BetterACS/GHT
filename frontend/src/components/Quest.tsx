import clsx from 'clsx';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faArrowPointer, faTrash } from '@fortawesome/free-solid-svg-icons';
import { UniqueIdentifier } from '@dnd-kit/core';
import Tag, { TagType } from './Tag';
import { useState } from 'react';

type QuestType = {
	id: UniqueIdentifier;
	title: string;
	description: string;
	tags: TagType[];
	image_url: string;
	onEditItem: () => void;
	onDeleteItem: () => void;
};

const Quest = ({ id, title, description, tags, image_url, onEditItem, onDeleteItem }: QuestType) => {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: id,
		data: {
			type: 'item',
		},
	});
	const [isHovered, setIsHovered] = useState(false);

	return (
		<div
			className="w-full h-full relative"
			onMouseEnter={() => {
				setIsHovered(true);
			}}
			onMouseLeave={() => {
				setIsHovered(false);
			}}
		>
			<div className="flex flex-row absolute right-0 m-2">
				<button
					className={`mx-1 border text-xs rounded-xl shadow-lg hover:shadow-xl px-50 ${
						isHovered ? 'opacity-100 visible' : 'opacity-0 invisible'
					}`}
					onClick={onEditItem}
				>
					<FontAwesomeIcon icon={faPenToSquare} size="lg" />
				</button>
				<button
					className={`mx-1 border text-xs rounded-xl shadow-lg hover:shadow-xl px-50 ${
						isHovered ? 'opacity-100 visible' : 'opacity-0 invisible'
					}`}
					onClick={onDeleteItem}
				>
					<FontAwesomeIcon icon={faTrash} size="lg" />
				</button>
			</div>
			<div
				ref={setNodeRef}
				{...attributes}
				{...listeners}
				style={{
					transition,
					transform: CSS.Translate.toString(transform),
				}}
				className={clsx(
					'px-2 py-2 bg-white shadow-md rounded-xl w-full h-full border border-transparent hover:border-gray-200 cursor-pointer',
					isDragging && 'opacity-50'
				)}
			>
				{/* <img className="mx-2 w-1/12 h-1/12" src={image_url} alt="item" /> */}
				<div className="mx-2 h-full pb-1">
					<div className="flex gap-2 pb-1">
						{tags.map((tag) => (
							<Tag key={tag.id} id={tag.id} name={tag.name} color={tag.color} />
						))}
					</div>
					<div>{title}</div>
					<div className="text-xs">{description}</div>
				</div>
			</div>
		</div>
	);
};

export default Quest;
