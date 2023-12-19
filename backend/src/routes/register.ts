import bcrypt from 'bcrypt';
import express, { Request, Response } from 'express';
import fs from 'fs';
import Database from '../database/database.js';
import { userStoragesModel } from '../database/models.js';
import generateUniqueToken from '../utils/generateUniqueToken.js';
import { returnInterface, userInterface } from '../utils/interfaces.js';
import Logger from '../utils/logger.js';
import { sendVerification } from '../utils/sendVerification.js';

const filePath = '../frontend/src/assets/sample.txt';
let fileContentString: string;
try {
	const fileContent = fs.readFileSync(filePath, 'utf-8');
	fileContentString = fileContent.toString();
} catch (error) {
	console.error('Error reading file:', error);
}

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
		const sqlInsert = `INSERT INTO user (email, username, password,verification_token,verification_token_expires) VALUES (?, ?, ?,?,?)`;
		const hashedPassword: string = await bcrypt.hash(req.body.password, 10);
		const verificationToken = generateUniqueToken();
		const expirationTime = new Date();
		expirationTime.setHours(expirationTime.getHours() + 1);

		connection = await database.promise().getConnection();
		const [rows] = await connection.query(sqlSearch, [
			email,
			username,
			hashedPassword,
			verificationToken,
			expirationTime,
		]);
		let user = rows as userInterface[];
		if (user.length !== 0) {
			if (user[0].is_verified == true) {
				logger.error('This email has been used');
				returnJson = { status: 'error', message: 'This email has been used', return: 2, data: {} };
				return;
			} else {
				logger.error('This email has been used but not verified');
				returnJson = {
					status: 'error',
					message: 'This email has been used but not verified',
					return: 4,
					data: {},
				};
				return;
			}
		}

		// send verification email
		sendVerification(email, verificationToken);
		await connection.query(sqlInsert, [email, username, hashedPassword, verificationToken, expirationTime]);

		await userStoragesModel.create({ email: email, inventory: {}, field: {}, image: fileContentString });

		returnJson = { status: 'success', message: 'Register Successful', return: 0, data: {} };
	} catch (error) {
		returnJson = { status: 'error', message: 'Error searching for the email.', return: 3, data: { error: error } };
	} finally {
		if (connection) {
			connection.release();
		}
		res.json(returnJson);
	}
};

const verifyAccount = async (req: Request, res: Response): Promise<void> => {
	const { token, email }: { token: string; email: string } = req.query as { token: string; email: string };

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
		const sqlSearch = 'SELECT * FROM user WHERE verification_token=?';
		const [rows] = await connection.query(sqlSearch, [token]);
		let user = rows as userInterface[];
		if (user.length === 0) {
			logger.error('--------This token not found maybe it has change already---------');
			returnJson = {
				status: 'error',
				message: 'This token not found maybe it has change already.',
				return: 3,
				data: {},
			};
			return;
		}
		if (user[0].is_verified == true) {
			logger.error('--------This user has been verified---------');
			returnJson = { status: 'error', message: 'This user has been verified.', return: 4, data: {} };
			return;
		} else if (user[0].verification_token_expires < new Date()) {
			logger.error('--------This token has expired.Then send new email.---------');
			returnJson = {
				status: 'error',
				message: 'This token has expired.Then send new email',
				return: 5,
				data: {},
			};
			const verificationToken = generateUniqueToken();
			const expirationTime = new Date();
			expirationTime.setHours(expirationTime.getHours() + 1);
			const sqlUpdate = 'UPDATE user SET verification_token=?,verification_token_expires=? WHERE email=?';
			const [update] = await connection.query(sqlUpdate, [verificationToken, expirationTime, email]);
			sendVerification(email, verificationToken);

			return;
		}

		const sqlUpdate = 'UPDATE user SET is_verified=true WHERE email=?';
		const [updateResult] = await connection.query(sqlUpdate, [email]);

		returnJson = { status: 'success', message: '', return: 0, data: {} };
	} catch (error) {
		returnJson = {
			status: 'error',
			message: "Error adjust for the user. perhap user id doesn't not exist",
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

router.post('/register', storeUser);
router.get('/verify', verifyAccount);
export default router;
