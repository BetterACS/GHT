import mongoose from 'mongoose';
import { monsterInterface, userStoragesInterface } from '../utils/interfaces.js';
const Schema = mongoose.Schema;

// Create a schema for the Monster table.
// This is the structure of the table.
const monsterSchema = new Schema({
	monster_id: Number,
	monster_name: String,
	element: String,
	rarity: Number,
	tame_rate: Number,
	image_url: String,
	foods: {
		type: Object,
		default: {},
	},
});

const monsterModel = mongoose.model<monsterInterface>('monster', monsterSchema);

const userStoragesSchema = new Schema<userStoragesInterface>({
	email: { type: String, required: true, unique: true },
	field: { type: Object, default: {} },
});

const userStoragesModel = mongoose.model<userStoragesInterface>('user_storages', userStoragesSchema);

export { monsterModel, userStoragesModel };
