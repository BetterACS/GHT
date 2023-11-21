import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Quest from '../components/Quest';
import Input from '../components/Input';
import Modal from '../components/Modal';
import Button from '../components/Button';
import QuestContainer from '../components/QuestContainer';
import { DNDType } from '../utils/types';
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
import { SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { onDragStart, onDragMove, onDragEnd } from '../utils/dragController';

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
	function findValueOfQuest(id: UniqueIdentifier | undefined, type: string) {
		if (type === 'container') {
			return containers.find((item) => item.id === id);
		}
		if (type === 'item') {
			return containers.find((container) => container.items.find((item) => item.id === id));
		}
	}

	const findItemTitle = (id: UniqueIdentifier | undefined) => {
		const container = findValueOfQuest(id, 'item');
		if (!container) return '';
		const item = container.items.find((item) => item.id === id);
		if (!item) return '';
		return item.title;
	};

	const findContainerTitle = (id: UniqueIdentifier | undefined) => {
		const container = findValueOfQuest(id, 'container');
		if (!container) return '';
		return container.title;
	};

	const findContainerQuest = (id: UniqueIdentifier | undefined) => {
		const container = findValueOfQuest(id, 'container');
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

	const handleDragStart = (event: DragStartEvent) => {
		onDragStart(event, setActiveId);
	};

	const handleDragMove = (event: DragMoveEvent) => {
		onDragMove(event, findValueOfQuest, containers, setContainers);
	};

	const handleDragEnd = (event: DragEndEvent) => {
		onDragEnd(event, findValueOfQuest, setContainers, setActiveId, containers);
	};

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
													<Quest title={i.title} id={i.id} key={i.id} />
												))}
											</div>
										</SortableContext>
									</QuestContainer>
								))}
							</SortableContext>
							<DragOverlay adjustScale={false}>
								{/* Drag Overlay For item Item */}
								{activeId && activeId.toString().includes('item') && (
									<Quest id={activeId} title={findItemTitle(activeId)} />
								)}
								{/* Drag Overlay For Container */}
								{activeId && activeId.toString().includes('container') && (
									<QuestContainer id={activeId} title={findContainerTitle(activeId)}>
										{findContainerQuest(activeId).map((i) => (
											<Quest key={i.id} title={i.title} id={i.id} />
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
