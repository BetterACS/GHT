import bcrypt from 'bcrypt';
import express, { Request, Response } from 'express';
import Database from '../database/database.js';
import { returnInterface, userInterface } from '../utils/interfaces.js';
import Logger from '../utils/logger.js';

const router = express.Router();

const storeUser = async (req: Request, res: Response): Promise<void> => {
	const email: string = req.body.email;
	const username: string = req.body.username;

	const logger = Logger.instance().logger();

	let returnJson: returnInterface = {
		status: 'warning',
		message: 'Nothing change returnJson variable',
		return: 5,
		data: {},
	};
	let connection;
	try {
		const database = Database.instance().mySQL();
		const sqlSearch = 'SELECT * FROM user WHERE email = ?';
		const sqlInsert = `INSERT INTO user (email, username, password) VALUES (?, ?, ?)`;
		const hashedPassword: string = await bcrypt.hash(req.body.password, 10);

		connection = await database.promise().getConnection();
		const [rows] = await connection.query(sqlSearch, [email, username, hashedPassword]);

		let user = rows as userInterface[];
		if (user.length !== 0) {
			logger.error('This email has been used');
			returnJson = { status: 'error', message: 'This email has been used', return: 2, data: {} };
			return;
		}

		await connection.query(sqlInsert, [email, username, hashedPassword]);
		returnJson = { status: 'success', message: 'Register Successful', return: 0, data: {} };
	} catch (error) {
		returnJson = { status: 'error', message: 'Error searching for the email.', return: 2, data: { error: error } };
	} finally {
		if (connection) {
			connection.release();
		}
		res.json(returnJson);
	}
};

router.post('/register', storeUser);

export default router;
