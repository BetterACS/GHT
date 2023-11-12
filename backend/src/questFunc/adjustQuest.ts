// import { Request, Response } from 'express';
// import mysql, { PoolConnection } from 'mysql2';
// import db from '../database/tempDatabase.js';

// export default async (req: Request, res: Response): Promise<void> => {
// 	//quest_id ยังไม่รู้จะเก็บให้อยู่บน frontend ยังไง ส่วน quest_name, description, due_date, item_id, email อาจจะใช้ทับจาก <form> ได้เลย (defailt value ของ input ใน <form> ก็คือค่าเดิมที่ queryQuest.js ได้มา)
// 	const { quest_id, quest_name, description, due_date, item_id, email } = req.body;

// 	db.getConnection(async (err: NodeJS.ErrnoException | null, connection: PoolConnection) => {
// 		if (err) {
// 			console.log(err);
// 			res.json('Error connecting to the database');
// 		}

// 		const sqlUpdate =
// 			'UPDATE quest SET quest_name=?, description=?, due_date=?, item_id=?, email=? WHERE quest_id=?';

// 		const updateQuery = mysql.format(sqlUpdate, [quest_name, description, due_date, item_id, email, quest_id]);

// 		await connection?.query(updateQuery, async (updateErr: Error, updateResult: any) => {
// 			if (updateErr) {
// 				connection?.release();
// 				console.log('Error updating the quest.');
// 				res.json('Error updating the quest');
// 			}

// 			console.log('--------Updating---------');

// 			connection?.release();

// 			console.log(updateResult.affectedRows);
// 			res.json('Quest adjusted');
// 		});
// 	});
// };
