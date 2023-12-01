import { Request, Response } from 'express';
import Database from '../database/database.js';
import { questInterface, returnInterface } from '../utils/interfaces.js';
import Logger from '../utils/logger.js';
let returnJson: returnInterface = {
	status: 'warning',
	message: 'Nothing change returnJson variable',
	return: 5,
	data: {},
};
export default async (req: Request, res: Response): Promise<void> => {
	const { email } = req.query;
	const logger = Logger.instance().logger();
	let connection;
	try {
		const database = Database.instance().mySQL();
		connection = await database.promise().getConnection();
		const sqlSearch = 'SELECT * FROM quest WHERE email = ? order by due_date ASC';
		const [rows] = await connection.query(sqlSearch, [email]);
		let quest = rows as questInterface[];
		if (quest.length === 0) {
			logger.error('--------This quest name nos exist---------');
			returnJson = { status: 'error', message: 'This quest name nos exist.', return: 3, data: {} };
			return;
		}

		returnJson = { status: 'success', message: 'quest found', return: 0, data: quest };
	} catch (error) {
		returnJson = {
			status: 'error',
			message: 'Error searching for the quest.',
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
