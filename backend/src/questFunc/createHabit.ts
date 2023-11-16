import db from '../database/tempDatabase.js';

import mysql, { PoolConnection } from 'mysql';

import { Request, Response } from 'express';

export default async (req: Request, res: Response): Promise<void> => {
	//ยังไม่แน่ใจเหมือนกันว่าจะทำยังไงให้ value ลดลงเองตาม rate ที่กำหนด
	const { habit_name, description, decrease_rate, value, email } = req.body;
	db.getConnection(async (err: NodeJS.ErrnoException | null, connection: PoolConnection) => {
		if (err) {
			console.log(err);
			res.json('Error connecting to database');
		}

		const sqlSearch = 'SELECT * FROM habit WHERE habit_name = ? and email = ?';
		const searchQuery = mysql.format(sqlSearch, [habit_name, email]);
		const sqlInsert =
			'INSERT INTO habit (habit_name, description, decrease_rate, value, email) VALUES (?, ?, ?, ?, ?)';
		const insertQuery = mysql.format(sqlInsert, [habit_name, description, decrease_rate, value, email]);
		connection?.query(searchQuery, async (searchErr: Error, result: any) => {
			if (searchErr) {
				connection?.release();
				console.log(searchErr);
				res.json('Error connecting to database. perhap email does not exist');
			} else {
				console.log('--------Search---------');
				console.log(result.length);
				// if don't want same habit name
				if (result.length !== 0) {
					connection?.release();
					console.log('--------This habit name has been used---------');
					res.json('This habit name has been used');
				} else {
					await connection?.query(insertQuery, async (insertErr: Error, insertResult: any) => {
						if (insertErr) {
							connection?.release();
							console.log('Error inserting the habit.');
							res.json('Error inserting the habit');
						} else {
							console.log('--------Inserting---------');

							connection?.release();

							const habit_id = insertResult.insertId;
							console.log(habit_id);
							res.json({ message: 'habit created', habit_id: habit_id });
						}
						// return res.redirect('/login');
					});
				}
			}
		});
	});
};
