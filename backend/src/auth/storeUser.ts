import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import Database from '../database/database.js';
import { userInterface } from '../utils/interfaces.js';
import Logger from '../utils/logger.js';

export default async (req: Request, res: Response): Promise<void> => {
	const email: string = req.body.email;
	const username: string = req.body.username;
	let database = Database.instance().mySQL();

	const sqlSearch = 'SELECT * FROM user WHERE email = ?';
	const sqlInsert = `INSERT INTO user (email, username, password) VALUES (?, ?, ?)`;

	const hashedPassword: string = await bcrypt.hash(req.body.password, 10);
	const logger = Logger.instance().logger();

	database.query(sqlSearch, [email, username, hashedPassword], async (searchError, results, fields) => {
		if (searchError) {
			logger.error(searchError);

			res.json({
				status: 'error',
				message: 'Error searching for the email.',
				return: 1,
			});
		}
		let user = results as userInterface[];

		if (user.length !== 0) {
			logger.error('This email has been used');
			res.json({
				status: 'error',
				message: 'This email has been used',
				return: 2,
			});
		}
		logger.info('Inserting the user');
	});

	Database.instance()
		.mySQL()
		.query(sqlInsert, [email, username, hashedPassword], function (err, results, fields) {
			if (err) {
				console.log(err);
			}
			console.log(results); // results contains rows returned by server
			console.log(fields); // fields contains extra meta data about results, if available
		});
	res.json({ status: 'ok', message: 'Register successful', return: 0 });
};
