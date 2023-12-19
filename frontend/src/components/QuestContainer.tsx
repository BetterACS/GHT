import React from 'react';
import clsx from 'clsx';
import { useSortable } from '@dnd-kit/sortable';
import { FaPlus } from 'react-icons/fa';
import { CSS } from '@dnd-kit/utilities';
// import Button from './Button';
import { Button, IconButton } from '@material-tailwind/react';
import { UniqueIdentifier } from '@dnd-kit/core';
import { Tooltip } from '@material-tailwind/react';

interface QuestContainerProps {
	id: UniqueIdentifier;
	children: React.ReactNode;
	title?: string;
	description?: string;
	onAddItem?: () => void;
}

const QuestContainer = ({ id, children, title, description, onAddItem }: QuestContainerProps) => {
	const { attributes, setNodeRef, listeners, transform, transition, isDragging } = useSortable({
		id: id,
		data: {
			type: 'container',
		},
	});
	return (
		<div
			{...attributes}
			ref={setNodeRef}
			style={{
				transition,
				transform: CSS.Translate.toString(transform),
			}}
			className={clsx(
				'w-full h-full p-4 bg-gray-50 rounded-xl flex flex-col gap-y-4 question-container',
				isDragging && 'opacity-50'
			)}
		>
			<div className="flex items-center justify-between">
				<div className="flex flex-col gap-y-1">
					<h1 className="text-gray-800 text-xl font-semibold">{title}</h1>
					<p className="text-gray-400 text-sm">{description}</p>
				</div>
				{/* <button className="border p-2 text-xs rounded-xl shadow-lg hover:shadow-xl">Drag Handle</button> */}

				{title === 'Done' ? (
					<></>
				) : (
					<Tooltip content="Adding new quest">
						<IconButton
							placeholder=""
							className="bg-gray-200 text-gray-900 shadow-none hover:shadow-none"
							variant="filled"
							onClick={onAddItem}
						>
							<FaPlus />
						</IconButton>
					</Tooltip>
				)}
			</div>

			{children}

			{title === 'Done' ? (
				<></>
			) : (
				<Tooltip content="Adding new quest">
					<Button
						placeholder=""
						className="bg-red-400 shadow-none hover:shadow-none"
						variant="filled"
						onClick={onAddItem}
					>
						<center>
							<FaPlus />
						</center>
					</Button>
				</Tooltip>
			)}
		</div>
	);
};

export default QuestContainer;
