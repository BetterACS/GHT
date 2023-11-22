import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import SideBar from '../components/SideBar';
import Quest from '../components/Quest';
import Input from '../components/Input';
import Modal from '../components/Modal';
import Button from '../components/Button';
import QuestContainer from '../components/QuestContainer';
import { DNDType } from '../utils/types';
import { useNavigate } from 'react-router-dom';
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

export default function QuestPage() {
	const navigate = useNavigate();
	const [loaded, setLoaded] = useState(false);
	

	const [containers, setContainers] = useState<DNDType[]>([
		{
			id: `container-1`,
			title: 'Task',
			items: [
			],
		},
		{
			id: `container-2`,
			title: 'In Progress',
			items: [
			],
		},
	]);
	const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
	const [currentContainerId, setCurrentContainerId] = useState<UniqueIdentifier>();
	const [currentItemId, setCurrentItemId] = useState<UniqueIdentifier>();
	const [itemName, setItemName] = useState('');
	const [itemDescription, setItemDescription] = useState('');
	const [showAddItemModal, setShowAddItemModal] = useState(false);
	const [showEditItemModal, setShowEditItemModal] = useState(false);
	const [error, setError] = useState('');
	//constant temp 
	const [due_date,setDueDate] = useState('2022-01-01');
	const [item_id,setItemID] = useState(1);
	
	const email = localStorage.getItem('email') || '';
	if (email === '') {
		localStorage.removeItem('access_token');
		localStorage.removeItem('refresh_token');
		navigate('/Log_in');
	}

	

	useEffect(() => {
		if (loaded) {
			return;
		}

		axios
		.get('http://localhost:5000/filterByDueDateASC', {
			params: {
				email: email,
			},
		})
		.then((results) => {
			const result = results.data as returnInterface;

			if (result.return !== 0 || result.data === undefined) {
				// Handle error case
				console.log(result.data.error);
			}
			result.data.map((item:any) => {
				const id = "item-"+item.quest_id;
				const currentContainer = item.status === 'Task' ? 'container-1' : 'container-2';
				containers.map((container) => {
					if (container.id === currentContainer) {
						container.items.push({
							id : id,
							title: item.quest_name,
							description: item.description,
						})
						console.log(container);
					}
				});
				
			})

		}).catch((err) => console.log(err));
		
		tokenAuth(navigate, '/quest');
		setLoaded(true);
	}, []);
		
		
	const onAddItem = async (e:any) => {
		e.preventDefault();
		if (!itemName || !currentContainerId) return;

		const updatedContainers = await Promise.all(
			containers.map(async (container) => {
			  if (container.id === currentContainerId) {
				console.log(container.id);
				
				const tempStatus = container.id === 'container-1' ? 'Task' : 'In Progress';
				try {
				  const results = await axios.post('http://localhost:5000/createQuest', {
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
					const id = "item-"+result.data.quest_id;
					container.items.push({
					  id : id,
					  title: itemName,
					  description: itemDescription,
					});
				  }
				} catch (err) {
				  console.log(err);
				}
			  }
			  return container;
			})
		  );
		setContainers(updatedContainers);
		setItemName('');
		setItemDescription('');
		setShowAddItemModal(false);
	};
	
	const onDeleteItem = async (currentItemId: UniqueIdentifier, currentContainerId: UniqueIdentifier) => {
		
		const updatedContainers = await Promise.all(
			containers.map(async (container) => {
				if (container.id === currentContainerId) {
					const updatedItems = container.items.filter(
						(item) => item.id !== currentItemId
					);

					container.items = updatedItems;

					const new_id = Number(currentItemId.toString().replace("item-", ""));

					try {
						const results = await axios.delete(
							'http://localhost:5000/deleteQuest',
							{
								data: {
									quest_id: new_id,
								},
							}
						);
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

		setContainers(updatedContainers);
		setItemName('');
		setItemDescription('');
		
	};
			
			
	const onEditItem = async (e:any) => {
		
		if (!currentContainerId || !currentItemId || !itemName) return;
	
		const updatedContainers = await Promise.all(containers.map(async (container) => {
		  if (container.id === currentContainerId) {
			const updatedItems = container.items.map(async (item) => {
			  if (item.id === currentItemId) {
				item.title = itemName;
				item.description = itemDescription;
				const tempStatus = container.id === 'container-1' ? 'Task' : 'In Progress';
				const new_id = Number(currentItemId.toString().replace("item-", ""));
				console.log(new_id);
				try {
					const results = axios.put('http://localhost:5000/adjustQuest', {
					  quest_id : new_id,//change 
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
			})
			
			container.items = await Promise.all(updatedItems);
		  }
		  return container;
		}));
	
		setContainers(updatedContainers);
		setItemName('');
		setItemDescription('');
		setShowEditItemModal(false);
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

	const [dragObjectOnContainerID, setDragObjectOnContainerID] = useState<UniqueIdentifier>("");

	const handleDragStart = async (event: DragStartEvent) => {
		onDragStart(event, findValueOfQuest,setActiveId,setDragObjectOnContainerID);
	};

	const handleDragMove = (event: DragMoveEvent) => {
		onDragMove(event, findValueOfQuest, containers, setContainers);
	};

	const handleDragEnd =async (event: DragEndEvent) => {
		onDragEnd(event, findValueOfQuest, setContainers, setActiveId, containers);
		const AfterContainer = findValueOfQuest(event.active.id, 'item');
		if (typeof AfterContainer === 'undefined'){
			return;
		}
		if (dragObjectOnContainerID!==AfterContainer.id){
			const new_id = Number(event.active.id.toString().replace("item-", ""));
			const tempStatus = AfterContainer.id === 'container-1' ? 'Task' : 'In Progress';
			try {
				const results = axios.put('http://localhost:5000/adjustQuest', {
				  quest_id : new_id,//change 
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
		  <SideBar />
		  {/* Main Content */}
		  <div className='mt-32 text-center text-2xl font-bold tracking-[.25em]'>
			<h1>Quest</h1>
		  </div>
		  <div className='flex'>
			<div className="mx-auto w-full py-10">
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
			  <Modal showModal={showEditItemModal} setShowModal={setShowEditItemModal}>
				<div className="flex flex-col w-full items-start gap-y-4">
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
				  <Button onClick={onEditItem}>Edit Item</Button>
				</div>
			  </Modal>
			  
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
						  <div key={container.id} className="mr-4 w-full"> {/* Added margin */}
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
									<Quest title={i.title} description={i.description} id={i.id} key={i.id} onEditItem={() => {
										setItemName(i.title);
										setItemDescription(i.description);
										setCurrentContainerId(container.id);
										setCurrentItemId(i.id);
										setShowEditItemModal(true);
									  }} onDeleteItem={()=>{onDeleteItem(i.id, container.id)}}/>
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
						<Quest id={activeId} title={findItemTitle(activeId)} description={findItemDescription(activeId)} onEditItem = {() => {}} onDeleteItem = {() => {onDeleteItem}}/>
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