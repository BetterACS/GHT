import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

import QuestContainer from '../components/QuestContainer';
import Button from '../components/Button';
import Modal from '../components/Modals';
import Quests from '../components/Quests';
import Input from '../components/Inputs';

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

export default function Home() {
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
