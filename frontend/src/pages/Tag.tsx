import '../styles/Tag.scss';
import React from 'react';

import Tag from '../components/Tag';
import { TagType } from '../utils/types';
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { UniqueIdentifier } from '@dnd-kit/core';
function classNames(...classes: any) {
	return classes.filter(Boolean).join(' ');
}

interface TagsInputProps {
	tags: TagType[];
	currentTags: TagType[];
	setCurrentTags: React.Dispatch<React.SetStateAction<TagType[]>>;
	onAddTag: (tagName: string) => void;
	onRemoveTag: (tagId: UniqueIdentifier) => void;
	onSelectTag: (tag: TagType) => void;
}

const TagsInput = ({ tags, currentTags, onRemoveTag, onAddTag, onSelectTag }: TagsInputProps) => {
	const [placeholder, setPlaceholder] = React.useState('Add / Edit');
	const [menuVisible, setMenuVisible] = React.useState(false);

	const getNoneSelectedTags = () => {
		// Get all tags that are not selected (id)
		return tags.filter((tag: TagType) => !currentTags.find((currentTag: TagType) => currentTag.id === tag.id));
	};

	const addTags = (event: any) => {
		if (event.target.value !== '') {
			if (tags.find((tag: TagType) => tag.name === event.target.value)) {
				return;
			}
			onAddTag(event.target.value);
			event.target.value = '';
		}
	};
	return (
		<div>
			<div className="tags-input">
				<ul id="tags">
					{currentTags.map((tag: TagType) => (
						<Tag key={tag.id} tag={tag} onRemoveTag={onRemoveTag} />
					))}
					<input
						type="text"
						onKeyUp={(event) => (event.key === 'Enter' ? addTags(event) : null)}
						placeholder={placeholder}
						onFocus={() => {
							setPlaceholder('Press enter to add tag');
							if (getNoneSelectedTags().length > 0) {
								setMenuVisible(true);
							}
						}}
						onBlur={() => {
							setPlaceholder('Add / Edit');
							setMenuVisible(false);
						}}
					/>
				</ul>
			</div>
			<Menu>
				<Transition
					as={Fragment}
					show={menuVisible}
					enter="transition ease-out duration-100"
					enterFrom="transform opacity-0 scale-95"
					enterTo="transform opacity-100 scale-100"
					leave="transition ease-in duration-75"
					leaveFrom="transform opacity-100 scale-100"
					leaveTo="transform opacity-0 scale-95"
				>
					<Menu.Items className="absolute z-10 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
						<div className="py-1 drop-down-tag">
							{getNoneSelectedTags().map((tag: TagType) => (
								<Menu.Item key={tag.id}>
									{({ active }) => (
										<div
											className={classNames(
												active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
												'block px-4 py-2 text-sm'
											)}
											onClick={() => onSelectTag(tag)}
										>
											{tag.name}
										</div>
									)}
								</Menu.Item>
							))}
						</div>
					</Menu.Items>
				</Transition>
			</Menu>
		</div>
	);
};

const initTags: TagType[] = [
	{
		id: 1,
		name: 'Nodejs',
		color: 'bg-red-400',
	},
	{
		id: 2,
		name: 'MongoDB',
		color: 'bg-blue-400',
	},
	{
		id: 3,
		name: 'React',
		color: 'bg-green-400',
	},
];

const App = () => {
	const [tags, setTags] = React.useState<TagType[]>(initTags);
	const [currentTags, setCurrentTags] = React.useState<TagType[]>([
		{
			id: 3,
			name: 'React',
			color: 'bg-green-400',
		},
	]);
	const onAddTag = (tagName: string) => {
		console.log(tagName);
		const newTag: TagType = {
			id: tags.length + 1,
			name: tagName,
			color: 'bg-green-400',
		};
		setCurrentTags([...currentTags, newTag]);
		setTags([...tags, newTag]);
	};

	const onSelectTag = (tag: TagType) => {
		console.log(tag);
		setCurrentTags([...currentTags, tag]);
	};

	const onRemoveTag = (tagId: UniqueIdentifier) => {
		console.log(tagId);
		setCurrentTags(currentTags.filter((tag: TagType) => tag.id !== tagId));
	};
	return (
		<div className="App">
			<TagsInput
				onRemoveTag={onRemoveTag}
				onAddTag={onAddTag}
				tags={tags}
				currentTags={currentTags}
				setCurrentTags={setCurrentTags}
				onSelectTag={onSelectTag}
			/>
		</div>
	);
};

export default App;
