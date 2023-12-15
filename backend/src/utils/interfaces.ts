/**
 * @fileoverview Interface for monster data from the nosql database.
 */
interface monsterInterface {
	monster_id: number;
	monster_name: string;
	element: string;
	rarity: number;
	tame_rate: number;
	image_url: string;
	foods: {
		[key: string]: number;
	};
}

interface userInterface {
	email: string;
	username: string;
	password: string;
	created_time: Date;
}
interface questInterface {
	quest_id: number;
	quest_name: string;
	description: string;
	start_date: Date;
	due_date: Date;
	status: string;
	item_id: number;
	email: string;
}
interface tagInterface {
	tag_id: number;
	tag_name: string;
	tag_color: string;
	email: string;
}

interface habitInterface {
	habit_id: number;
	habit_name: string;
	description: string;
	decrease_rate: number;
	value: number;
	email: string;
}

interface inventoryInterface {
	[item_id: string]: number;
}

interface fieldInterface {
	[monster_id: string]: number;
}

interface userStoragesInterface {
	email: string;
	field: fieldInterface;
	inventory: inventoryInterface;
}

interface returnInterface {
	status: string;
	message: string;
	return: number;
	data: {
		[key: string]: any;
	};
}
interface containInterface {
	contain_id: number;
	tag_id: number;
	quest_id: number;
}

interface itemInterface {
	item_id: number;
	item_name: string;
	description: string;
	item_type: string;
	rarity: number;
	image_url: string;
}

export {
	containInterface,
	fieldInterface,
	habitInterface,
	inventoryInterface,
	itemInterface,
	monsterInterface,
	questInterface,
	returnInterface,
	tagInterface,
	userInterface,
	userStoragesInterface,
};
