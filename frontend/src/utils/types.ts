import { UniqueIdentifier } from '@dnd-kit/core';

type DNDType = {
	id: UniqueIdentifier;
	title: string;
	items: {
		id: UniqueIdentifier;
		title: string;
		description : string;
	}[];
};

export type { DNDType };
