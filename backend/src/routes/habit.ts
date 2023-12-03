import express, { Request, Response } from 'express';
import { OkPacket } from 'mysql';
import Database from '../database/database.js';
import { habitInterface, returnInterface } from '../utils/interfaces.js';
import Logger from '../utils/logger.js';
const router = express.Router();

let returnJson: returnInterface = {
	status: 'warning',
	message: 'Nothing change returnJson variable',
	return: 5,
	data: {},
};

const queryHabit = async (req: Request, res: Response): Promise<void> => {
	const { habit_id } = req.body;
	const logger = Logger.instance().logger();
	let connection;
	try {
		const database = Database.instance().mySQL();
		connection = await database.promise().getConnection();
		const sqlSearch = 'SELECT * FROM habit WHERE habit_id = ?';
		const [rows] = await connection.query(sqlSearch, [habit_id]);
		let habit = rows as habitInterface[];
		if (habit.length === 0) {
			logger.error('--------This habit name nos exist---------');
			returnJson = { status: 'error', message: 'This habit name nos exist.', return: 3, data: {} };
			return;
		}
		returnJson = { status: 'success', message: 'habit found', return: 0, data: habit };
	} catch (error) {
		returnJson = {
			status: 'error',
			message: "Error searching for the habit. perhap email doesn't not exist",
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

const createHabit = async (req: Request, res: Response): Promise<void> => {
	//ยังไม่แน่ใจเหมือนกันว่าจะทำยังไงให้ value ลดลงเองตาม rate ที่กำหนด
	const { habit_name, description, decrease_rate, value, email } = req.body;
	const logger = Logger.instance().logger();
	let connection;
	try {
		const database = Database.instance().mySQL();
		connection = await database.promise().getConnection();
		const sqlSearch = 'SELECT * FROM habit WHERE habit_name = ? and email = ?';
		const [rows] = await connection.query(sqlSearch, [habit_name, email]);
		let habit = rows as habitInterface[];
		if (habit.length !== 0) {
			logger.error('--------This habit name has been used---------');
			returnJson = { status: 'error', message: 'This habit name has been used.', return: 1, data: {} };
			return;
		}
		const sqlInsert =
			'INSERT INTO habit (habit_name, description, decrease_rate, value, email) VALUES (?, ?, ?, ?, ?)';
		const [insertResult] = await connection.query(sqlInsert, [
			habit_name,
			description,
			decrease_rate,
			value,
			email,
		]);
		const habit_id = (insertResult as OkPacket).insertId;
		returnJson = { status: 'success', message: 'habit created', return: 0, data: { habit_id: habit_id } };
	} catch (error) {
		returnJson = {
			status: 'error',
			message: "Error searching for the habit. perhap email doesn't not exist",
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

const updateHabit = async (req: Request, res: Response): Promise<void> => {
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

const deleteHabit = async (req: Request, res: Response): Promise<void> => {
	const { habit_id } = req.body;
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
			returnJson = { status: 'error', message: 'This habit not exist.', return: 1, data: {} };
			return;
		}
		const sqlDelete = 'delete from habit where habit_id = ?';
		const [deleteResult] = await connection.query(sqlDelete, [habit_id]);

		returnJson = { status: 'success', message: 'habit deleted', return: 0, data: {} };
	} catch (error) {
		returnJson = {
			status: 'error',
			message: 'Error deleting for the habit.',
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

router.get('/habit', queryHabit);
router.post('/habit', createHabit);
router.put('/habit', updateHabit);
router.delete('/habit', deleteHabit);
export default router;
