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
	const { habit_id, habit_name, description, decrease_rate, value } = req.body;
	const logger = Logger.instance().logger();
	let connection;
	try {
		const database = Database.instance().mySQL();
		connection = await database.promise().getConnection();
		const sqlSearch = 'SELECT * FROM habit WHERE habit_id = ?';
		const [rows] = await connection.query(sqlSearch, [habit_id]);
		let habit = rows as habitInterface[];
		if (habit.length === 0) {
			logger.error('--------This habit not exist---------');
			returnJson = { status: 'error', message: 'This habit not exist.', return: 3, data: {} };
			return;
		}
		const sqlUpdate = 'UPDATE habit SET habit_name=?,description=?,decrease_rate=?,value=? WHERE habit_id=?';
		const [updateResult] = await connection.query(sqlUpdate, [
			habit_name,
			description,
			decrease_rate,
			value,
			habit_id,
		]);

		returnJson = { status: 'success', message: 'habit adjusted', return: 0, data: {} };
	} catch (error) {
		returnJson = {
			status: 'error',
			message: "Error adjust for the habit. perhap habit id doesn't not exist",
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
