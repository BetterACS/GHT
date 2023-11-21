import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import SideBar from '../components/SideBar';
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

export default function QuestPage() {
  const [containers, setContainers] = useState<DNDType[]>([
    {
      id: `container-${uuidv4()}`,
      title: 'Container 1',
      items: [
        {
          id: `item-${uuidv4()}`,
          title: 'Item 1',
        },
        {
          id: `item-${uuidv4()}`,
          title: 'Item 2',
        },
      ],
    },
    {
      id: `container-${uuidv4()}`,
      title: 'Container 2',
      items: [
        {
          id: `item-${uuidv4()}`,
          title: 'Item 3',
        },
        {
          id: `item-${uuidv4()}`,
          title: 'Item 4',
        },
      ],
    },
  ]);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [currentContainerId, setCurrentContainerId] = useState<UniqueIdentifier>();
  const [itemName, setItemName] = useState('');
  const [showAddItemModal, setShowAddItemModal] = useState(false);

  const onAddItem = () => {
    if (!itemName || !currentContainerId) return;

    const id = `item-${uuidv4()}`;
    const updatedContainers = containers.map((container) => {
      if (container.id === currentContainerId) {
        container.items.push({
          id,
          title: itemName,
        });
      }
      return container;
    });

    setContainers(updatedContainers);
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
              <Button onClick={onAddItem}>Add Item</Button>
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
                  <div className="flex-col"> {/* Added flex-col class */}
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
                  </div>
                </SortableContext>
                <DragOverlay adjustScale={false}>
                  {/* Drag Overlay For item Item */}
                  {activeId && activeId.toString().includes('item') && (
                    <Quest id={activeId} title={findItemTitle(activeId)} />
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
