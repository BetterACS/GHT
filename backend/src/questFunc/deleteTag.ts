//ยังไม่เสร็จ
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
			const sqlDelete = 'delete from tag where tag_id = ?';
			const Delete = mysql.format(sqlDelete, [tag_id]);
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
						console.log('--------This tag name does not exist---------');
						res.json('This tag name does not exist');
					} else {
						await connection?.query(Delete, async (deleteErr: Error, deleteResult: any) => {
							if (deleteErr) {
								connection?.release();
								console.log('Error delete the tag');
								res.json('Error delete the tag');
							} else {
								console.log('--------deleting---------');

								connection?.release();

								res.json({ message: 'tag deleted' });
							}
							// return res.redirect('/login');
						});
					}
				}
			});
		}
	});
};
