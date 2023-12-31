import express from 'express';
const router = express.Router();

import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import Database from '../database/database.js';
import { returnInterface, userInterface } from '../utils/interfaces.js';
import Logger from '../utils/logger.js';

import TokenManager from '../utils/tokenManager.js';
const loginAuth = async (req: Request, res: Response) => {
	const { email, password } = req.body;

	let returnJson: returnInterface = {
		status: 'warning',
		message: 'Nothing change returnJson variable',
		return: 5,
		data: {},
	};

	if (!email) {
		returnJson = { status: 'error', message: 'Email is required.', return: 1, data: {} };
		res.json(returnJson);
		return;
	}

	const logger = Logger.instance().logger();

	let connection;

	try {
		const database = Database.instance().mySQL();

		connection = await database.promise().getConnection();
		const sqlSearch = 'SELECT * FROM user WHERE email = ?';
		const [rows] = await connection.query(sqlSearch, [email]);

		let user = rows as userInterface[];
		if (user.length === 0) {
			logger.error('--------This email not exist in the database---------');
			returnJson = { status: 'error', message: 'This email not exist in the database.', return: 3, data: {} };
			return;
		}

		const hashedPassword = user[0].password;
		console.log(user[0].is_verified);
		if (user[0].is_verified == false) {
			logger.error('--------This email has not been verified---------');
			returnJson = { status: 'error', message: 'This email has not been verified.', return: 5, data: {} };
			return;
		}
		if (!(await bcrypt.compare(password, hashedPassword))) {
			logger.error('--------Incorrect password---------');
			returnJson = { status: 'error', message: 'Incorrect password.', return: 4, data: {} };
			return;
		}

		logger.info('---------> Login Successful');

		const accessToken = TokenManager.instance().generateAccessToken({ user: req.body.email });
		const refreshToken = TokenManager.instance().generateRefreshToken({ user: req.body.email });
		returnJson = {
			status: 'success',
			message: 'Login Successful',
			return: 0,
			data: { accessToken, refreshToken },
		};
	} catch (error) {
		returnJson = { status: 'error', message: 'Error searching for the email.', return: 2, data: { error: error } };
	} finally {
		if (connection) {
			connection.release();
		}
		res.json(returnJson);
	}
};

router.post('/login', loginAuth);

export default router;
