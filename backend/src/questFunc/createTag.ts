import db from '../database/tempDatabase.js';

import mysql, { PoolConnection } from 'mysql';

import { Request, Response } from 'express';

export default async (req: Request, res: Response): Promise<void> => {
	const tag_name: string = req.body.tag_name;
	const tag_color: string = req.body.tag_color;
	const email: string = req.body.email;
	db.getConnection(async (err: NodeJS.ErrnoException | null, connection: PoolConnection) => {
		if (err) {
			console.log(err);
			res.json('Error connecting to database');
		}
		const sqlSearch = 'SELECT * FROM tag WHERE tag_name = ? and email = ?';
		const searchQuery = mysql.format(sqlSearch, [tag_name, email]);
		const sqlInsert = 'INSERT INTO tag (tag_name,tag_color,email) VALUES (?, ?, ?)';
		const insertQuery = mysql.format(sqlInsert, [tag_name, tag_color, email]);
		connection?.query(searchQuery, async (searchErr: Error, result: any) => {
			if (searchErr) {
				connection?.release();
				console.log(searchErr);
				res.json('Error connecting to database');
			} else {
				console.log('--------Search---------');
				console.log(result.length);

				if (result.length !== 0) {
					connection?.release();
					console.log('--------This tag name has been used---------');
					res.json('This tag name has been used');
				} else {
					await connection?.query(insertQuery, async (insertErr: Error, insertResult: any) => {
						if (insertErr) {
							connection?.release();
							console.log('Error inserting the tag.');
							res.json('Error inserting the tag');
						} else {
							console.log('--------Inserting---------');

							connection?.release();

							const tag_id = insertResult.insertId;
							console.log(tag_id);
							res.json({ message: 'tag created', tag_id: tag_id });
						}
						// return res.redirect('/login');
					});
				}
			}
		});
	});
};
