import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import SideBar from '../components/SideBar';
import Quest from '../components/Quest';
import Input from '../components/Input';
import Modal from '../components/Modal';
import TagModal from '../components/TagModal';
import Tag from '../components/Tag';
import Button from '../components/Button';
import DropDown from '../components/DropDown';
import QuestContainer from '../components/QuestContainer';
import { DNDType, TagType, Item } from '../utils/types';
import { FaPlus } from 'react-icons/fa';
import { tagColorList } from '../utils/constants';

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

export default function QuestPage() {
	const [containers, setContainers] = useState<DNDType[]>([
		{
			id: `container-${uuidv4()}`,
			title: 'Task',
			items: [],
		},
		{
			id: `container-${uuidv4()}`,
			title: 'In Progress',
			items: [],
		},
	]);
	const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
	const [currentContainerId, setCurrentContainerId] = useState<UniqueIdentifier>();
	const [currentItemId, setCurrentItemId] = useState<UniqueIdentifier>();
	const [itemName, setItemName] = useState('');
	const [itemDescription, setItemDescription] = useState('');

	// Tags
	const [tagName, setTagName] = useState('');
	const [previewTags, setPreviewTags] = useState<TagType[]>([]);

	// Modals
	const [showAddItemModal, setShowAddItemModal] = useState(false);
	const [showEditItemModal, setShowEditItemModal] = useState(false);
	const [showAddTagModal, setShowAddTagModal] = useState(false);

	const resetItemState = (updatedContainers: DNDType[]) => {
		setContainers(updatedContainers);
		setItemName('');
		setItemDescription('');
		setShowAddItemModal(false);
		setShowEditItemModal(false);
	};

	const onAddItem = () => {
		if (!itemName || !currentContainerId) return;

		const id = `item-${uuidv4()}`;
		const updatedContainers = containers.map((container) => {
			if (container.id === currentContainerId) {
				container.items.push({
					id,
					title: itemName,
					description: itemDescription,
					tags: [],
				});
			}
			return container;
		});

		resetItemState(updatedContainers);
	};

	const onEditItem = () => {
		if (!currentContainerId || !currentItemId || !itemName) return;

		const updatedContainers = containers.map((container) => {
			if (container.id === currentContainerId) {
				const updatedItems = container.items.map((item) => {
					if (item.id === currentItemId) {
						item.title = itemName;
						item.description = itemDescription;
					}
					return item;
				});

				container.items = updatedItems;
			}
			return container;
		});

		resetItemState(updatedContainers);
	};

	function getAllTagsFromContainers(): TagType[] {
		const allTags: TagType[] = [];

		containers.forEach((container) => {
			container.items.forEach((item) => {
				allTags.push(...item.tags);
			});
		});

		return allTags;
	}

	function onAddTag(tagName: string) {
		const tag: TagType = {
			id: `tag-${uuidv4()}`,
			name: tagName,
			color: tagColorList[Math.floor(Math.random() * tagColorList.length)],
		};

		if (getAllTagsFromContainers().find((tag) => tag.name === tagName)) {
			return;
		}
		setPreviewTags([...previewTags, tag]);

		const updatedContainers = containers.map((container) => {
			if (container.id === currentContainerId) {
				const updatedItems = container.items.map((item) => {
					if (item.id === currentItemId) {
						item.tags.push(tag);
					}
					return item;
				});

				container.items = updatedItems;
			}
			return container;
		});

		setContainers(updatedContainers);
	}

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

	const findItemDescription = (id: UniqueIdentifier | undefined) => {
		const container = findValueOfQuest(id, 'item');
		if (!container) return '';
		const item = container.items.find((item) => item.id === id);
		if (!item) return '';
		return item.description;
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
			<SideBar />
			{/* Main Content */}
			<div className="mt-32 text-center text-2xl font-bold tracking-[.25em]">
				<h1>Quest</h1>
			</div>
			<div className="flex">
				<div className="mx-auto w-full py-10">
					{/* Add Item Modal */}
					<Modal
						showModal={showAddItemModal}
						setShowModal={setShowAddItemModal}
						setItemName={setItemName}
						setItemDescription={setItemDescription}
					>
						<div className="flex flex-col w-full items-start gap-y-4">
							<h1 className="text-gray-800 text-3xl font-bold">Add Item</h1>
							<Input
								type="text"
								placeholder="Item Title"
								name="itemname"
								value={itemName}
								onChange={(e) => setItemName(e.target.value)}
							/>
							<Input
								type="text"
								placeholder="Item Description"
								name="itemDescription"
								value={itemDescription}
								onChange={(e) => setItemDescription(e.target.value)}
							/>
							<Button onClick={onAddItem}>Add Item</Button>
						</div>
					</Modal>

					{/* Edit Item Modal */}
					<Modal
						showModal={showEditItemModal}
						setShowModal={setShowEditItemModal}
						setItemName={setItemName}
						setItemDescription={setItemDescription}
					>
						<div className="overlay flex flex-col w-full items-start gap-y-4">
							<h1 className="text-gray-800 text-3xl font-bold">Edit Item</h1>
							<Input
								type="text"
								placeholder="Item Title"
								name="itemname"
								value={itemName}
								onChange={(e) => setItemName(e.target.value)}
							/>
							<Input
								type="text"
								placeholder="Item Description"
								name="itemDescription"
								value={itemDescription}
								onChange={(e) => setItemDescription(e.target.value)}
							/>
							<div className="flex flex-warp">
								{containers.map((container) => {
									if (container.id === currentContainerId) {
										return container.items.map((item) => {
											if (item.id === currentItemId) {
												return item.tags.map((tag) => {
													return (
														<Tag
															key={tag.id}
															id={tag.id}
															name={tag.name}
															color={tag.color}
														/>
													);
												});
											}
										});
									}
								})}
							</div>
							<div className="flex flex-warp">
								<Button
									onClick={() => {
										setShowAddTagModal(true);
									}}
								>
									<FaPlus />
								</Button>
								{
									// If there are no tags, don't show the dropdown
									getAllTagsFromContainers().length > 0 && (
										<DropDown tags={getAllTagsFromContainers()} />
									)
								}
							</div>

							<Button onClick={onEditItem}>Edit Item</Button>
						</div>
					</Modal>
					{/* Add Tag Modal */}
					<TagModal
						showModal={showAddTagModal}
						setShowModal={setShowAddTagModal}
						setPreviewTags={setPreviewTags}
						setTagName={setTagName}
						onAddTag={onAddTag}
						value={tagName}
					>
						<div className="flex flex-col w-full items-start gap-y-4">
							<Input
								type="text"
								placeholder="name"
								name="Tag name"
								value={tagName}
								onChange={(value) => {
									setTagName(value.target.value);
								}}
							/>

							{/* If previewTags is not empty, show the tags else show the text */}
							{previewTags.length > 0 ? (
								<div className="flex flex-row flex-wrap gap-2">
									{previewTags.map((tag) => (
										<Tag key={tag.id} id={tag.id} name={tag.name} color={tag.color} />
									))}
								</div>
							) : (
								<div className="text-gray-400">Press enter to add new tag</div>
							)}
						</div>
					</TagModal>
					<div className="mt-10 px-8">
						<div className="grid grid-cols-1 gap-6">
							<DndContext
								sensors={sensors}
								collisionDetection={closestCorners}
								onDragStart={handleDragStart}
								onDragMove={handleDragMove}
								onDragEnd={handleDragEnd}
							>
								<SortableContext items={containers.map((i) => i.id)}>
									<div className="flex">
										{containers.map((container) => (
											<div key={container.id} className="mr-4 w-full">
												{/* Added margin */}
												<QuestContainer
													id={container.id}
													title={container.title}
													onAddItem={() => {
														setShowAddItemModal(true);
														setCurrentContainerId(container.id);
													}}
												>
													<SortableContext items={container.items.map((i) => i.id)}>
														<div className="flex items-start flex-col gap-y-4">
															{container.items.map((i) => (
																<Quest
																	title={i.title}
																	description={i.description}
																	id={i.id}
																	key={i.id}
																	onEditItem={() => {
																		setItemName(i.title);
																		setItemDescription(i.description);
																		setCurrentContainerId(container.id);
																		setCurrentItemId(i.id);
																		setShowEditItemModal(true);
																	}}
																	tags={i.tags}
																/>
															))}
														</div>
													</SortableContext>
												</QuestContainer>
											</div>
										))}
									</div>
								</SortableContext>
								<DragOverlay adjustScale={false}>
									{/* Drag Overlay For item Item */}
									{activeId && activeId.toString().includes('item') && (
										<Quest
											id={activeId}
											title={findItemTitle(activeId)}
											description={findItemDescription(activeId)}
											onEditItem={() => {}}
											tags={[]}
										/>
									)}
								</DragOverlay>
							</DndContext>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
