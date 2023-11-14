import db from '../database/tempDatabase.js';

import mysql, { PoolConnection } from 'mysql';

import { Request, Response } from 'express';

export default async (req: Request, res: Response): Promise<void> => {
	//การจะใส่ได้ต้องมีข้อมูลอยู่ใน table tag & table quest ก่อน
	const { tag_id, quest_id } = req.body;

	db.getConnection(async (err: Error, connection: PoolConnection | undefined) => {
		if (err) {
			console.log(err);
			res.json('Error connecting to database');
		} else {
			const sqlInsert = 'INSERT INTO contain (tag_id,quest_id) VALUES (?, ?)';

			const insertQuery = mysql.format(sqlInsert, [tag_id, quest_id]);

			await connection?.query(insertQuery, async (insertErr: Error, insertResult: any) => {
				if (insertErr) {
					connection?.release();

					console.log(insertErr);
					res.json('Error inserting the quest. Perhap the tag name or quest id is not exist');
				} else {
					console.log('--------Inserting---------');

					connection?.release();
					const contain_id = insertResult.insertId;
					console.log(contain_id);
					res.json({ message: 'labelQuest success', contain_id: contain_id });
				}
				// return res.redirect('/login');
			});
		}
	});
};
