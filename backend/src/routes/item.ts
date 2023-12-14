import express, { Request, Response } from 'express';
import { itemModel } from '../database/models.js';
import checkAuthorization from '../middleware/checkAuthorization.js';
import { returnInterface } from '../utils/interfaces.js';
import { getRandomInt } from '../utils/utilityFunction.js';
const router = express.Router();

router.get('/item', [
	checkAuthorization,
	async (request: Request, response: Response) => {
		let id = request.query.id;
		if (id === undefined) {
			// 25 is the max number Id in the database
			id = getRandomInt(25).toString();
		}
		const returnItem: returnInterface = {
			status: 'warning',
			message: 'Item not found',
			return: -1,
			data: {},
		};

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

export default router;
