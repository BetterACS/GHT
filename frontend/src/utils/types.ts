import { UniqueIdentifier } from '@dnd-kit/core';
type TagType = {
	id: UniqueIdentifier;
	name: string;
	color: string;
};

type DNDType = {
	id: UniqueIdentifier;
	title: string;
	items: Item[];
};

type Item = {
	id: UniqueIdentifier;
	title: string;
	description: string;
	image_url: string;
	tags: TagType[];
};

export type { DNDType, Item, TagType };
