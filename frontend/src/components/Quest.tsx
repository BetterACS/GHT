import clsx from 'clsx';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faArrowPointer } from '@fortawesome/free-solid-svg-icons';
import { UniqueIdentifier } from '@dnd-kit/core';

type QuestType = {
	id: UniqueIdentifier;
	title: string;
};

const Quest = ({ id, title }: QuestType) => {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: id,
		data: {
			type: 'item',
		},
	});
	const editButtonClick = () => {
		console.log('Quest clicked:', title); // Add your desired click effect here
		// You can perform any action you want when the Quest is clicked
	};
	return (
		<div
			ref={setNodeRef}
			{...attributes}
			style={{
				transition,
				transform: CSS.Translate.toString(transform),
			}}
			className={clsx(
				'px-2 py-4 bg-white shadow-md rounded-xl w-full border border-transparent hover:border-gray-200 cursor-pointer',
				isDragging && 'opacity-50'
			)}
		>
			<div className="flex items-center justify-between ">
				<div>{title}</div>
				<div>
					<button
						className="border text-xs rounded-xl shadow-lg hover:shadow-xl px-50"
						onClick={editButtonClick}
					>
						<FontAwesomeIcon icon={faPenToSquare} size="lg" />
					</button>
					<button className="border text-xs rounded-xl shadow-lg hover:shadow-xl px-50" {...listeners}>
						<FontAwesomeIcon icon={faArrowPointer} size="lg" />
					</button>
				</div>
			</div>
		</div>
	);
};

export default Quest;
