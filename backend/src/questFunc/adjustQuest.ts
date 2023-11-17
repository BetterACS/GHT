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
	//quest_id ยังไม่รู้จะเก็บให้อยู่บน frontend ยังไง ส่วน quest_name, description, due_date, item_id, email อาจจะใช้ทับจาก <form> ได้เลย (defailt value ของ input ใน <form> ก็คือค่าเดิมที่ queryQuest.js ได้มา)
	const { quest_id, quest_name, description, due_date, item_id, email, status } = req.body;
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
			returnJson = { status: 'error', message: 'This quest not exist.', return: 3, data: {} };
			return;
		}
		const sqlUpdate =
			'UPDATE quest SET quest_name=?, description=?, due_date=?, item_id=?, email=?,status=? WHERE quest_id=?';
		const [updateResult] = await connection.query(sqlUpdate, [
			quest_name,
			description,
			due_date,
			item_id,
			email,
			status,
			quest_id,
		]);

		returnJson = { status: 'success', message: 'quest adjusted', return: 0, data: {} };
	} catch (error) {
		returnJson = {
			status: 'error',
			message: "Error adjust for the quest. perhap quest id doesn't not exist",
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
