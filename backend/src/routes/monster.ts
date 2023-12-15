import express, { Request, Response } from 'express';
import checkAuthorization from '../middleware/checkAuthorization.js';
import Deliver from '../utils/deliver.js';
const router = express.Router();

router.get('/monster', checkAuthorization, async (request: Request, response: Response) => {
	/**
	 * This route will random json data for a monster.
	 */

	const monsters = [Deliver.instance().getCurrentMonster()];
	response.json({ status: 'success', message: 'Monster appeared', return: 0, data: { monsters: monsters } });
});

// router.post('/monster', async (request: Request, response: Response) => {
// 	/**
// 	 * This route will random json data for a monster.
// 	 */

// 	let json = request.body;
// 	let monster = new monsterModel(json);
// 	const results = await monster.save();
// 	response.json({ count: 1, data: results });
// });

// router.post('/monster/tame/:id', async (request: Request, response: Response) => {
// 	const logger = Logger.instance().logger();
// 	let id = Number(request.params.id);

// 	// This is a list of emails. (For testing purposes)
// 	const emails = ['moneiei@gmail.com', 'montrysohard@hotmail.com'];
// 	let randomEmailIndex = Math.floor(Math.random() * emails.length);
// 	let email = emails[randomEmailIndex];

// 	// For testing purposes, we will use id as the score.
// 	let favoriteScore = id;

// 	// Get the current monster.
// 	let currentMonster = Deliver.instance().getCurrentMonster();

// 	// Get the current user storage.
// 	let userStorage = await userStoragesModel.findOne({ email: email });

// 	// If the user storage does not exist, create one.
// 	if (!userStorage) {
// 		userStorage = new userStoragesModel({
// 			email: email,
// 			field: {},
// 		});
// 	}

// 	// Get the current user's field.
// 	let field = userStorage.field;
// 	let progress = field[currentMonster.monster_id] || 0;

// 	// If the user's field does not have the current monster, create one.
// 	if (!field[currentMonster.monster_id]) {
// 		progress = favoriteScore;
// 	} else {
// 		progress += favoriteScore;
// 	}

// 	await userStorage.updateOne({
// 		$set: {
// 			[`field.${currentMonster.monster_id}`]: progress,
// 		},
// 	});

// 	// Save the user's field.
// 	await userStorage.save();

// 	// Send the response.
// 	response.json({
// 		email: email,
// 		monster_id: currentMonster.monster_id,
// 		score: favoriteScore,
// 		progress: progress,
// 	});
// });

export default router;
