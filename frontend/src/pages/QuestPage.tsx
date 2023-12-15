import { useEffect, useState } from 'react';
import SideBar from '../components/SideBar';
import Quest from '../components/Quest';
import QuestContainer from '../components/QuestContainer';
import { DNDType, TagType, Item } from '../utils/types';
import { tagColorList } from '../utils/constants';
import { useNavigate } from 'react-router-dom';
import { Progress } from "@material-tailwind/react";import authorization from '../utils/authorization';
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
	const initialContainers: DNDType[] = [
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
		{
		  id: `container-3`,
		  title: 'Done',
		  items: [],
		},
	  ];
	const [containers, setContainers] = useState<DNDType[]>(initialContainers);
	const resetContainers = () => {
		setContainers(initialContainers);
	  };  
	//temp
	let [conter, setConter] = useState(0);
	let [loaded, setLoaded] = useState(false);
	const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
	const [currentContainerId, setCurrentContainerId] = useState<UniqueIdentifier>();
	const [currentItemId, setCurrentItemId] = useState<UniqueIdentifier>();
	const [itemName, setItemName] = useState('');
	const [itemDescription, setItemDescription] = useState('');

	// Tags
	const [previewTags, setPreviewTags] = useState<TagType[]>([]);

	// Modals
	const [showAddItemModal, setShowAddItemModal] = useState(false);
	const [showEditItemModal, setShowEditItemModal] = useState(false);

	const updateAndResetItemState = (updatedContainers: DNDType[]) => {
		setContainers(updatedContainers);
		setItemName('');
		setItemDescription('');
		setShowAddItemModal(false);
		setShowEditItemModal(false);
	};
	const [error, setError] = useState('');
	const [filter, setFilter] = useState<string[]>([]);
	//constant temp
	const [due_date, setDueDate] = useState('2022-01-01');
	const [item_id, setItemID] = useState(1);
	//Tags
	const [tags, setTags] = useState<TagType[]>([]);
	// ดึงค่าจาก localStorage
	const email = localStorage.getItem('email') || '';
	const [accessToken, setAccessToken] = useState(localStorage.getItem('access_token'));
	const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refresh_token'));
	const updateAccessToken = async (newToken: string,newRefresh:string) => {
		await setAccessToken(newToken);
		await localStorage.setItem('access_token', newToken);
		await setRefreshToken(newRefresh);
		await localStorage.setItem('refresh_token', newRefresh);
		console.log('update access token',newToken);
	};
	const [username, setUsername] = useState('');
	// สร้าง headers
	let headers = {
		authorization: `Bearer ${localStorage.getItem('access_token')}`,
		refreshToken: `Bearer ${localStorage.getItem('refresh_token')}`,
		email: `${localStorage.getItem('email')}`,
	};
	useEffect(() => {
		 userQuery();
	  }, []);
	
	useEffect(() => {
		tokenAuth(navigate, '/quest');
		const fetchDataAndTags = async () => {
			headers = {
				authorization: `Bearer ${accessToken}`,
				refreshToken: `Bearer ${refreshToken}`,
				email: `${localStorage.getItem('email')}`
			};
			console.log("ทำ use Effect");
			if (filter.length > 0){
				await filterByTag();
			}else{
				await fetchData();} // Assuming fetchData is defined
			await fetchTag();
		};
		
		Promise.all([fetchDataAndTags()]);
		
	}, [accessToken,filter]); // Include 'email' in the dependency array if it's used inside the useEffect
	
	const fetchData = async () => {
		setConter(conter + 1);
		console.log("ทำ fetch Data ครั้งที่", conter);
		//get all quest from this email
		try {
			const results = await axios.get(`http://localhost:${Config.BACKEND_PORT}/filter/date`, {
				params: {
					email: email,
				},
				headers: headers
			});
	
			const result = results.data as returnInterface;
	
			authorization(result, async () => {
				const promises = result.data.map(async (item: any) => {
					const id = 'item-' + item.quest_id;
					const currentContainer =
						item.status === 'Task'
							? 'container-1'
							: item.status === 'In Progress'
								? 'container-2'
								: 'container-3';
	
					for (const container of containers) {
						if (container.id === currentContainer) {
							const tagOfContainer: TagType[] = [];
	
							const query_tag = await axios.get(`http://localhost:${Config.BACKEND_PORT}/contain-table`, {
								params: {
									quest_id: item.quest_id,
								},
								headers: headers
							});
	
							const result_tag = await query_tag.data as returnInterface;
							console.log(result_tag.return);
	
							authorization(result_tag, async () => {
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
	
								await Promise.all(
									container.items = container.items.concat({
										id: id,
										title: item.quest_name,
										description: item.description,
										image_url: item.image_url,
										tags: tagOfContainer,
									})
								);
	
								console.log(container);
	
								// Update the state to trigger re-render
								setContainers([...containers]);
							}, updateAccessToken);
						}
					}
				});
	
				await Promise.all(promises);
			},updateAccessToken);
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

					// const tempStatus = container.id === 'container-1' ? 'Task' : 'In Progress';
					try {
						const results = await axios.post(`http://localhost:${Config.BACKEND_PORT}/quest`, {
							quest_name: itemName,
							description: itemDescription,
							due_date: due_date,
							item_id: item_id,
							email: email,
							status: container.title,
							
						},{headers: headers});

						const result = results.data as returnInterface;
						authorization(result, async () => {
							console.log(result.data);
							const id = 'item-' + result.data.quest_id;
							container.items.push({
								id: id,
								image_url: 'https://i.imgur.com/ffuVcXN.png',
								title: itemName,
								description: itemDescription,
								tags: [],
							});}, updateAccessToken);
					} catch (err) {
						console.log(err);
					}
				}
				return container;
			})
		);
		updateAndResetItemState(updatedContainers);
	};
	const addFilter = (tag_id: string) =>{
		const cur = tag_id.toString().replace('tag-','')
		setFilter([...filter,cur])
		console.log(filter);
	}
	const filterByTag = async() => {
		if (loaded){
			return;
		}
		setLoaded(true);
		setContainers([
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
		{
		  id: `container-3`,
		  title: 'Done',
		  items: [],
		},
	  ]);
		try {
			const results = await axios.get(`http://localhost:${Config.BACKEND_PORT}/filter/tag`, {
				params: {
					tag_id: filter,
					email: email,
				},
				headers: headers
			});
	
			const result = results.data as returnInterface;
			console.log("Result filterByTag",result)
			authorization(result, async () => {
				const promises = result.data.map(async (item: any) => {
					const id = 'item-' + item.quest_id;
					const currentContainer =
						item.status === 'Task'
							? 'container-1'
							: item.status === 'In Progress'
								? 'container-2'
								: 'container-3';
					let newContainer = initialContainers;
					for (const container of newContainer) {
						if (container.id === currentContainer) {
							const tagOfContainer: TagType[] = [];
	
							const query_tag = await axios.get(`http://localhost:${Config.BACKEND_PORT}/contain-table`, {
								params: {
									quest_id: item.quest_id,
								},
								headers: headers
							});
	
							const result_tag = await query_tag.data as returnInterface;
							console.log(result_tag.return);
	
							authorization(result_tag, async () => {
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
	
								await Promise.all(
									container.items = container.items.concat({
										id: id,
										title: item.quest_name,
										description: item.description,
										image_url: item.image_url,
										tags: tagOfContainer,
									})
								);
	
								console.log(container);
							//ถ้ามีบัคค่อยมาดูตรงนี้
							}, updateAccessToken);
						}
					}
					setContainers(newContainer);
					setLoaded(false);
				});
	
				await Promise.all(promises);
			},updateAccessToken);
		} catch (err) {
			console.log(err);
		}
	}
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
							headers: headers,
						});
						const result = results.data as returnInterface;
						authorization(result, async () => {console.log(result.message)}, updateAccessToken);
						
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
							// const tempStatus = container.id === 'container-1' ? 'Task' : 'In Progress';
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
									status: container.title,
									
								},{headers: headers});

								const result = (await results).data as returnInterface;
								authorization(result, async () => {console.log(result.message)}, updateAccessToken);
			
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
		try {
			const results = await axios.get(`http://localhost:${Config.BACKEND_PORT}/tag/all`, {
				params: {
					email: email,
				},
				headers: headers,
			});
	
			const result = results.data as returnInterface;
	
			// Use a promise to wait for the authorization function
			const tags = await new Promise<TagType[]>((resolve, reject) => {
				authorization(result, (async () => {
					const tags = result.data.map((tag: any) => ({
						id: `tag-${tag.tag_id}`,
						name: tag.tag_name,
						color: tag.tag_color,
					}));
					resolve(tags);
				}), updateAccessToken, reject);
			});
	
			return tags;
		} catch (error) {
			// Handle errors here
			console.error(error);
			return [];
		}
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

	const findItemTags = (id: UniqueIdentifier | undefined) => {
		const container = findValueOfQuest(id, 'item');
		if (!container) return [];
		const item = container.items.find((item) => item.id === id);
		if (!item) return [];
		return item.tags;
	};

	const findItemDescription = (id: UniqueIdentifier | undefined) => {
		const container = findValueOfQuest(id, 'item');
		if (!container) return '';
		const item = container.items.find((item) => item.id === id);
		if (!item) return '';
		return item.description;
	};
	
	const userQuery = async () => {
		try {
			const results = await axios.get(`http://localhost:${Config.BACKEND_PORT}/user`, {
				params: {
					email: email,
				},
				headers: headers,
			});
			const result = results.data as returnInterface;
			authorization(result, async () => {
				setUsername(result.data[0].username);
			}, updateAccessToken);
		} catch (error) {
			console.error('Error to query user', error);
		}
	};

	async function onAddTag(tagName: string) {
		// this function will create a tag and add to contain table
		const randomColor = tagColorList[Math.floor(Math.random() * tagColorList.length)];

		if (tags.find((tag) => tag.name === tagName)) {
			console.log('Tag already exists');
			return;
		}

		const results = await axios.post(`http://localhost:${Config.BACKEND_PORT}/tag`, {
			tag_name: tagName,
			tag_color: randomColor,
			email: email,	
		},{headers: headers});

		const result = results.data as returnInterface;
		authorization(result, async () => {
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
								await updateTag(item, tag);
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
		}, updateAccessToken);
		

		// contain_id is the id of the label table in database
		//const contain_id = result_contain.data.contain_id;
	}

	const selectTag = async (item: Item, tag: TagType) => {
		setPreviewTags([...previewTags, tag]);
		await updateTag(item, tag);
		fetchTag();
	};

	const removeTag = async (item: Item, tag: TagType) => {
		try {
			const results = await axios.delete(`http://localhost:${Config.BACKEND_PORT}/contain-table`, {
				data: {
					tag_id: tag.id.toString().replace('tag-', ''),
					quest_id: item.id?.toString().replace('item-', ''),
				},
				headers: headers,
			});
			const result = results.data as returnInterface;
			authorization(result, async () => {
				item.tags = item.tags.filter((t) => t.id !== tag.id);
				setPreviewTags(previewTags.filter((t) => t.id !== tag.id));
			}, updateAccessToken);
		} catch (error) {
			console.error('Error deleting tag:', error);
		}
		fetchTag();
	};

	const updateTag = async (item: Item, tag: TagType) => {
		item.tags.push(tag);
		//add in backend contain
		const addTagToContainer = await axios
			.post(`http://localhost:${Config.BACKEND_PORT}/contain-table`, {
				tag_id: tag.id.toString().replace('tag-', ''),
				quest_id: item.id?.toString().replace('item-', ''),
				
			},{headers: headers})
			.catch((err) => console.log(err));
		
		
		if (addTagToContainer) {
			const result = addTagToContainer.data as returnInterface;
			authorization(result, async () => {
				console.log('contain reults ', addTagToContainer);
				fetchTag();
			}, updateAccessToken);
		}
	};
	
	const deleteTag = async (item: Item, tag: TagType) => {
		removeTag(item, tag);
		try {
			const results = await axios.delete(`http://localhost:${Config.BACKEND_PORT}/tag`, {
				data: {
					tag_id: tag.id.toString().replace('tag-', ''),
				},
				headers: headers,
			});
			const result = results.data as returnInterface;
			authorization(result, async () => {
				setTags(tags.filter((t) => t.id !== tag.id));
				setPreviewTags(previewTags.filter((t) => t.id !== tag.id));
				containers.map(async (container) => {
					container.items.map(async (item) => {
						item.tags = item.tags.filter((t) => t.id !== tag.id);
					});
				});
				fetchTag();
			}, updateAccessToken);
			

		} catch (error) {
			console.error('Error deleting tag:', error);
		}
		
	};

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
			// const tempStatus = AfterContainer.id === 'container-1' ? 'Task' : 'In Progress';
			try {
				const results = axios.put(`http://localhost:${Config.BACKEND_PORT}/quest`, {
					quest_id: new_id, //change
					quest_name: findItemTitle(event.active.id),
					description: findItemDescription(event.active.id),
					due_date: due_date,
					item_id: item_id,
					email: email,
					status: AfterContainer.title,
					
				},{headers: headers});
				const result = (await results).data as returnInterface;
				authorization(result, async () => {console.log(result.message)}, updateAccessToken);
				
			} catch (err) {
				console.log(err);
			}
		}
	};

	return (
		<>
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
				setTags={setTags}
				currentContainerId={currentContainerId}
				currentItemId={currentItemId}
				onEditItem={onEditItem}
				onAddTag={onAddTag}
				onSelectTag={selectTag}
				onRemoveTag={removeTag}
				onDeleteTag={deleteTag}
			/>

			<div className="flex flex-row">
				{/* Sidebar */}
				<SideBar tags={tags} username={username} handleButtonClick={addFilter} header={headers}/>
				{/* Main Content */}
				<div className="w-full flex flex-col items-center">
					<header className="flex flex-col gap-1 mt-8 mb-4 text-2l font-bold tracking-[.25em]">
						<h1>Quest</h1>
						<Progress value={52} color="red" />
					</header>
					<div className="w-8/12 px-2/4">
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
																	image_url={i.image_url}
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
											image_url=""
											id={activeId}
											title={findItemTitle(activeId)}
											description={findItemDescription(activeId)}
											onEditItem={() => {}}
											tags={findItemTags(activeId)}
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
		</>
	);
}
