import express, { Request, Response } from 'express';
import Database from '../database/database.js';
import { containInterface, questInterface, returnInterface } from '../utils/interfaces.js';
import Logger from '../utils/logger.js';

const router = express.Router();

let returnJson: returnInterface = {
	status: 'warning',
	message: 'Nothing change returnJson variable',
	return: 5,
	data: {},
};

const filterLabelByTag = async (req: Request, res: Response): Promise<void> => {
	const { email } = req.query;
	const logger = Logger.instance().logger();
	let connection;
	try {
		const database = Database.instance().mySQL();
		connection = await database.promise().getConnection();
		const sqlSearch = 'SELECT * FROM quest WHERE email = ? order by due_date ASC';
		const [rows] = await connection.query(sqlSearch, [email]);
		let quest = rows as questInterface[];
		if (quest.length === 0) {
			logger.error('--------This quest name not exist---------');
			returnJson = { status: 'error', message: 'This quest name not exist.', return: 3, data: {} };
			return;
		}

		returnJson = { status: 'success', message: 'quest found', return: 0, data: quest };
	} catch (error) {
		returnJson = {
			status: 'error',
			message: 'Error searching for the quest.',
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

const filterByDueDateASC = async (req: Request, res: Response): Promise<void> => {
	const { tag_id } = req.body;
	const logger = Logger.instance().logger();
	let connection;
	try {
		const database = Database.instance().mySQL();
		connection = await database.promise().getConnection();
		const sqlSearch = 'SELECT * FROM contain WHERE tag_id = ?';
		const [rows] = await connection.query(sqlSearch, [tag_id]);
		let contain = rows as containInterface[];
		if (contain.length === 0) {
			logger.error('--------This contain name not exist---------');
			returnJson = { status: 'error', message: 'This contain name not exist.', return: 3, data: {} };
			return;
		}

		returnJson = { status: 'success', message: 'contain found', return: 0, data: contain };
	} catch (error) {
		returnJson = {
			status: 'error',
			message: 'Error searching for the contain.',
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

router.get('/filter/tag', filterLabelByTag);
router.get('/filter/date', filterByDueDateASC);

export default router;
