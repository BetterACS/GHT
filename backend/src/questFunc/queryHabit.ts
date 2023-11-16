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

			connection?.query(searchQuery, async (searchErr: Error, result: any) => {
				if (searchErr) {
					connection?.release();
					console.log(searchErr);
					res.json('Error connecting to database');
				} else {
					console.log('--------Search---------');
					console.log(result.length);

					if (result.length === 1) {
						const habit_id = result[0].habit_id;
						const habit_name = result[0].habit_name;
						const description = result[0].description;
						const decrease_rate = result[0].decrease_rate;
						const value = result[0].value;
						const email = result[0].email;
						res.json({
							habit_id: habit_id,
							habit_name: habit_name,
							description: description,
							decrease_rate: decrease_rate,
							value: value,
							email: email,
						});
						connection?.release();
					} else {
						res.json('Fail to query habit');
					}
				}
			});
		}
	});
};
