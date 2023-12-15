import express, { Request, Response } from 'express';
import Database from '../database/database.js';
import checkAuthorization from '../middleware/checkAuthorization.js';
import { returnInterface, userInterface } from '../utils/interfaces.js';
import Logger from '../utils/logger.js';
const router = express.Router();

let returnJson: returnInterface = {
	status: 'warning',
	message: 'Nothing change returnJson variable',
	return: 5,
	data: {},
};

const queryUser = async (req: Request, res: Response): Promise<void> => {
	//การจะใส่ได้ต้องมีข้อมูลอยู่ใน table tag & table quest ก่อน
	const { email } = req.query;
	const logger = Logger.instance().logger();
	let connection;
	try {
		const database = Database.instance().mySQL();
		connection = await database.promise().getConnection();

		const sql = 'select * from user where email = ?';
		const [Result] = await connection.query(sql, [email]);
		const user = Result as userInterface[];

		returnJson = { status: 'success', message: 'query success', return: 0, data: user };
	} catch (error) {
		returnJson = {
			status: 'error',
			message: "Error searching for the user. perhap email doesn't not exist",
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

router.get('/user', [checkAuthorization, queryUser]);
export default router;
