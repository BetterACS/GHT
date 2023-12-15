import express, { Request, Response } from 'express';
import { itemModel, userStoragesModel } from '../database/models.js';
import checkAuthorization from '../middleware/checkAuthorization.js';
import { returnInterface } from '../utils/interfaces.js';
import { getRandomInt } from '../utils/utilityFunction.js';
const router = express.Router();

router.get('/item', [
	checkAuthorization,
	async (request: Request, response: Response) => {
		let id = request.query.id;
		if (id === undefined || id === null || id === '') {
			// 25 is the max number Id in the database
			id = getRandomInt(25).toString();
		}
		const returnItem: returnInterface = {
			status: 'warning',
			message: 'Item not found',
			return: -1,
			data: {},
		};
		console.log('id', id);
		itemModel
			.findOne({ item_id: id })
			.then((result) => {
				if (result === null) {
					returnItem.status = 'error';
					returnItem.message = 'Item not found';
					returnItem.return = 1;
					response.status(404).json(returnItem);
				} else {
					returnItem.status = 'success';
					returnItem.message = 'Item found';
					returnItem.return = 0;
					returnItem.data = result;
					response.json(returnItem);
				}
			})
			.catch((err) => {
				returnItem.status = 'error';
				returnItem.message = 'Internal server error';
				returnItem.return = 1;
				response.status(500).json(returnItem);
			});
	},
]);

router.get('/item/item', [
	checkAuthorization,
	async (request: Request, response: Response) => {
		let ids = request.query.ids;

		const returnItem: returnInterface = {
			status: 'warning',
			message: 'Item not found',
			return: -1,
			data: {},
		};
		console.log('id', ids);
		itemModel.find({ item_id: { $in: ids } }).then((result) => {
			if (result === null) {
				returnItem.status = 'error';
				returnItem.message = 'Item not found';
				returnItem.return = 1;
				response.status(404).json(returnItem);
			} else {
				returnItem.status = 'success';
				returnItem.message = 'Item found';
				returnItem.return = 0;
				returnItem.data = result;
				response.json(returnItem);
			}
		});

		// .find({ item_id: id })
		// .then((result) => {
		// 	if (result === null) {
		// 		returnItem.status = 'error';
		// 		returnItem.message = 'Item not found';
		// 		returnItem.return = 1;
		// 		response.status(404).json(returnItem);
		// 	} else {
		// 		returnItem.status = 'success';
		// 		returnItem.message = 'Item found';
		// 		returnItem.return = 0;
		// 		returnItem.data = result;
		// 		response.json(returnItem);
		// 	}
		// })
		// .catch((err) => {
		// 	returnItem.status = 'error';
		// 	returnItem.message = 'Internal server error';
		// 	returnItem.return = 1;
		// 	response.status(500).json(returnItem);
		// });
	},
]);

router.post('/item/user', [
	checkAuthorization,
	async (request: Request, response: Response) => {
		let { email, item } = request.body;

		const returnItem: returnInterface = {
			status: 'warning',
			message: 'Item not found',
			return: -1,
			data: {},
		};

		// Get the current user storage.
		let userStorage = await userStoragesModel.findOne({ email: email });

		// If the user storage does not exist, create one.
		if (!userStorage) {
			userStorage = new userStoragesModel({
				email: email,
				field: {},
				inventory: {},
			});
		}

		// Get the current user's field.
		let inventory = userStorage.inventory;
		let progress = inventory[item.item_id] || 0;

		// If the user's field does not have the current monster, create one.
		if (!inventory[item.item_id]) {
			progress = 5;
		} else {
			progress += 5;
		}

		await userStorage.updateOne({
			$set: {
				[`inventory.${item.item_id}`]: progress,
			},
		});
	},
]);

router.put('/item/use', [
	checkAuthorization,
	async (request: Request, response: Response) => {
		let { email, item_id } = request.body;

		const returnItem: returnInterface = {
			status: 'warning',
			message: 'Item not found',
			return: -1,
			data: {},
		};

		// Get the current user storage.
		let userStorage = await userStoragesModel.findOne({ email: email });

		// If the user storage does not exist, create one.
		if (!userStorage) {
			userStorage = new userStoragesModel({
				email: email,
				field: {},
				inventory: {},
			});
		}

		// Get the current user's field.
		let inventory = userStorage.inventory;
		let progress = inventory[item_id] || 0;

		// If the user's field does not have the current monster, create one.
		if (!inventory[item_id]) {
			progress = 0;
		} else {
			if (progress > 0) {
				progress -= 1;
			}
		}

		await userStorage.updateOne({
			$set: {
				[`inventory.${item_id}`]: progress,
			},
		});

		response.json({ status: 'success', message: 'Item used', return: 0, data: {} });
	},
]);

router.get('/items', [
	checkAuthorization,
	async (request: Request, response: Response) => {
		let email = request.query.email;

		const returnItem: returnInterface = {
			status: 'warning',
			message: 'Item not found',
			return: -1,
			data: {},
		};

		console.log(email);
		// Get the current user storage.
		let userStorage = await userStoragesModel.findOne({ email: email });
		console.log(userStorage);

		// If the user storage does not exist, create one.
		if (!userStorage) {
			userStorage = new userStoragesModel({
				email: email,
				field: {},
				inventory: {},
			});
		}

		// Get the current user's field.
		let inventory = userStorage.inventory;

		response.json(inventory);
	},
]);

export default router;
