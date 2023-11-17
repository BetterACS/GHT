import { Request, Response } from 'express';
import Database from '../database/database.js';
import { habitInterface, returnInterface } from '../utils/interfaces.js';
import Logger from '../utils/logger.js';
let returnJson: returnInterface = {
	status: 'warning',
	message: 'Nothing change returnJson variable',
	return: 5,
	data: {},
};

export default async (req: Request, res: Response): Promise<void> => {
	const { habit_id } = req.body;
	const logger = Logger.instance().logger();
	let connection;
	try {
		const database = Database.instance().mySQL();
		connection = await database.promise().getConnection();
		const sqlSearch = 'SELECT * FROM habit WHERE habit_id = ?';
		const [rows] = await connection.query(sqlSearch, [habit_id]);
		let habit = rows as habitInterface[];
		if (habit.length === 0) {
			logger.error('--------This habit name nos exist---------');
			returnJson = { status: 'error', message: 'This habit name nos exist.', return: 3, data: {} };
			return;
		}
		returnJson = { status: 'success', message: 'habit found', return: 0, data: habit };
	} catch (error) {
		returnJson = {
			status: 'error',
			message: "Error searching for the habit. perhap email doesn't not exist",
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
