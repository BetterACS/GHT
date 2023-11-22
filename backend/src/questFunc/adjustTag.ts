import { Request, Response } from 'express';
import Database from '../database/database.js';
import { returnInterface, tagInterface } from '../utils/interfaces.js';
import Logger from '../utils/logger.js';

let returnJson: returnInterface = {
	status: 'warning',
	message: 'Nothing change returnJson variable',
	return: 5,
	data: {},
};

export default async (req: Request, res: Response): Promise<void> => {
	const { tag_id, tag_name, tag_color } = req.body;
	const logger = Logger.instance().logger();
	let connection;
	try {
		const database = Database.instance().mySQL();
		connection = await database.promise().getConnection();
		const sqlSearch = 'SELECT * FROM tag WHERE tag_id = ?';
		const [rows] = await connection.query(sqlSearch, [tag_id]);
		let tag = rows as tagInterface[];
		if (tag.length === 0) {
			logger.error('--------This tag not exist---------');
			returnJson = { status: 'error', message: 'This tag not exist.', return: 3, data: {} };
			return;
		}
		const sqlUpdate = 'UPDATE tag SET tag_name=?, tag_color=? WHERE tag_id=?';
		const [updateResult] = await connection.query(sqlUpdate, [tag_name, tag_color, tag_id]);

		returnJson = { status: 'success', message: 'Tag adjusted', return: 0, data: {} };
	} catch (error) {
		returnJson = {
			status: 'error',
			message: "Error adjust for the tag. perhap tag id doesn't not exist",
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