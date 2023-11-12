import db from '../database/tempDatabase.js';

import mysql, { PoolConnection } from 'mysql';

import { Request, Response } from 'express';

export default async (req: Request, res: Response): Promise<void> => {
	const { quest_name, description, due_date, item_id, email } = req.body;

	db.getConnection(async (err: Error, connection: PoolConnection | undefined) => {
		if (err) {
			console.log(err);
			res.json('Error connecting to database');
		}
		//ตอนสร้าง quest ตัว id มัน auto increment ให้เอง ไม่ต้องใส่ เลยคิดว่าไม่รู้จะเก็บ quest_id ออกมายังไง
		const sqlInsert =
			'INSERT INTO quest (qeust_name, description, due_date, item_id, email) VALUES (?, ?, ?, ?, ?)';

		const insertQuery = mysql.format(sqlInsert, [quest_name, description, due_date, item_id, email]);

		await connection?.query(insertQuery, async (insertErr: Error, insertResult: any) => {
			if (insertErr) {
				connection?.release();

				console.log(insertErr);
				res.json('Error inserting the quest');
			} else {
				console.log('--------Inserting---------');

				connection?.release();

				console.log(insertResult.insertId);
				res.json('quest created');
			}
			// return res.redirect('/login');
		});
	});
};
