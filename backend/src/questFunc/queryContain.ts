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
	//การจะใส่ได้ต้องมีข้อมูลอยู่ใน table tag & table quest ก่อน
	const { quest_id } = req.query;
	const logger = Logger.instance().logger();
	let connection;
	try {
		const database = Database.instance().mySQL();
		connection = await database.promise().getConnection();

		const sql = 'select * from contain inner join tag on contain.tag_id = tag.tag_id where quest_id = ?';
		const [Result] = await connection.query(sql, [quest_id]);
		const contain = Result as containInterface[];

		returnJson = { status: 'success', message: 'query success', return: 0, data: Result };
	} catch (error) {
		returnJson = {
			status: 'error',
			message: "Error searching for the contain id. perhap tag_id or quest_id doesn't not exist",
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
