import express, { Request, Response } from 'express';
import { OkPacket } from 'mysql';
import Database from '../database/database.js';
import { questInterface, returnInterface } from '../utils/interfaces.js';
import Logger from '../utils/logger.js';

const router = express.Router();

let returnJson: returnInterface = {
	status: 'warning',
	message: 'Nothing change returnJson variable',
	return: 5,
	data: {},
};
const createQuest = async (req: Request, res: Response): Promise<void> => {
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

const queryQuest = async (req: Request, res: Response): Promise<void> => {
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

const deleteQuest = async (req: Request, res: Response): Promise<void> => {
	const { quest_id } = req.body;
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
			returnJson = { status: 'error', message: 'This quest not exist.', return: 1, data: {} };
			return;
		}
		const sqlDelete = 'delete from quest where quest_id = ?';
		const [deleteResult] = await connection.query(sqlDelete, [quest_id]);

		returnJson = { status: 'success', message: 'quest deleted', return: 0, data: {} };
	} catch (error) {
		returnJson = {
			status: 'error',
			message: 'Error deleting for the quest.',
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

const updateQuest = async (req: Request, res: Response): Promise<void> => {
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

router.post('/quest', createQuest);
router.get('/quest', queryQuest);
router.delete('/quest', deleteQuest);
router.put('/quest', updateQuest);
export default router;
