// import { Request, Response } from 'express';
// import mysql, { PoolConnection } from 'mysql2';
// import db from '../database/tempDatabase.js';

// export default async (req: Request, res: Response): Promise<void> => {
// 	//old_tag_name อาจจะได้จากการใช้ queryTag.js ก่อนหน้านี้ แล้วให้ frontend ส่งมาใน body
// 	//ส่วน tag_color อาจจะใช้ทับจาก <form> ได้เลย
// 	const { old_tag_name, new_tag_name, tag_color } = req.body;

// 	db.getConnection(async (err: NodeJS.ErrnoException | null, connection: PoolConnection) => {
// 		if (err) {
// 			console.log(err);
// 			res.json('Error connecting to the database');
// 		}

// 		const sqlUpdate = 'UPDATE tag SET tag_name=?,tag_color=? WHERE tag_name=?';

// 		const updateQuery = mysql.format(sqlUpdate, [new_tag_name, tag_color, old_tag_name]);

// 		await connection?.query(updateQuery, async (updateErr: Error, updateResult: any) => {
// 			if (updateErr) {
// 				connection?.release();
// 				console.log('Error updating the tag.');
// 				res.json('Error updating the tag');
// 			}

// 			console.log('--------Updating---------');

// 			connection?.release();

// 			console.log(updateResult.affectedRows);
// 			res.json('Tag adjusted');
// 		});
// 	});
// };
