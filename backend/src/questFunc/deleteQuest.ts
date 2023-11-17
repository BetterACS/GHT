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
	const { quest_id } = req.body;
	const logger = Logger.instance().logger();
	let connection;
	try {
		const database = Database.instance().mySQL();
		connection = await database.promise().getConnection();
		const sqlSearch = 'SELECT * FROM quest WHERE quest_id = ?';
		const [rows] = await connection.query(sqlSearch, [quest_id]);
		let quest = rows as questInterface[];
		if (quest.length === 0) {
			logger.error('--------This quest not exist---------');
			returnJson = { status: 'error', message: 'This quest not exist.', return: 1, data: {} };
			return;
		}
		const sqlDelete = 'delete from quest where quest_id = ?';
		const [deleteResult] = await connection.query(sqlDelete, [quest_id]);

		returnJson = { status: 'success', message: 'quest deleted', return: 0, data: {} };
	} catch (error) {
		returnJson = {
			status: 'error',
			message: 'Error deleting for the quest.',
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
