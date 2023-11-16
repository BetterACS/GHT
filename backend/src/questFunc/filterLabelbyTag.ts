import db from '../database/tempDatabase.js';

import mysql, { PoolConnection } from 'mysql';

import { Request, Response } from 'express';
export default async (req: Request, res: Response): Promise<void> => {
	const { tag_id } = req.body;

	db.getConnection(async (err: NodeJS.ErrnoException | null, connection: PoolConnection) => {
		if (err) {
			console.log(err);
			res.json('Error connecting to the database');
		} else {
			const sqlSearch = 'SELECT * FROM contain WHERE tag_id = ?';
			const searchQuery = mysql.format(sqlSearch, [tag_id]);

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
							contain_id: row.contain_id,
							tag_id: row.tag_id,
							quest_id: row.quest_id,
						}));

						res.json(data);
					} else {
						res.json('No data found for the given tag_id');
					}

					connection?.release();
				}
			});
		}
	});
};
