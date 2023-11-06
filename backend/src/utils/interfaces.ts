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

interface inventoryInterface {
	[item_id: string]: number;
}

interface fieldInterface {
	[monster_id: string]: number;
}

interface userStoragesInterface {
	email: string;
	field: fieldInterface;
}

interface returnInterface {
	status: string;
	message: string;
	return: number;
	data: {
		[key: string]: any;
	};
}

export { fieldInterface, inventoryInterface, monsterInterface, returnInterface, userInterface, userStoragesInterface };
