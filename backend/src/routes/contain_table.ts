import express, { Request, Response } from 'express';
import { OkPacket } from 'mysql';
import Database from '../database/database.js';
import { containInterface, returnInterface } from '../utils/interfaces.js';
import Logger from '../utils/logger.js';

const router = express.Router();

let returnJson: returnInterface = {
	status: 'warning',
	message: 'Nothing change returnJson variable',
	return: 5,
	data: {},
};

const createContainTable = async (req: Request, res: Response): Promise<void> => {
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

const deleteContainTable = async (req: Request, res: Response): Promise<void> => {
	const { contain_id } = req.body;
	const logger = Logger.instance().logger();
	let connection;
	try {
		const database = Database.instance().mySQL();
		connection = await database.promise().getConnection();
		const sqlSearch = 'SELECT * FROM contain WHERE contain_id = ?';
		const [rows] = await connection.query(sqlSearch, [contain_id]);
		let contain = rows as containInterface[];
		if (contain.length === 0) {
			logger.error('--------This contain not exist---------');
			returnJson = { status: 'error', message: 'This contain not exist.', return: 1, data: {} };
			return;
		}
		const sqlDelete = 'delete from contain where contain_id = ?';
		const [deleteResult] = await connection.query(sqlDelete, [contain_id]);

		returnJson = { status: 'success', message: 'contain deleted', return: 0, data: {} };
	} catch (error) {
		returnJson = {
			status: 'error',
			message: 'Error deleting for the contain.',
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

router.post('/contain-table', createContainTable);
router.delete('/contain-table', deleteContainTable);

export default router;
