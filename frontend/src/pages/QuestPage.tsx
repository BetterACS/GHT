import { useEffect, useState } from 'react';
import SideBar from '../components/SideBar';
import Quest from '../components/Quest';
// import Input from '../components/Input';
// import Modal from '../components/modals/ModalBase';
// import TagModal from '../components/TagModal';
// import TagDisplay from '../components/Tag';
// import Tag from '../components/Tag';
// import Button from '../components/Button';
// import DropDown from '../components/DropDown';
import QuestContainer from '../components/QuestContainer';
import { DNDType, TagType, Item } from '../utils/types';
// import { FaPlus } from 'react-icons/fa';
import { tagColorList } from '../utils/constants';
import { useNavigate } from 'react-router-dom';
// import { v4 as uuidv4 } from 'uuid';

import AddItemModal from '../components/modals/AddItemModal';
import EditItemModal from '../components/modals/EditItemModal';
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
import tokenAuth from '../utils/tokenAuth';
import axios from 'axios';
import { returnInterface } from '../../../backend/src/utils/interfaces';
import Config from '../../../backend/src/config';

export default function QuestPage() {
	const navigate = useNavigate();
	const [loaded, setLoaded] = useState(false);

	const [containers, setContainers] = useState<DNDType[]>([
		{
			id: `container-1`,
			title: 'Task',
			items: [],
		},
		{
			id: `container-2`,
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

	const updateAndResetItemState = (updatedContainers: DNDType[]) => {
		setContainers(updatedContainers);
		setItemName('');
		setItemDescription('');
		setShowAddItemModal(false);
		setShowEditItemModal(false);
	};
	const [error, setError] = useState('');
	//constant temp
	const [due_date, setDueDate] = useState('2022-01-01');
	const [item_id, setItemID] = useState(1);

	const email = localStorage.getItem('email') || '';
	const [tags, setTags] = useState<TagType[]>([]);

	useEffect(() => {
		tokenAuth(navigate, '/quest'); // Check if the user is logged in
		fetchData(); // Call the asynchronous function to fetch data
		fetchTag();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [email]); // Include 'email' in the dependency array if it's used inside the useEffect
	const fetchData = async () => {
		try {
			const results = await axios.get('http://localhost:5000/filter/tag', {
				params: {
					email: email,
				},
			});

			const result = results.data as returnInterface;

			if (result.return !== 0 || result.data === undefined) {
				// Handle error case
				console.log(result.data.error);
			}

			const promises = result.data.map(async (item: any) => {
				const id = 'item-' + item.quest_id;
				const currentContainer = item.status === 'Task' ? 'container-1' : 'container-2';

				for (const container of containers) {
					if (container.id === currentContainer) {
						const tagOfContainer: TagType[] = [];

						const query_tag = await axios.get('http://localhost:5000/contain-table', {
							params: {
								quest_id: item.quest_id,
							},
						});

						const result_tag = query_tag.data as returnInterface;

						await Promise.all(
							result_tag.data.map(async (tag: any) => {
								const tag_id = `tag-${tag.tag_id}`;
								const eachTag: TagType = {
									id: tag_id,
									name: tag.tag_name,
									color: tag.tag_color,
								};
								tagOfContainer.push(eachTag);
							})
						);

						container.items.push({
							id: id,
							title: item.quest_name,
							description: item.description,
							tags: tagOfContainer,
						});
						console.log(container);
					}
				}
			});

			// Wait for all promises to resolve
			await Promise.all(promises);

			// Once the Axios request is complete and data is processed, set loaded to true
			setLoaded(true);
		} catch (err) {
			console.log(err);
		}
	};

	const fetchTag = async () => {
		try {
			const allTags = await getAllTagsFromContainers();
			if (allTags.length > 0) {
				setTags(allTags);
			}
		} catch (error) {
			console.error('Error fetching tags:', error);
		}
	};
	const onAddItem = async (e: any) => {
		e.preventDefault();
		if (!itemName || !currentContainerId) return;

		const updatedContainers = await Promise.all(
			containers.map(async (container) => {
				if (container.id === currentContainerId) {
					console.log(container.id);

					const tempStatus = container.id === 'container-1' ? 'Task' : 'In Progress';
					try {
						const results = await axios.post(`http://localhost:${Config.BACKEND_PORT}/quest`, {
							quest_name: itemName,
							description: itemDescription,
							due_date: due_date,
							item_id: item_id,
							email: email,
							status: tempStatus,
						});

						const result = results.data as returnInterface;

						if (result.return !== 0 || result.data === undefined) {
							setError(result.data.error);
							console.log(error);
						} else {
							console.log(result.data);
							const id = 'item-' + result.data.quest_id;
							container.items.push({
								id: id,
								title: itemName,
								description: itemDescription,
								tags: [],
							});
						}
					} catch (err) {
						console.log(err);
					}
				}
				return container;
			})
		);
		updateAndResetItemState(updatedContainers);
	};

	const onDeleteItem = async (currentItemId: UniqueIdentifier, currentContainerId: UniqueIdentifier) => {
		const updatedContainers = await Promise.all(
			containers.map(async (container) => {
				if (container.id === currentContainerId) {
					const updatedItems = container.items.filter((item) => item.id !== currentItemId);

					container.items = updatedItems;

					const new_id = Number(currentItemId.toString().replace('item-', ''));

					try {
						const results = await axios.delete(`http://localhost:${Config.BACKEND_PORT}/quest`, {
							data: {
								quest_id: new_id,
							},
						});
						const result = results.data as returnInterface;
						if (result.return !== 0 || result.data === undefined) {
							setError(result.data.error);
							console.log(error);
						} else {
							console.log(result.data);
						}
					} catch (err) {
						console.log(err);
					}
				}
				return container;
			})
		);
		updateAndResetItemState(updatedContainers);
	};

	const onEditItem = async (e: any) => {
		if (!currentContainerId || !currentItemId || !itemName) return;

		const updatedContainers = await Promise.all(
			containers.map(async (container) => {
				if (container.id === currentContainerId) {
					const updatedItems = container.items.map(async (item) => {
						if (item.id === currentItemId) {
							item.title = itemName;
							item.description = itemDescription;
							const tempStatus = container.id === 'container-1' ? 'Task' : 'In Progress';
							const new_id = Number(currentItemId.toString().replace('item-', ''));
							console.log(new_id);
							try {
								const results = axios.put(`http://localhost:${Config.BACKEND_PORT}/quest`, {
									quest_id: new_id, //change
									quest_name: itemName,
									description: itemDescription,
									due_date: due_date,
									item_id: item_id,
									email: email,
									status: tempStatus,
								});

								const result = (await results).data as returnInterface;

								if (result.return !== 0 || result.data === undefined) {
									setError(result.data.error);
									console.log(error);
								} else {
									console.log(result.data);
								}
							} catch (err) {
								console.log(err);
							}
						}
						return item;
					});

					container.items = await Promise.all(updatedItems);
				}
				return container;
			})
		);
		updateAndResetItemState(updatedContainers);
	};
	// Get all tags from all database that same user
	async function getAllTagsFromContainers(): Promise<TagType[]> {
		const allTags: TagType[] = [];

		// containers.forEach((container) => {
		// 	container.items.forEach((item) => {
		// 		allTags.push(...item.tags);
		// 	});
		// });
		try {
			const result = await axios.get('http://localhost:5000/filter/tag', {
				params: {
					email: email,
				},
			});
			const results = result.data as returnInterface;
			console.log(results.data);
			results.data.map((item: any) => {
				const tag_id = `tag-${item.tag_id}`;
				const tag: TagType = {
					id: tag_id,
					name: item.tag_name,
					color: item.tag_color,
				};
				allTags.push(tag);
			});
		} catch (err) {
			console.error('Error fetching tags:', err);
		}

		return allTags;
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
	async function onAddTag(tagName: string) {
		// this function will create a tag and add to contain table
		const randomColor = tagColorList[Math.floor(Math.random() * tagColorList.length)];

		if (tags.find((tag) => tag.name === tagName)) {
			console.log('Tag already exists');
			return;
		}

		const results = await axios.post('http://localhost:5000/tag', {
			tag_name: tagName,
			tag_color: randomColor,
			email: email,
		});

		const result = results.data as returnInterface;
		const tag: TagType = {
			id: `tag-${result.data.tag_id}`,
			name: tagName,
			color: randomColor,
		};

		setPreviewTags([...previewTags, tag]);
		//add in frontend container
		const updatedContainers = containers.map(async (container) => {
			if (container.id === currentContainerId) {
				const updatedItems = await Promise.all(
					container.items.map(async (item) => {
						if (item.id === currentItemId) {
							item.tags.push(tag);
							//add in backend contain
							const addTagToContainer = await axios
								.post('http://localhost:5000/contain-table', {
									tag_id: result.data.tag_id,
									quest_id: item.id?.toString().replace('item-', ''),
								})
								.catch((err) => console.log(err));
						}
						return item;
					})
				);

				container.items = updatedItems;
			}
			return container;
		});

		await Promise.all(updatedContainers).then((resolvedContainers) => {
			setContainers(resolvedContainers);
		});
		fetchTag();

		// contain_id is the id of the label table in database
		//const contain_id = result_contain.data.contain_id;
	}
	// DND Handlers
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	const [dragObjectOnContainerID, setDragObjectOnContainerID] = useState<UniqueIdentifier>('');

	const handleDragStart = async (event: DragStartEvent) => {
		onDragStart(event, findValueOfQuest, setActiveId, setDragObjectOnContainerID);
	};

	const handleDragMove = (event: DragMoveEvent) => {
		onDragMove(event, findValueOfQuest, containers, setContainers);
	};

	const handleDragEnd = async (event: DragEndEvent) => {
		onDragEnd(event, findValueOfQuest, setContainers, setActiveId, containers);
		const AfterContainer = findValueOfQuest(event.active.id, 'item');
		if (typeof AfterContainer === 'undefined') {
			return;
		}
		if (dragObjectOnContainerID !== AfterContainer.id) {
			const new_id = Number(event.active.id.toString().replace('item-', ''));
			const tempStatus = AfterContainer.id === 'container-1' ? 'Task' : 'In Progress';
			try {
				const results = axios.put(`http://localhost:${Config.BACKEND_PORT}/quest`, {
					quest_id: new_id, //change
					quest_name: findItemTitle(event.active.id),
					description: findItemDescription(event.active.id),
					due_date: due_date,
					item_id: item_id,
					email: email,
					status: tempStatus,
				});
				const result = (await results).data as returnInterface;
				if (result.return !== 0 || result.data === undefined) {
					setError(result.data.error);
					console.log(error);
				} else {
					console.log(result.data);
				}
			} catch (err) {
				console.log(err);
			}
		}
	};

	return (
		<>
			<div className="flex flex-row">
				<SideBar />
				{/* Main Content */}
				<div className="w-full">
					<div className="mt-32 text-center text-2xl font-bold tracking-[.25em]">
						<h1>Quest</h1>
					</div>
					{/* Task */}
					<div className="flex">
						<div className="mx-auto w-full py-10">
							<AddItemModal.render
								showModal={showAddItemModal}
								setShowModal={setShowAddItemModal}
								setItemName={setItemName}
								setItemDescription={setItemDescription}
								itemName={itemName}
								itemDescription={itemDescription}
								onAddItem={onAddItem}
							/>
							<EditItemModal.render
								showModal={showEditItemModal}
								setShowModal={setShowEditItemModal}
								itemName={itemName}
								setItemName={setItemName}
								itemDescription={itemDescription}
								setItemDescription={setItemDescription}
								containers={containers}
								tags={tags}
								currentContainerId={currentContainerId}
								currentItemId={currentItemId}
								onEditItem={onEditItem}
							/>
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
																			onDeleteItem={() => {
																				onDeleteItem(i.id, container.id);
																			}}
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
													onDeleteItem={() => {
														onDeleteItem;
													}}
												/>
											)}
										</DragOverlay>
									</DndContext>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
