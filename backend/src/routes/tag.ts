import express, { Request, Response } from 'express';
import { OkPacket } from 'mysql';
import Database from '../database/database.js';
import { returnInterface, tagInterface } from '../utils/interfaces.js';
import Logger from '../utils/logger.js';

let returnJson: returnInterface = {
	status: 'warning',
	message: 'Nothing change returnJson variable',
	return: 5,
	data: {},
};

const createTag = async (req: Request, res: Response): Promise<void> => {
	const tag_name: string = req.body.tag_name;
	const tag_color: string = req.body.tag_color;
	const email: string = req.body.email;

	const logger = Logger.instance().logger();
	let connection;
	try {
		const database = Database.instance().mySQL();
		connection = await database.promise().getConnection();
		const sqlSearch = 'SELECT * FROM tag WHERE tag_name = ? and email = ?';
		const [rows] = await connection.query(sqlSearch, [tag_name, email]);
		let tag = rows as tagInterface[];
		if (tag.length !== 0) {
			logger.error('--------This tag name has been used---------');
			returnJson = { status: 'error', message: 'This tag name has been used.', return: 1, data: {} };
			return;
		}
		const sqlInsert = 'INSERT INTO tag (tag_name,tag_color,email) VALUES (?, ?, ?)';
		const [insertResult] = await connection.query(sqlInsert, [tag_name, tag_color, email]);
		const tag_id = (insertResult as OkPacket).insertId;
		returnJson = { status: 'success', message: 'tag created', return: 0, data: { tag_id: tag_id } };
	} catch (error) {
		returnJson = {
			status: 'error',
			message: "Error searching for the tag. perhap email doesn't not exist",
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

const queryTag = async (req: Request, res: Response): Promise<void> => {
	const { tag_id } = req.body;
	const logger = Logger.instance().logger();
	let connection;
	try {
		const database = Database.instance().mySQL();
		connection = await database.promise().getConnection();
		const sqlSearch = 'SELECT * FROM tag WHERE tag_id = ?';
		const [rows] = await connection.query(sqlSearch, [tag_id]);
		let tag = rows as tagInterface[];
		if (tag.length === 0) {
			logger.error('--------This tag name nos exist---------');
			returnJson = { status: 'error', message: 'This tag name nos exist.', return: 3, data: {} };
			return;
		}
		returnJson = { status: 'success', message: 'tag found', return: 0, data: tag };
	} catch (error) {
		returnJson = {
			status: 'error',
			message: "Error searching for the tag. perhap email doesn't not exist",
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

const updateTag = async (req: Request, res: Response): Promise<void> => {
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

const deleteTag = async (req: Request, res: Response): Promise<void> => {
	const { tag_id } = req.body;
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
			returnJson = { status: 'error', message: 'This tag not exist.', return: 1, data: {} };
			return;
		}
		const sqlDelete = 'delete from tag where tag_id = ?';
		const [deleteResult] = await connection.query(sqlDelete, [tag_id]);

		returnJson = { status: 'success', message: 'tag deleted', return: 0, data: {} };
	} catch (error) {
		returnJson = {
			status: 'error',
			message: 'Error deleting for the tag.',
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

const router = express.Router();

router.post('/tag', createTag);
router.get('/tag', queryTag);
router.put('/tag', updateTag);
router.delete('/tag', deleteTag);
export default router;
