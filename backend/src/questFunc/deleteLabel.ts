import db from '../database/tempDatabase.js';

import mysql, { PoolConnection } from 'mysql';

import { Request, Response } from 'express';

export default async (req: Request, res: Response): Promise<void> => {
	const { contain_id } = req.body;

	db.getConnection(async (err: Error, connection: PoolConnection | undefined) => {
		if (err) {
			console.log(err);
			res.json('Error connecting to database');
		} else {
			const sqlQuery = 'SELECT * FROM contain WHERE contain_id = ?';
			const searchQuery = mysql.format(sqlQuery, [contain_id]);
			const sqlDelete = 'delete from contain where contain_id = ?';
			const Delete = mysql.format(sqlDelete, [contain_id]);
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
						console.log("--------This contain id doesn't exist---------");
						res.json("This contain id doesn't exist");
					} else {
						await connection?.query(Delete, async (deleteERR: Error, deleteResult: any) => {
							if (deleteERR) {
								connection?.release();

								console.log(deleteERR);
								res.json('Error delete the quest');
							} else {
								console.log('--------delete successful---------');

								connection?.release();

								res.json('delete label success');
							}
							// return res.redirect('/login');
						});
					}
				}
			});
		}
	});
};
