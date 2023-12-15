import { FaTrashAlt } from 'react-icons/fa';
import clsx from 'clsx';
import { TagType } from '../utils/types';
import React from 'react';
import '../styles/Tag.scss';
import { UniqueIdentifier } from '@dnd-kit/core';
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
interface previewTagProps {
	tag: TagType;
}

interface tagProps {
	tag: TagType;
	onRemoveTag: (tagId: UniqueIdentifier) => void;
}

interface tagEditorProps {
	tags: TagType[];
	currentTags: TagType[];
	setCurrentTags: React.Dispatch<React.SetStateAction<TagType[]>>;
	onAddTag: (tagName: string) => void;
	onRemoveTag: (tag: TagType) => void;
	onDeleteTag: (tag: TagType) => void;
	onSelectTag: (tag: TagType) => void;
}

class TagDisplay {
	constructor() {
		throw new Error('TagDisplay is a static class');
	}

	private static classNames = (...classes: any) => {
		return classes.filter(Boolean).join(' ');
	};

	public static previewTag = ({ tag }: previewTagProps) => {
		return (
			<div id={tag.id.toString()}>
				<div className={clsx('tag', tag.color)}>
					<span className="tag-title text-white">{tag.name}</span>
				</div>
			</div>
		);
	};
	public static tag = ({ tag, onRemoveTag }: tagProps) => {
		const [hiddenClose, setHiddenClose] = React.useState(true);

		return (
			<div id={tag.id.toString()}>
				<div
					className={clsx('tag', tag.color)}
					onMouseEnter={() => {
						setHiddenClose(false);
					}}
					onMouseLeave={() => {
						setHiddenClose(true);
					}}
				>
					<span className="tag-title">{tag.name}</span>
					<span
						className={clsx('tag-close-icon', tag.color, { hidden: hiddenClose })}
						onClick={() => onRemoveTag(tag.id)}
					>
						<FaTrashAlt />
					</span>
				</div>
			</div>
		);
	};

	public static tagsEditor = ({
		tags,
		currentTags,
		setCurrentTags,
		onRemoveTag,
		onDeleteTag,
		onAddTag,
		onSelectTag,
	}: tagEditorProps) => {
		const [placeholder, setPlaceholder] = React.useState('Add / Edit');
		const [menuVisible, setMenuVisible] = React.useState(false);

		const getNoneSelectedTags = () => {
			// Get all tags that no currentTags id matches
			const noneSelect = tags.filter((tag: TagType) => {
				return !currentTags.find((currentTag: TagType) => currentTag.id === tag.id);
			});
			return noneSelect;
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
							<TagDisplay.tag
								key={tag.id}
								tag={tag}
								onRemoveTag={() => {
									onRemoveTag(tag);
								}}
							/>
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
												className={this.classNames(
													active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
													'block px-4 text-sm h-92 flex flex-row items-center justify-between'
												)}
												onClick={() => onSelectTag(tag)}
											>
												{/* {tag.name} */}
												<div className="h-full py-4">{tag.name}</div>
												<div
													className="fixed right-0 mr-2 middle-0 hover:text-red-500"
													onClick={() => onDeleteTag(tag)}
												>
													<FaTrashAlt />
												</div>
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
}

export default TagDisplay;
