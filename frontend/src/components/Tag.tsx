import { FaTrashAlt } from 'react-icons/fa';
import clsx from 'clsx';
import { TagType } from '../utils/types';
import React from 'react';
import '../styles/Tag.scss';
import { UniqueIdentifier } from '@dnd-kit/core';

interface TagProps {
	tag: TagType;
	onRemoveTag: (tagId: UniqueIdentifier) => void;
}

const Tag = ({ tag, onRemoveTag }: TagProps) => {
	const [hiddenClose, setHiddenClose] = React.useState(true);

	return (
		<li id={tag.id.toString()}>
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
		</li>
	);
};

export default Tag;
