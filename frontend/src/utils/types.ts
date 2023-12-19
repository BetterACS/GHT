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
	description?: string;
};

type Item = {
	id: UniqueIdentifier;
	title: string;
	description: string;
	image_url: string;
	due_date: string;
	last_update_date: string;
	item_id: UniqueIdentifier;
	item_name: string;
	item_description: string;
	tags: TagType[];
};

type HeadersType = {
	authorization: string;
	refreshToken: string;
	email: string;
};
type foodItemType = {
	description: string;
	image_url: string;
	item_id: number;
	item_name: string;
	item_type: string;
	rarity: number;
	__v: number;
	_id: string;
};
export type { DNDType, HeadersType, Item, TagType, foodItemType };
