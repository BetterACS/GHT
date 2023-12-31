import express, { Request, Response } from 'express';
import Database from '../database/database.js';
import checkAuthorization from '../middleware/checkAuthorization.js';
import { questInterface, returnInterface } from '../utils/interfaces.js';
import Logger from '../utils/logger.js';
const router = express.Router();

let returnJson: returnInterface = {
	status: 'warning',
	message: 'Nothing change returnJson variable',
	return: 5,
	data: {},
};

const filterByDueDateASC = async (req: Request, res: Response): Promise<void> => {
	const { email } = req.query;
	const logger = Logger.instance().logger();
	let connection;
	try {
		const database = Database.instance().mySQL();
		connection = await database.promise().getConnection();
		const sqlSearch =
			'SELECT quest_id, quest_name, description, DATE_FORMAT(last_update_date,"%Y-%m-%d") as last_update_date, DATE_FORMAT(due_date,"%Y-%m-%d") as due_date, status, item_id, email FROM quest WHERE email = ? order by due_date ASC';
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

const filterByTag = async (req: Request, res: Response): Promise<void> => {
	const { tag_id, email } = req.query;
	console.log(tag_id, email);
	const logger = Logger.instance().logger();
	let connection;

	try {
		const database = Database.instance().mySQL();
		connection = await database.promise().getConnection();
		const sqlSearch = `
            SELECT distinct quest.quest_id, quest.quest_name, quest.description,DATE_FORMAT(quest.last_update_date,"%Y-%m-%d") as last_update_date, DATE_FORMAT(quest.due_date,"%Y-%m-%d") as due_date, quest.status, quest.item_id, quest.email 
            FROM contain 
            LEFT JOIN tag ON tag.tag_id = contain.tag_id
            LEFT JOIN quest ON quest.quest_id = contain.quest_id
            WHERE contain.tag_id IN (?) AND quest.email = ?`;

		// Convert tag_id values to an array of numbers
		const tagIdArray = (tag_id as string[]).map(Number);

		const [rows] = await connection.query(sqlSearch, [tagIdArray, email]);
		let contain = rows as questInterface[];
		console.log(sqlSearch);
		console.log(rows);
		console.log(contain);

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

router.get('/filter/date', [checkAuthorization, filterByDueDateASC]);
router.get('/filter/tag', [checkAuthorization, filterByTag]);

export default router;
