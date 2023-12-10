import { itemModel } from '../database/models.js';
import { itemInterface, returnInterface } from '../utils/interfaces.js';

import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/item/:id', (request: Request, response: Response) => {
	const id = request.params.id;
	itemModel.findOne({ item_id: id }, (err: any, item: itemInterface) => {
		const returnItem: returnInterface = {
			status: 'warning',
			message: 'Item not found',
			return: -1,
			data: {},
		};
		if (err) {
			returnItem.status = 'error';
			returnItem.message = 'Internal server error';
			returnItem.return = 1;
			response.status(500).json(returnItem);
		} else {
			returnItem.status = 'success';
			returnItem.message = 'Item found';
			returnItem.return = 0;
			returnItem.data = item;
			response.json(item);
		}
	});
});

export default router;
