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
	//การจะใส่ได้ต้องมีข้อมูลอยู่ใน table tag & table quest ก่อน
	const { tag_id, quest_id } = req.body;
	const logger = Logger.instance().logger();
	let connection;
	try {
		const database = Database.instance().mySQL();
		connection = await database.promise().getConnection();

		const sqlInsert = 'INSERT INTO contain (tag_id,quest_id) VALUES (?, ?)';
		const [insertResult] = await connection.query(sqlInsert, [tag_id, quest_id]);
		const contain_id = (insertResult as OkPacket).insertId;
		returnJson = { status: 'success', message: 'tag attach', return: 0, data: { contain_id: contain_id } };
	} catch (error) {
		returnJson = {
			status: 'error',
			message: "Error searching for the tag. perhap tag_id or quest_id doesn't not exist",
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
