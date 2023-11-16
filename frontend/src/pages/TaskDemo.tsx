import clsx from 'clsx';
import React from 'react';
import FocusTrap from 'focus-trap-react';
import { useCallback, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Dispatch, SetStateAction } from 'react';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowPointer, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

// DnD
import {
	DndContext,
	DragEndEvent,
	DragMoveEvent,
	DragOverlay,
	DragStartEvent,
	KeyboardSensor,
	PointerSensor,
	UniqueIdentifier,
	closestCorners,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';

type DNDType = {
	id: UniqueIdentifier;
	title: string;
	items: {
		id: UniqueIdentifier;
		title: string;
	}[];
};

interface QuestContainerProps {
	id: UniqueIdentifier;
	children: React.ReactNode;
	title?: string;
	description?: string;
	onAddItem?: () => void;
}
interface ModalProps {
	children: React.ReactNode;
	showModal: boolean;
	setShowModal: Dispatch<SetStateAction<boolean>>;
	containerClasses?: string;
}
interface InputProps {
	type: string;
	name: string;
	placeholder?: string;
	value?: string;
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
	asChild?: boolean;
}
type QuestType = {
	id: UniqueIdentifier;
	title: string;
};

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

const buttonVariants = cva(
	'flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
	{
		variants: {
			variant: {
				default: 'bg-gray-900 text-white hover:bg-gray-800',
				destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
				outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
				secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
				ghost: 'hover:bg-gray-100',
				link: 'text-primary underline-offset-4 hover:underline',
			},
			size: {
				default: 'h-10 px-4 py-2',
				sm: 'h-9 rounded-md px-3',
				lg: 'h-11 rounded-md px-8',
				icon: 'h-10 w-10',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	}
);

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : 'button';
		return <Comp className={clsx(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
	}
);
Button.displayName = 'Button';

const Input = ({ name, value, placeholder, onChange }: InputProps) => {
	return (
		<input
			name={name}
			value={value}
			placeholder={placeholder}
			onChange={onChange}
			className="border p-2 w-full rounded-lg shadow-lg hover:shadow-xl"
		></input>
	);
};

const Quests = ({ id, title }: QuestType) => {
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

function Modal({ children, showModal, setShowModal, containerClasses }: ModalProps) {
	const desktopModalRef = useRef(null);

	const onKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				setShowModal(false);
			}
		},
		[setShowModal]
	);

	useEffect(() => {
		document.addEventListener('keydown', onKeyDown);
		return () => document.removeEventListener('keydown', onKeyDown);
	}, [onKeyDown]);

	return (
		<AnimatePresence>
			{showModal && (
				<>
					<FocusTrap focusTrapOptions={{ initialFocus: false }}>
						<motion.div
							ref={desktopModalRef}
							key="desktop-modal"
							className="fixed inset-0 z-40 hidden min-h-screen items-center justify-center md:flex"
							initial={{ scale: 0.95, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.95, opacity: 0 }}
							onMouseDown={(e) => {
								if (desktopModalRef.current === e.target) {
									setShowModal(false);
								}
							}}
						>
							<div
								className={clsx(
									`overflow relative w-full max-w-lg transform rounded-xl border border-gray-200 bg-white p-6 text-left shadow-2xl transition-all`,
									containerClasses
								)}
							>
								{children}
							</div>
						</motion.div>
					</FocusTrap>
					<motion.div
						key="desktop-backdrop"
						className="fixed inset-0 z-30 bg-gray-100 bg-opacity-10 backdrop-blur overlay"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={() => setShowModal(false)}
					/>
				</>
			)}
		</AnimatePresence>
	);
}

export default function TaskDemo() {
	const [containers, setContainers] = useState<DNDType[]>([]);
	const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
	const [currentContainerId, setCurrentContainerId] = useState<UniqueIdentifier>();
	const [containerName, setContainerName] = useState('');
	const [itemName, setItemName] = useState('');
	const [showAddContainerModal, setShowAddContainerModal] = useState(false);
	const [showAddItemModal, setShowAddItemModal] = useState(false);

	const onAddContainer = () => {
		if (!containerName) return;
		const id = `container-${uuidv4()}`;
		setContainers([
			...containers,
			{
				id,
				title: containerName,
				items: [],
			},
		]);
		setContainerName('');
		setShowAddContainerModal(false);
	};

	const onAddItem = () => {
		if (!itemName) return;
		const id = `item-${uuidv4()}`;
		const container = containers.find((item) => item.id === currentContainerId);
		if (!container) return;
		container.items.push({
			id,
			title: itemName,
		});
		setContainers([...containers]);
		setItemName('');
		setShowAddItemModal(false);
	};

	// Find the value of the items
	function findValueOfQuests(id: UniqueIdentifier | undefined, type: string) {
		if (type === 'container') {
			return containers.find((item) => item.id === id);
		}
		if (type === 'item') {
			return containers.find((container) => container.items.find((item) => item.id === id));
		}
	}

	const findItemTitle = (id: UniqueIdentifier | undefined) => {
		const container = findValueOfQuests(id, 'item');
		if (!container) return '';
		const item = container.items.find((item) => item.id === id);
		if (!item) return '';
		return item.title;
	};

	const findContainerTitle = (id: UniqueIdentifier | undefined) => {
		const container = findValueOfQuests(id, 'container');
		if (!container) return '';
		return container.title;
	};

	const findContainerQuests = (id: UniqueIdentifier | undefined) => {
		const container = findValueOfQuests(id, 'container');
		if (!container) return [];
		return container.items;
	};

	// DND Handlers
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	function handleDragStart(event: DragStartEvent) {
		const { active } = event;
		const { id } = active;
		setActiveId(id);
	}

	const handleDragMove = (event: DragMoveEvent) => {
		const { active, over } = event;

		// Handle Quests Sorting
		if (
			active.id.toString().includes('item') &&
			over?.id.toString().includes('item') &&
			active &&
			over &&
			active.id !== over.id
		) {
			// Find the active container and over container
			const activeContainer = findValueOfQuests(active.id, 'item');
			const overContainer = findValueOfQuests(over.id, 'item');

			// If the active or over container is not found, return
			if (!activeContainer || !overContainer) return;

			// Find the index of the active and over container
			const activeContainerIndex = containers.findIndex((container) => container.id === activeContainer.id);
			const overContainerIndex = containers.findIndex((container) => container.id === overContainer.id);

			// Find the index of the active and over item
			const activeitemIndex = activeContainer.items.findIndex((item) => item.id === active.id);
			const overitemIndex = overContainer.items.findIndex((item) => item.id === over.id);
			// In the same container
			if (activeContainerIndex === overContainerIndex) {
				let newQuests = [...containers];
				newQuests[activeContainerIndex].items = arrayMove(
					newQuests[activeContainerIndex].items,
					activeitemIndex,
					overitemIndex
				);

				setContainers(newQuests);
			} else {
				// In different containers
				let newQuests = [...containers];
				const [removeditem] = newQuests[activeContainerIndex].items.splice(activeitemIndex, 1);
				newQuests[overContainerIndex].items.splice(overitemIndex, 0, removeditem);
				setContainers(newQuests);
			}
		}

		// Handling Item Drop Into a Container
		if (
			active.id.toString().includes('item') &&
			over?.id.toString().includes('container') &&
			active &&
			over &&
			active.id !== over.id
		) {
			// Find the active and over container
			const activeContainer = findValueOfQuests(active.id, 'item');
			const overContainer = findValueOfQuests(over.id, 'container');

			// If the active or over container is not found, return
			if (!activeContainer || !overContainer) return;

			// Find the index of the active and over container
			const activeContainerIndex = containers.findIndex((container) => container.id === activeContainer.id);
			const overContainerIndex = containers.findIndex((container) => container.id === overContainer.id);

			// Find the index of the active and over item
			const activeitemIndex = activeContainer.items.findIndex((item) => item.id === active.id);

			// Remove the active item from the active container and add it to the over container
			let newQuests = [...containers];
			const [removeditem] = newQuests[activeContainerIndex].items.splice(activeitemIndex, 1);
			newQuests[overContainerIndex].items.push(removeditem);
			setContainers(newQuests);
		}
	};

	// This is the function that handles the sorting of the containers and items when the user is done dragging.
	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;

		// Handling Container Sorting
		if (
			active.id.toString().includes('container') &&
			over?.id.toString().includes('container') &&
			active &&
			over &&
			active.id !== over.id
		) {
			// Find the index of the active and over container
			const activeContainerIndex = containers.findIndex((container) => container.id === active.id);
			const overContainerIndex = containers.findIndex((container) => container.id === over.id);
			// Swap the active and over container
			let newQuests = [...containers];
			newQuests = arrayMove(newQuests, activeContainerIndex, overContainerIndex);
			setContainers(newQuests);
		}

		// Handling item Sorting
		if (
			active.id.toString().includes('item') &&
			over?.id.toString().includes('item') &&
			active &&
			over &&
			active.id !== over.id
		) {
			// Find the active and over container
			const activeContainer = findValueOfQuests(active.id, 'item');
			const overContainer = findValueOfQuests(over.id, 'item');

			// If the active or over container is not found, return
			if (!activeContainer || !overContainer) return;
			// Find the index of the active and over container
			const activeContainerIndex = containers.findIndex((container) => container.id === activeContainer.id);
			const overContainerIndex = containers.findIndex((container) => container.id === overContainer.id);
			// Find the index of the active and over item
			const activeitemIndex = activeContainer.items.findIndex((item) => item.id === active.id);
			const overitemIndex = overContainer.items.findIndex((item) => item.id === over.id);

			// In the same container
			if (activeContainerIndex === overContainerIndex) {
				let newQuests = [...containers];
				newQuests[activeContainerIndex].items = arrayMove(
					newQuests[activeContainerIndex].items,
					activeitemIndex,
					overitemIndex
				);
				setContainers(newQuests);
			} else {
				// In different containers
				let newQuests = [...containers];
				const [removeditem] = newQuests[activeContainerIndex].items.splice(activeitemIndex, 1);
				newQuests[overContainerIndex].items.splice(overitemIndex, 0, removeditem);
				setContainers(newQuests);
			}
		}
		// Handling item dropping into Container
		if (
			active.id.toString().includes('item') &&
			over?.id.toString().includes('container') &&
			active &&
			over &&
			active.id !== over.id
		) {
			// Find the active and over container
			const activeContainer = findValueOfQuests(active.id, 'item');
			const overContainer = findValueOfQuests(over.id, 'container');

			// If the active or over container is not found, return
			if (!activeContainer || !overContainer) return;
			// Find the index of the active and over container
			const activeContainerIndex = containers.findIndex((container) => container.id === activeContainer.id);
			const overContainerIndex = containers.findIndex((container) => container.id === overContainer.id);
			// Find the index of the active and over item
			const activeitemIndex = activeContainer.items.findIndex((item) => item.id === active.id);

			let newQuests = [...containers];
			const [removeditem] = newQuests[activeContainerIndex].items.splice(activeitemIndex, 1);
			newQuests[overContainerIndex].items.push(removeditem);
			setContainers(newQuests);
		}
		setActiveId(null);
	}

	return (
		<>
			<div className="mx-auto max-w-7xl py-10">
				{/* Add Container Modal */}
				<Modal showModal={showAddContainerModal} setShowModal={setShowAddContainerModal}>
					<div className="flex flex-col w-full items-start gap-y-4">
						<h1 className="text-gray-800 text-3xl font-bold">Add Container</h1>
						<Input
							type="text"
							placeholder="Container Title"
							name="containername"
							value={containerName}
							onChange={(e) => setContainerName(e.target.value)}
						/>
						<Button onClick={onAddContainer}>Add container</Button>
					</div>
				</Modal>
				{/* Add Item Modal */}
				<Modal showModal={showAddItemModal} setShowModal={setShowAddItemModal}>
					<div className="flex flex-col w-full items-start gap-y-4">
						<h1 className="text-gray-800 text-3xl font-bold">Add Item</h1>
						<Input
							type="text"
							placeholder="Item Title"
							name="itemname"
							value={itemName}
							onChange={(e) => setItemName(e.target.value)}
						/>
						<Button onClick={onAddItem}>Add Item</Button>
					</div>
				</Modal>
				<div className="flex items-center justify-between gap-y-2">
					<h1 className="text-gray-800 text-3xl font-bold">Dnd-kit Guide</h1>
					<Button onClick={() => setShowAddContainerModal(true)}>Add Container</Button>
				</div>
				<div className="mt-10">
					<div className="grid grid-cols-3 gap-6">
						<DndContext
							sensors={sensors}
							collisionDetection={closestCorners}
							onDragStart={handleDragStart}
							onDragMove={handleDragMove}
							onDragEnd={handleDragEnd}
						>
							<SortableContext items={containers.map((i) => i.id)}>
								{containers.map((container) => (
									<QuestContainer
										id={container.id}
										title={container.title}
										key={container.id}
										onAddItem={() => {
											setShowAddItemModal(true);
											setCurrentContainerId(container.id);
										}}
									>
										<SortableContext items={container.items.map((i) => i.id)}>
											<div className="flex items-start flex-col gap-y-4">
												{container.items.map((i) => (
													<Quests title={i.title} id={i.id} key={i.id} />
												))}
											</div>
										</SortableContext>
									</QuestContainer>
								))}
							</SortableContext>
							<DragOverlay adjustScale={false}>
								{/* Drag Overlay For item Item */}
								{activeId && activeId.toString().includes('item') && (
									<Quests id={activeId} title={findItemTitle(activeId)} />
								)}
								{/* Drag Overlay For Container */}
								{activeId && activeId.toString().includes('container') && (
									<QuestContainer id={activeId} title={findContainerTitle(activeId)}>
										{findContainerQuests(activeId).map((i) => (
											<Quests key={i.id} title={i.title} id={i.id} />
										))}
									</QuestContainer>
								)}
							</DragOverlay>
						</DndContext>
					</div>
				</div>
			</div>
		</>
	);
}
