import db from '../database/tempDatabase.js';

import mysql, { PoolConnection } from 'mysql';

import { Request, Response } from 'express';

export default async (req: Request, res: Response): Promise<void> => {
	const { tag_id } = req.body;

	db.getConnection(async (err: NodeJS.ErrnoException | null, connection: PoolConnection) => {
		if (err) {
			console.log(err);
			res.json('Error connecting to database');
		} else {
			const sqlSearch = 'SELECT * FROM tag WHERE tag_id = ?';

			const searchQuery = mysql.format(sqlSearch, [tag_id]);

			connection?.query(searchQuery, async (searchErr: Error, result: any) => {
				if (searchErr) {
					connection?.release();
					console.log(searchErr);
					res.json('Error connecting to database');
				} else {
					console.log('--------Search---------');
					console.log(result.length);

					if (result.length === 1) {
						const tag_id = result[0].tag_id;
						const tag_name = result[0].tag_name;
						const tag_color = result[0].tag_color;
						const email = result[0].email;
						res.json({ tag_id: tag_id, tag_name: tag_name, tag_color: tag_color, email: email });
						connection?.release();
					} else {
						res.json('Fail to query tag');
					}
				}
			});
		}
	});
};
