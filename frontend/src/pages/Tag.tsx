import '../styles/Tag.scss';
import React from 'react';

import TagDisplay from '../components/Tag';
import { TagType } from '../utils/types';
import { UniqueIdentifier } from '@dnd-kit/core';

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
			<TagDisplay.tagsEditor
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
