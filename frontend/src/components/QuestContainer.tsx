import { UniqueIdentifier } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import clsx from 'clsx';
import Button from './Button';

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
				'w-full h-full p-4 bg-gray-50 rounded-xl flex flex-col gap-y-4',
				isDragging && 'opacity-50'
			)}
		>
			<div className="flex items-center justify-between" {...listeners}>
				<div className="flex flex-col gap-y-1">
					<h1 className="text-gray-800 text-xl">{title}</h1>
					<p className="text-gray-400 text-sm">{description}</p>
				</div>
				{/* <button className="border p-2 text-xs rounded-xl shadow-lg hover:shadow-xl">Drag Handle</button> */}
			</div>

			{children}
			<Button variant="ghost" onClick={onAddItem}>
				Add Item
			</Button>
		</div>
	);
};

export default QuestContainer;
