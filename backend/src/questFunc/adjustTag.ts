import { Request, Response } from 'express';
import mysql, { PoolConnection } from 'mysql';
import db from '../database/tempDatabase.js';

export default async (req: Request, res: Response): Promise<void> => {
	const { tag_id, tag_name, tag_color } = req.body;

	db.getConnection(async (err: NodeJS.ErrnoException | null, connection: PoolConnection) => {
		if (err) {
			console.log(err);
			res.json('Error connecting to the database');
		}
		const sqlSearch = 'SELECT * FROM tag WHERE tag_id = ?';

		const checkQuery = mysql.format(sqlSearch, [tag_id]);

		const sqlUpdate = 'UPDATE tag SET tag_name=?, tag_color=? WHERE tag_id=?';

		const updateQuery = mysql.format(sqlUpdate, [tag_name, tag_color, tag_id]);
		connection?.query(checkQuery, async (searchErr: Error, result: any) => {
			if (searchErr) {
				connection?.release();
				console.log(searchErr);
				res.json('Error connecting to database');
			} else {
				console.log('--------Search---------');
				console.log(result.length);

				if (result.length === 0) {
					connection?.release();
					console.log('--------This tag name not exist---------');
					res.json('This tag name not exist');
				} else {
					await connection?.query(updateQuery, async (updateErr: Error, updateResult: any) => {
						if (updateErr) {
							connection?.release();
							console.log('Error updating the tag perhap email does not exist.');
							res.json('Error updating the tag perhap email does not exist');
						} else {
							console.log('--------Updating---------');

							connection?.release();

							console.log(updateResult.affectedRows);
							res.json('Tag adjusted');
						}
					});
				}
			}
		});
	});
};
