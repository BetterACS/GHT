import db from '../database/tempDatabase.js';

import mysql, { PoolConnection } from 'mysql';

import { Request, Response } from 'express';

export default async (req: Request, res: Response): Promise<void> => {
	const { quest_id } = req.body;

	db.getConnection(async (err: NodeJS.ErrnoException | null, connection: PoolConnection) => {
		if (err) {
			console.log(err);
			res.json('Error connecting to database');
		} else {
			const sqlSearch = 'SELECT * FROM quest WHERE quest_id = ?';
			const searchQuery = mysql.format(sqlSearch, [quest_id]);
			const sqlDelete = 'delete from quest where quest_id = ?';
			const Delete = mysql.format(sqlDelete, [quest_id]);
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
						console.log('--------This quest name does not exist---------');
						res.json('This quest name does not exist');
					} else {
						await connection?.query(Delete, async (deleteErr: Error, deleteResult: any) => {
							if (deleteErr) {
								connection?.release();
								console.log('Error delete the quest', deleteErr);
								res.json('Error delete the quest');
							} else {
								console.log('--------deleting---------');

								connection?.release();

								res.json({ message: 'quest deleted' });
							}
							// return res.redirect('/login');
						});
					}
				}
			});
		}
	});
};
