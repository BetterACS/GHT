import express, { Request, Response } from 'express';
import { userStoragesModel } from '../database/models.js';
import checkAuthorization from '../middleware/checkAuthorization.js';
import { returnInterface } from '../utils/interfaces.js';
const router = express.Router();

const getUser = async (request: Request, response: Response) => {
	const email = request.query.email;

	const returnItem: returnInterface = {
		status: 'warning',
		message: 'Item not found',
		return: -1,
		data: {},
	};
	userStoragesModel
		.findOne({ email: email })
		.then((result) => {
			if (result === null) {
				returnItem.status = 'error';
				returnItem.message = 'user not found';
				returnItem.return = 1;
				response.status(404).json(returnItem);
			} else {
				returnItem.status = 'success';
				returnItem.message = 'user founded';
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
};

const setImg = async (request: Request, response: Response) => {
	let { email, image } = request.body;

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
			image: image,
		});
	}

	userStorage
		.updateOne({ image: image })
		.then((result) => {
			console.log(result);
			if (result === null) {
				returnItem.status = 'error';
				returnItem.message = 'Image not found';
				returnItem.return = 2;
				response.status(404).json(returnItem);
			} else {
				returnItem.status = 'success';
				returnItem.message = 'image updated';
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
};
router.get('/user/no-sql', [checkAuthorization, getUser]);
router.post('/user/no-sql', [checkAuthorization, setImg]);
export default router;
