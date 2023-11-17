import { DragEndEvent, DragMoveEvent, DragStartEvent, UniqueIdentifier } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { DNDType } from './types';

function onDragStart(
	event: DragStartEvent,
	setActiveId: React.Dispatch<React.SetStateAction<UniqueIdentifier | null>>
) {
	const { active } = event;
	const { id } = active;
	setActiveId(id);
}

const onDragMove = (
	event: DragMoveEvent,
	findValueOfQuest: Function,
	containers: DNDType[],
	setContainers: React.Dispatch<React.SetStateAction<DNDType[]>>
) => {
	const { active, over } = event;

	// Handle Quest Sorting
	if (
		active.id.toString().includes('item') &&
		over?.id.toString().includes('item') &&
		active &&
		over &&
		active.id !== over.id
	) {
		// Find the active container and over container
		const activeContainer = findValueOfQuest(active.id, 'item');
		const overContainer = findValueOfQuest(over.id, 'item');

		// If the active or over container is not found, return
		if (!activeContainer || !overContainer) return;

		// Find the index of the active and over container
		const activeContainerIndex = containers.findIndex((container) => container.id === activeContainer.id);
		const overContainerIndex = containers.findIndex((container) => container.id === overContainer.id);

		// Find the index of the active and over item
		const activeitemIndex = activeContainer.items.findIndex((item: any) => item.id === active.id);
		const overitemIndex = overContainer.items.findIndex((item: any) => item.id === over.id);
		// In the same container
		if (activeContainerIndex === overContainerIndex) {
			let newQuest = [...containers];
			newQuest[activeContainerIndex].items = arrayMove(
				newQuest[activeContainerIndex].items,
				activeitemIndex,
				overitemIndex
			);

			setContainers(newQuest);
		} else {
			// In different containers
			let newQuest = [...containers];
			const [removeditem] = newQuest[activeContainerIndex].items.splice(activeitemIndex, 1);
			newQuest[overContainerIndex].items.splice(overitemIndex, 0, removeditem);
			setContainers(newQuest);
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
		const activeContainer = findValueOfQuest(active.id, 'item');
		const overContainer = findValueOfQuest(over.id, 'container');

		// If the active or over container is not found, return
		if (!activeContainer || !overContainer) return;

		// Find the index of the active and over container
		const activeContainerIndex = containers.findIndex((container) => container.id === activeContainer.id);
		const overContainerIndex = containers.findIndex((container) => container.id === overContainer.id);

		// Find the index of the active and over item
		const activeitemIndex = activeContainer.items.findIndex((item: any) => item.id === active.id);

		// Remove the active item from the active container and add it to the over container
		let newQuest = [...containers];
		const [removeditem] = newQuest[activeContainerIndex].items.splice(activeitemIndex, 1);
		newQuest[overContainerIndex].items.push(removeditem);
		setContainers(newQuest);
	}
};

// This is the function that handles the sorting of the containers and items when the user is done dragging.
function onDragEnd(
	event: DragEndEvent,
	findValueOfQuest: Function,
	setContainers: React.Dispatch<React.SetStateAction<DNDType[]>>,
	setActiveId: React.Dispatch<React.SetStateAction<UniqueIdentifier | null>>,
	containers: DNDType[]
) {
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
		let newQuest = [...containers];
		newQuest = arrayMove(newQuest, activeContainerIndex, overContainerIndex);
		setContainers(newQuest);
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
		const activeContainer = findValueOfQuest(active.id, 'item');
		const overContainer = findValueOfQuest(over.id, 'item');

		// If the active or over container is not found, return
		if (!activeContainer || !overContainer) return;
		// Find the index of the active and over container
		const activeContainerIndex = containers.findIndex((container) => container.id === activeContainer.id);
		const overContainerIndex = containers.findIndex((container) => container.id === overContainer.id);
		// Find the index of the active and over item
		const activeitemIndex = activeContainer.items.findIndex((item: any) => item.id === active.id);
		const overitemIndex = overContainer.items.findIndex((item: any) => item.id === over.id);

		// In the same container
		if (activeContainerIndex === overContainerIndex) {
			let newQuest = [...containers];
			newQuest[activeContainerIndex].items = arrayMove(
				newQuest[activeContainerIndex].items,
				activeitemIndex,
				overitemIndex
			);
			setContainers(newQuest);
		} else {
			// In different containers
			let newQuest = [...containers];
			const [removeditem] = newQuest[activeContainerIndex].items.splice(activeitemIndex, 1);
			newQuest[overContainerIndex].items.splice(overitemIndex, 0, removeditem);
			setContainers(newQuest);
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
		const activeContainer = findValueOfQuest(active.id, 'item');
		const overContainer = findValueOfQuest(over.id, 'container');

		// If the active or over container is not found, return
		if (!activeContainer || !overContainer) return;
		// Find the index of the active and over container
		const activeContainerIndex = containers.findIndex((container) => container.id === activeContainer.id);
		const overContainerIndex = containers.findIndex((container) => container.id === overContainer.id);
		// Find the index of the active and over item
		const activeitemIndex = activeContainer.items.findIndex((item: any) => item.id === active.id);

		let newQuest = [...containers];
		const [removeditem] = newQuest[activeContainerIndex].items.splice(activeitemIndex, 1);
		newQuest[overContainerIndex].items.push(removeditem);
		setContainers(newQuest);
	}
	setActiveId(null);
}

export { onDragStart, onDragMove, onDragEnd };
