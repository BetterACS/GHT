import db from '../database/tempDatabase.js';

import mysql, { PoolConnection } from 'mysql';

import { Request, Response } from 'express';

export default async (req: Request, res: Response): Promise<void> => {
	const { habit_id } = req.body;

	db.getConnection(async (err: NodeJS.ErrnoException | null, connection: PoolConnection) => {
		if (err) {
			console.log(err);
			res.json('Error connecting to database');
		} else {
			const sqlSearch = 'SELECT * FROM habit WHERE habit_id = ?';
			const searchQuery = mysql.format(sqlSearch, [habit_id]);
			const sqlDelete = 'delete from habit where habit_id = ?';
			const Delete = mysql.format(sqlDelete, [habit_id]);
			connection?.query(searchQuery, async (searchErr: Error, result: any) => {
				if (searchErr) {
					connection?.release();
					console.log(searchErr);
					res.json('Error connecting to database');
				} else {
					console.log('--------Search---------');
					console.log(result.length);

					if (result.length === 0) {
						connection?.release();
						console.log('--------This habit name does not exist---------');
						res.json('This habit name does not exist');
					} else {
						await connection?.query(Delete, async (deleteErr: Error, deleteResult: any) => {
							if (deleteErr) {
								connection?.release();
								console.log('Error delete the habit', deleteErr);
								res.json('Error delete the habit');
							} else {
								console.log('--------deleting---------');

								connection?.release();

								res.json({ message: 'habit deleted' });
							}
							// return res.redirect('/login');
						});
					}
				}
			});
		}
	});
};
