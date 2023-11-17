import { Request, Response } from 'express';
import { OkPacket } from 'mysql';
import Database from '../database/database.js';
import { returnInterface } from '../utils/interfaces.js';
import Logger from '../utils/logger.js';

let returnJson: returnInterface = {
	status: 'warning',
	message: 'Nothing change returnJson variable',
	return: 5,
	data: {},
};

export default async (req: Request, res: Response): Promise<void> => {
	const { quest_name, description, due_date, item_id, email, status } = req.body;

	const logger = Logger.instance().logger();
	let connection;
	try {
		const database = Database.instance().mySQL();
		connection = await database.promise().getConnection();
		const sqlInsert =
			'INSERT INTO quest (quest_name, description, due_date, item_id, email,status) VALUES (?, ?, ?, ?, ?,?)';
		const [insertResult] = await connection.query(sqlInsert, [
			quest_name,
			description,
			due_date,
			item_id,
			email,
			status,
		]);
		const quest_id = (insertResult as OkPacket).insertId;
		returnJson = { status: 'success', message: 'quest created', return: 0, data: { quest_id: quest_id } };
	} catch (error) {
		returnJson = {
			status: 'error',
			message: "Error searching for the quest. perhap email doesn't not exist",
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
