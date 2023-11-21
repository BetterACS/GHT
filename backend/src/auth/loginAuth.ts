import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import Database from '../database/database.js';
import { userInterface } from '../utils/interfaces.js';
import Logger from '../utils/logger.js';
import { generateAccessToken, generateRefreshToken } from './tokenController.js';

export default (req: Request, res: Response): void => {
	const { email, password } = req.body;
	const database = Database.instance().mySQL();
	const logger = Logger.instance().logger();
	if (!email) {
		res.json({ status: 'error', message: 'Email is required.', return: 1 });
		return;
	}
	const sqlSearch = 'SELECT * FROM user WHERE email = ?';

	database.query(sqlSearch, [email], async (searchError, results, fields) => {
		if (searchError) {
			res.json({ status: 'error', message: 'Database error.', return: 2 });
			return;
		}

		let user = results as userInterface[];

		if (user.length === 0) {
			logger.error('--------This email not exist in the database---------');

			res.json({ status: 'error', message: 'This email not exist in the database.', return: 3 });
			return;
		}
		const hashedPassword = user[0].password;

		if (!(await bcrypt.compare(password, hashedPassword))) {
			logger.error('--------Incorrect password---------');
			res.json({ status: 'error', message: 'Incorrect password.', return: 4 });
			return;
		}
		logger.info('---------> Login Successful');

		const accessToken = generateAccessToken({ user: req.body.email });
		const refreshToken = generateRefreshToken({ user: req.body.email });
		res.json({
			status: 'success',
			message: 'Login Successful',
			return: 0,
			data: { accessToken, refreshToken },
		});
	});
};
