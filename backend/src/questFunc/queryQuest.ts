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
	// quest_id อาจจะเก็บไว้ที่ localStorage หลังสร้าง แต่ไม่รู้ว่าจะส่งมาถูกตัวยังไง
	const quest_id: number = req.body.quest_id;
	const logger = Logger.instance().logger();
	let connection;
	try {
		const database = Database.instance().mySQL();
		connection = await database.promise().getConnection();
		const sqlSearch = 'SELECT * FROM quest WHERE quest_id = ?';
		const [rows] = await connection.query(sqlSearch, [quest_id]);
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
