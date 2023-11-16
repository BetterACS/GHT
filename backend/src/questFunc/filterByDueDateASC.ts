import db from '../database/tempDatabase.js';

import mysql, { PoolConnection } from 'mysql';

import { Request, Response } from 'express';
export default async (req: Request, res: Response): Promise<void> => {
	const { email } = req.body;

	db.getConnection(async (err: NodeJS.ErrnoException | null, connection: PoolConnection) => {
		if (err) {
			console.log(err);
			res.json('Error connecting to the database');
		} else {
			const sqlSearch = 'SELECT * FROM quest WHERE email = ? order by due_date ASC';
			const searchQuery = mysql.format(sqlSearch, [email]);

			connection?.query(searchQuery, async (searchErr: Error, result: any) => {
				if (searchErr) {
					connection?.release();
					console.log(searchErr);
					res.json('Error executing the query');
				} else {
					console.log('--------Search---------');
					console.log(result.length);

					if (result.length !== 0) {
						const data = result.map((row: any) => ({
							quest_id: row.quest_id,
							quest_name: row.quest_name,
							description: row.description,
							due_date: row.due_date,
							item_id: row.item_id,
							email: row.email,
						}));

						res.json(data);
					} else {
						res.json('No data found for the given quest_id');
					}

					connection?.release();
				}
			});
		}
	});
};
