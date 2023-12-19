import bcrypt from 'bcrypt';
import express, { Request, Response } from 'express';
import Database from '../database/database.js';
import { returnInterface, userInterface } from '../utils/interfaces.js';
import Logger from '../utils/logger.js';
import { sendResetPassword } from '../utils/sendVerification.js';
const router = express.Router();

const forgotPassword = async (req: Request, res: Response): Promise<void> => {
	const { email } = req.body;
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
		connection = await database.promise().getConnection();
		const sqlSearch = 'SELECT * FROM user WHERE email=?';
		const [rows] = await connection.query(sqlSearch, [email]);
		let user = rows as userInterface[];
		if (user.length === 0) {
			logger.error('--------not exist this email in database---------');
			returnJson = {
				status: 'error',
				message: 'not exist this email in database.',
				return: 3,
				data: {},
			};
			return;
		}
		const OTP = Math.floor(100000 + Math.random() * 900000).toString();
		const expirationTime = new Date();
		expirationTime.setMinutes(expirationTime.getMinutes() + 15);
		const formattedExpirationTime = `${expirationTime.getFullYear()}-${(expirationTime.getMonth() + 1)
			.toString()
			.padStart(2, '0')}-${expirationTime.getDate().toString().padStart(2, '0')} ${expirationTime
			.getHours()
			.toString()
			.padStart(2, '0')}:${expirationTime.getMinutes().toString().padStart(2, '0')}:${expirationTime
			.getSeconds()
			.toString()
			.padStart(2, '0')}`;
		console.log(OTP, ' ', formattedExpirationTime, ' ', email);
		const sqlUpdate = 'UPDATE user SET reset_token=? ,reset_token_expires=? WHERE email=?';
		const [updateResult] = await connection.query(sqlUpdate, [OTP, formattedExpirationTime, email]);
		returnJson = { status: 'success to crete token', message: '', return: 0, data: {} };
		sendResetPassword(email, OTP);
	} catch (error) {
		returnJson = {
			status: 'error',
			message: String(error?.toString()),
			return: 2,
			data: { error: error },
		};
	} finally {
		if (connection) {
			connection.release();
		}
		res.json(returnJson);
		console.log('4');
	}
};

const middlewareCheckOTP = async (req: Request, res: Response, next: any): Promise<void> => {
	const { OTP, email } = req.body;

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
		connection = await database.promise().getConnection();
		const sqlSearch = 'SELECT * FROM user WHERE reset_token=? and email=?';
		const [rows] = await connection.query(sqlSearch, [OTP, email]);
		let user = rows as userInterface[];
		if (user.length === 0) {
			logger.error('--------This OTP not found maybe it has change already---------');
			returnJson = {
				status: 'error',
				message: 'This token not found maybe it has change already.',
				return: 3,
				data: {},
			};

			res.json(returnJson);
			return;
		}
		if (user[0].reset_token_expires < new Date()) {
			logger.error('--------This token has expired.Then send new email.---------');
			returnJson = {
				status: 'error',
				message: 'This token has expired.Then send new email',
				return: 5,
				data: {},
			};
			const OTP = Math.floor(100000 + Math.random() * 900000).toString();
			const expirationTime = new Date();
			expirationTime.setMinutes(expirationTime.getMinutes() + 15);
			const formattedExpirationTime = `${expirationTime.getFullYear()}-${(expirationTime.getMonth() + 1)
				.toString()
				.padStart(2, '0')}-${expirationTime.getDate().toString().padStart(2, '0')} ${expirationTime
				.getHours()
				.toString()
				.padStart(2, '0')}:${expirationTime.getMinutes().toString().padStart(2, '0')}:${expirationTime
				.getSeconds()
				.toString()
				.padStart(2, '0')}`;
			const sqlUpdate = 'UPDATE user SET reset_token=? ,reset_token_expires=? WHERE email=?';
			const [updateResult] = await connection.query(sqlUpdate, [OTP, formattedExpirationTime, email]);
			sendResetPassword(email, OTP);
			res.json(returnJson);
			return;
		}
		returnJson = { status: 'success', message: '', return: 0, data: {} };
		next();
	} catch (error) {
		returnJson = {
			status: 'error',
			message: String(error?.toString()),
			return: 2,
			data: { error: error },
		};
	} finally {
		if (connection) {
			connection.release();
		}
	}
};

const changePasswordUser = async (req: Request, res: Response): Promise<void> => {
	let returnJson: returnInterface = {
		status: 'warning',
		message: 'Nothing change returnJson variable',
		return: 5,
		data: {},
	};
	const logger = Logger.instance().logger();
	const { email, password, confirm_password } = req.body;

	let connection;
	try {
		if (password != confirm_password) {
			returnJson = { status: 'error', message: 'password and confirm_password not match', return: 1, data: {} };
			return;
		}
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
		const expirationTime = new Date();
		expirationTime.setMinutes(expirationTime.getMinutes() + 0);
		const formattedExpirationTime = `${expirationTime.getFullYear()}-${(expirationTime.getMonth() + 1)
			.toString()
			.padStart(2, '0')}-${expirationTime.getDate().toString().padStart(2, '0')} ${expirationTime
			.getHours()
			.toString()
			.padStart(2, '0')}:${expirationTime.getMinutes().toString().padStart(2, '0')}:${expirationTime
			.getSeconds()
			.toString()
			.padStart(2, '0')}`;
		const hashedPassword = await bcrypt.hash(password, 10);
		const sqlUpdate = 'UPDATE user SET password=? ,reset_token_expires=? WHERE email=?';
		const [updateResult] = await connection.query(sqlUpdate, [hashedPassword, formattedExpirationTime, email]);
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
router.post('/forgot_password', forgotPassword);
router.post('/forgot_password/change', [middlewareCheckOTP, changePasswordUser]);
export default router;
