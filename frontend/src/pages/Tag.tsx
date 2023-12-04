import React, { useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import '../styles/tag.css';
import { WithContext as ReactTags } from 'react-tag-input';
function classNames(...classes: any) {
	return classes.filter(Boolean).join(' ');
}
interface Tag {
	id: string;
	text: string;
}

const suggestions: Tag[] = [
	{ id: 'USA', text: 'USA' },
	{ id: 'Germany', text: 'Germany' },
	{ id: 'Austria', text: 'Austria' },
	{ id: 'Costa Rica', text: 'Costa Rica' },
	{ id: 'Sri Lanka', text: 'Sri Lanka' },
	{ id: 'Thailand', text: 'Thailand' },
	{ id: 'Peru', text: 'Peru' },
];

const KeyCodes = {
	comma: 188,
	enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];
interface DropDownProps {
	tags: Tag[];
	setTags: any;
	previewTags: Tag[];
	setPreviewTags: any;
}
const DropDown = ({ tags, setTags, previewTags, setPreviewTags }: DropDownProps) => {
	const handleDelete = (i: number) => {
		// setTags(tags.filter((tag: Tag, index) => index !== i));
		setTags(tags.filter((tag: Tag, index) => index !== i));
	};

	const handleAddition = (tag: Tag) => {
		// setPreviewTags([...previewTags, tag]);
		setTags([...tags, tag]);
	};

	const handleTagClick = (index: Number) => {
		console.log('The tag at index ' + index + ' was clicked');
	};
	return (
		<Menu
			as="div"
			className="relative inline-block text-left tag-menu"
			onEnded={() => {
				console.log('ended');
			}}
		>
			<div>
				<Menu.Button className="inline-flex w-full hover:outline-none hover:bg-gray-100 focus:outline-none border-none">
					<ReactTags
						classNames={{
							tags: 'display-tag-list',
							tagInputField: 'display-tag-input',
							// tag: 'tag-item',
						}}
						tags={tags}
						handleDelete={handleDelete}
						handleAddition={handleAddition}
					/>
				</Menu.Button>
			</div>

			<Transition
				as={Fragment}
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-100"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-100"
			>
				<Menu.Items className="right-0 z-10 mt-2 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
					<div className="tag-container">
						<ReactTags
							tags={[]}
							placeholder={'Add a tag'}
							suggestions={suggestions}
							delimiters={delimiters}
							handleDelete={handleDelete}
							handleAddition={handleAddition}
							// handleDrag={handleDrag}
							allowDragDrop={false}
							handleTagClick={handleTagClick}
							inputFieldPosition="inline"
							autocomplete
						/>
					</div>
					{tags.map((tag) => (
						<Menu.Item key={tag.id}>
							{({ active }) => (
								<a
									href="#"
									className={classNames(
										active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
										'block px-4 py-2 text-sm'
									)}
									onClick={() => {
										handleAddition(tag);
									}}
								>
									{tag.text}
								</a>
							)}
						</Menu.Item>
					))}
				</Menu.Items>
			</Transition>
		</Menu>
	);
};

const Tag = () => {
	const [tags, setTags] = React.useState([
		{ id: 'Thailand', text: 'Thailand' },
		{ id: 'India', text: 'India' },
		{ id: 'Vietnam', text: 'Vietnam' },
		{ id: 'Turkey', text: 'Turkey' },
	]);
	const [previewTags, setPreviewTags] = React.useState([]);
	return (
		<div className="app">
			<h1> React Tags Example </h1>
			<DropDown
				tags={tags}
				setTags={setTags}
				previewTags={previewTags}
				setPreviewTags={setPreviewTags}
			></DropDown>
		</div>
	);
};

export default Tag;
