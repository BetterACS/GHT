import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { IoMdArrowDropdown } from 'react-icons/io';
import { TagType } from './Tag';
import { UniqueIdentifier } from '@dnd-kit/core';
import axios from 'axios';
import { DNDType } from '../utils/types';

function classNames(...classes: any) {
	return classes.filter(Boolean).join(' ');
}

interface DropDownProps {
	tags: TagType[];
	currentItemId?: UniqueIdentifier;
	containers: DNDType[];
	setContainers: any;
	currentContainerId: any;
}

const DropDown = ({ tags, currentItemId, containers, setContainers, currentContainerId }: DropDownProps) => {
	const handleTagClick = async (tagID: UniqueIdentifier, tagName: string, tagColor: string) => {
		const tag_id = tagID.toString().replace('tag-', '');
		const item_id = currentItemId?.toString().replace('item-', '');
		const tag: TagType = {
			id: tagID,
			name: tagName,
			color: tagColor,
		};

		//add in backend contain
		console.log('You clicked: ', tag_id, item_id);
		const updatedContainers = containers.map(async (container) => {
			if (container.id === currentContainerId) {
				const updatedItems = await Promise.all(
					container.items.map(async (item) => {
						if (item.id === currentItemId) {
							// Check if the tag with tagID already exists in item.tags
							if (item.tags.some((tag) => tag.id === tagID)) {
								console.log('Tag already exists');
							} else {
								// Tag does not exist, so add it to the item.tags array
								item.tags.push(tag);

								// Add the tag to the backend
								const addTagToContainer = await axios
									.post('http://localhost:5000/contain-table', {
										tag_id: tag_id,
										quest_id: item_id,
									})
									.catch((err) => console.log(err));
							}
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
	};
	return (
		<Menu as="div" className="relative inline-block text-left">
			<div>
				<Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
					{/* <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" /> */}
					<IoMdArrowDropdown size={20} />
				</Menu.Button>
			</div>

			<Transition
				as={Fragment}
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95"
			>
				<Menu.Items className="absolute right-0 z-10 mt-2 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
					<div className="py-1">
						{tags.map((tag) => (
							<Menu.Item key={tag.id}>
								{({ active }) => (
									<a
										href="#"
										className={classNames(
											active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
											'block px-4 py-2 text-sm'
										)}
										onClick={() => handleTagClick(tag.id, tag.name, tag.color)}
									>
										{tag.name}
									</a>
								)}
							</Menu.Item>
						))}
					</div>

					{/*
                    
                        This is unused code, but I'm keeping it here for reference.
                        Don't delete it.                        

                    */}
					{/* <div className="py-1">
						<Menu.Item>
							{({ active }) => (
								<a
									href="#"
									className={classNames(
										active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
										'block px-4 py-2 text-sm'
									)}
								>
									Edit
								</a>
							)}
						</Menu.Item>
						<Menu.Item>
							{({ active }) => (
								<a
									href="#"
									className={classNames(
										active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
										'block px-4 py-2 text-sm'
									)}
								>
									Duplicate
								</a>
							)}
						</Menu.Item>
					</div> */}
					{/* <div className="py-1">
						<Menu.Item>
							{({ active }) => (
								<a
									href="#"
									className={classNames(
										active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
										'block px-4 py-2 text-sm'
									)}
								>
									Archive
								</a>
							)}
						</Menu.Item>
						<Menu.Item>
							{({ active }) => (
								<a
									href="#"
									className={classNames(
										active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
										'block px-4 py-2 text-sm'
									)}
								>
									Move
								</a>
							)}
						</Menu.Item>
					</div>
					<div className="py-1">
						<Menu.Item>
							{({ active }) => (
								<a
									href="#"
									className={classNames(
										active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
										'block px-4 py-2 text-sm'
									)}
								>
									Share
								</a>
							)}
						</Menu.Item>
						<Menu.Item>
							{({ active }) => (
								<a
									href="#"
									className={classNames(
										active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
										'block px-4 py-2 text-sm'
									)}
								>
									Add to favorites
								</a>
							)}
						</Menu.Item>
					</div>
					<div className="py-1">
						<Menu.Item>
							{({ active }) => (
								<a
									href="#"
									className={classNames(
										active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
										'block px-4 py-2 text-sm'
									)}
								>
									Delete
								</a>
							)}
						</Menu.Item>
					</div> */}
				</Menu.Items>
			</Transition>
		</Menu>
	);
};
export default DropDown;
