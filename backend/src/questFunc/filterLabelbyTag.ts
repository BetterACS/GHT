import { Request, Response } from 'express';
import Database from '../database/database.js';
import { containInterface, returnInterface } from '../utils/interfaces.js';
import Logger from '../utils/logger.js';

let returnJson: returnInterface = {
	status: 'warning',
	message: 'Nothing change returnJson variable',
	return: 5,
	data: {},
};

export default async (req: Request, res: Response): Promise<void> => {
	const { tag_id } = req.body;
	const logger = Logger.instance().logger();
	let connection;
	try {
		const database = Database.instance().mySQL();
		connection = await database.promise().getConnection();
		const sqlSearch = 'SELECT * FROM contain WHERE tag_id = ?';
		const [rows] = await connection.query(sqlSearch, [tag_id]);
		let contain = rows as containInterface[];
		if (contain.length === 0) {
			logger.error('--------This contain name nos exist---------');
			returnJson = { status: 'error', message: 'This contain name nos exist.', return: 3, data: {} };
			return;
		}

		returnJson = { status: 'success', message: 'contain found', return: 0, data: contain };
	} catch (error) {
		returnJson = {
			status: 'error',
			message: 'Error searching for the contain.',
			return: 2,
			data: { error: error },
		};
	} finally {
		if (connection) {
			connection.release();
		}
		res.json(returnJson);
	}
};
