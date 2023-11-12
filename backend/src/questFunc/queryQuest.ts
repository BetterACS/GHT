// import db from '../database/tempDatabase.js';

// import mysql, { PoolConnection } from 'mysql2';

// import { Request, Response } from 'express';

// export default async (req: Request, res: Response): Promise<void> => {
// 	// quest_id อาจจะเก็บไว้ที่ localStorage หลังสร้าง แต่ไม่รู้ว่าจะส่งมาถูกตัวยังไง
// 	const quest_id: number = req.body.quest_id;

// 	db.getConnection(async (err: NodeJS.ErrnoException | null, connection: PoolConnection) => {
// 		if (err) {
// 			console.log(err);
// 			res.json('Error connecting to database');
// 		}

// 		const sqlSearch = 'SELECT * FROM quest WHERE quest_id = ?';

// 		const searchQuery = mysql.format(sqlSearch, [quest_id]);

// 		connection?.query(searchQuery, async (searchErr: Error, result: any) => {
// 			if (searchErr) {
// 				connection?.release();
// 				console.log(searchErr);
// 				res.json('Error connecting to database');
// 			}

// 			console.log('--------Search---------');
// 			console.log(result.length);

// 			if (result.length === 1) {
// 				const quest_name = result[0].quest_name;
// 				const description = result[0].description;
// 				const start_date = result[0].start_date;
// 				const due_date = result[0].due_date;
// 				const item_id = result[0].item_id;
// 				// const email = result[0].email;
// 				res.json({
// 					quest_name: quest_name,
// 					description: description,
// 					start_date: start_date,
// 					due_date: due_date,
// 					item_id: item_id,
// 				});
// 				connection?.release();
// 			} else {
// 				res.json('Fail to query tag');
// 			}
// 		});
// 	});
// };
