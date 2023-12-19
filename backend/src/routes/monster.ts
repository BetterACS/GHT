import express, { Request, Response } from 'express';
import { monsterModel, userStoragesModel } from '../database/models.js';
import checkAuthorization from '../middleware/checkAuthorization.js';
import Deliver from '../utils/deliver.js';
import { monsterInterface } from '../utils/interfaces.js';
import Scheduler from '../utils/scheduler.js';
const router = express.Router();

const getCurrentMonster = async (userStorage: any) => {
	const field = userStorage.field;

	// Tamed monsters is the monsters that user has progress > 100.
	const tamedMonstersIdArray = Object.keys(field).filter((key) => field[key] >= 100);
	console.log('tamedMonstersIdArray', tamedMonstersIdArray);

	// Random monsters that user has not tamed yet.
	const monsters = await monsterModel.find({ monster_id: { $nin: tamedMonstersIdArray } });
	// json only 1 monster with random all the monster by seed
	const seed = Deliver.instance().getCurrentMonster();
	const monster = [monsters[seed % monsters.length]];
	return monster;
};

router.get('/monster', checkAuthorization, async (request: Request, response: Response) => {
	const { email } = request.query;
	const userStorage = await userStoragesModel.findOne({ email: email });

	if (!userStorage) {
		response.json({ status: 'error', message: 'User does not exist', return: 1, data: {} });
		return;
	}
	const monster = await getCurrentMonster(userStorage);

	response.json({ status: 'success', message: 'Monster appeared', return: 0, data: { monsters: monster } });
});

router.get('/monster/user', async (request: Request, response: Response) => {
	/**
	 * This route will random json data for a monster.
	 */
	const email = request.query.email;
	const userStorage = await userStoragesModel.findOne({ email: email });
	const field = userStorage?.field;
	let monsters = [];
	for (let key in field) {
		const monster = await monsterModel.findOne({ monster_id: key });
		monsters.push({ monster: key, name: monster?.monster_name, image: monster?.image_url, progress: field[key] });
	}

	response.json({ status: 'success', message: 'Monster appeared', return: 0, data: { monsters: monsters } });
});

router.post('/monster', async (request: Request, response: Response) => {
	/**
	 * This route will random json data for a monster.
	 */

	let json = request.body;
	let monster = new monsterModel(json);
	const results = await monster.save();
	response.json({ count: 1, data: results });
});

router.post('/monster/complete', async (request: Request, response: Response) => {
	/**
	 * This route will random json data for a monster.
	 */

	try {
		Scheduler.instance().updateRandomMonster();
		response.json({ status: 'success', message: 'Monster appeared', return: 0, data: {} });
	} catch (error) {
		response.json({ status: 'error', message: 'Error updating seed', return: 1, data: {} });
	}
});

router.post('/monster/tame/:id', async (request: Request, response: Response) => {
	const email = request.body.email;
	const headers = request.headers;

	let id = Number(request.params.id);
	// For testing purposes, we will use id as the score.
	let favoriteScore = id;

	// Get the current monster.
	try {
		// Get the current user storage.
		let userStorage = await userStoragesModel.findOne({ email: email });
		const currentMonster = (await getCurrentMonster(userStorage))[0] as monsterInterface;

		// If the user storage does not exist, create one.
		if (!userStorage) {
			userStorage = new userStoragesModel({
				email: email,
				field: {},
			});
		}

		// Get the current user's field.
		let field = userStorage.field;
		let progress = field[currentMonster.monster_id] || 0;

		// If the user's field does not have the current monster, create one.
		if (!field[currentMonster.monster_id]) {
			progress = favoriteScore;
		} else {
			progress += favoriteScore;
		}
		console.log('progress', progress);
		await userStorage.updateOne({
			$set: {
				[`field.${currentMonster.monster_id}`]: progress,
			},
		});

		// Save the user's field.
		await userStorage.save();

		// Send the response.
		response.json({
			email: email,
			monster_id: currentMonster.monster_id,
			monster_name: currentMonster.monster_name,
			score: favoriteScore,
			progress: progress,
		});
	} catch (error) {
		console.log('result', error);
		response.json({ status: 'error', message: 'Monster does not exist', return: 1, data: {} });
		return;
	}
});

export default router;
