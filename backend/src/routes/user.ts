import bcrypt from 'bcrypt';
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

const updateUser = async (req: Request, res: Response): Promise<void> => {
	const logger = Logger.instance().logger();
	const { email, username } = req.body;
	let connection;

	try {
		const database = Database.instance().mySQL();
		connection = await database.promise().getConnection();

		const sql = 'select * from user where email = ?';
		const [Result] = await connection.query(sql, [email]);
		const user = Result as userInterface[];
		if (user.length === 0) {
			logger.error('--------This user not exist---------');
			returnJson = { status: 'error', message: 'This user not exist.', return: 3, data: {} };
			return;
		}
		const sqlUpdate = 'UPDATE user SET username=? WHERE email=?';
		const [updateResult] = await connection.query(sqlUpdate, [username, email]);
		returnJson = { status: 'success', message: 'update username success', return: 0, data: user };
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

const changePasswordUser = async (req: Request, res: Response): Promise<void> => {
	const logger = Logger.instance().logger();
	const { email, old_password, new_password } = req.body;
	const hashedPassword: string = await bcrypt.hash(new_password, 10);
	let connection;

	try {
		const database = Database.instance().mySQL();
		connection = await database.promise().getConnection();

		const sql = 'select * from user where email = ?';
		const [Result] = await connection.query(sql, [email]);
		const user = Result as userInterface[];
		if (user.length === 0) {
			logger.error('--------This user not exist---------');
			returnJson = { status: 'error', message: 'This user not exist.', return: 3, data: {} };
			return;
		}
		if (!(await bcrypt.compare(old_password, user[0].password))) {
			logger.error('--------Incorrect old password---------');
			returnJson = { status: 'error', message: 'Incorrect old password.', return: 4, data: {} };
			return;
		}
		const sqlUpdate = 'UPDATE user SET password=? WHERE email=?';
		const [updateResult] = await connection.query(sqlUpdate, [hashedPassword, email]);
		returnJson = { status: 'success', message: 'update password success', return: 0, data: user };
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
router.put('/user', [checkAuthorization, updateUser]);
router.put('/user/password', [checkAuthorization, changePasswordUser]);
export default router;
