// import db from '../database/tempDatabase.js';

// import mysql, { PoolConnection } from 'mysql2';

// import { Request, Response } from 'express';

// export default async (req: Request, res: Response): Promise<void> => {
// 	const tag_name: string = req.body.tag_name;

// 	const tag_color: string = req.body.tag_color;

// 	const email: string = req.body.email;

// 	db.getConnection(async (err: NodeJS.ErrnoException | null, connection: PoolConnection) => {
// 		if (err) {
// 			console.log(err);
// 			res.json('Error connecting to database');
// 		}

// 		const sqlSearch = 'SELECT * FROM tag WHERE tag_name = ?';

// 		const searchQuery = mysql.format(sqlSearch, [tag_name]);

// 		const sqlInsert = 'INSERT INTO tag (tag_name,tag_color,email) VALUES (?, ?, ?)';

// 		const insertQuery = mysql.format(sqlInsert, [tag_name, tag_color, email]);

// 		connection?.query(searchQuery, async (searchErr: Error, result: any) => {
// 			if (searchErr) {
// 				connection?.release();
// 				console.log(searchErr);
// 				res.json('Error connecting to database');
// 			}

// 			console.log('--------Search---------');
// 			console.log(result.length);

// 			if (result.length !== 0) {
// 				connection?.release();

// 				console.log('--------This tag name has been used---------');

// 				//   req.flash('error', 'This email has been used.');
// 				res.json('This tag name has been used');
// 				//   return res.redirect('/register');
// 			} else {
// 				await connection?.query(insertQuery, async (insertErr: Error, insertResult: any) => {
// 					if (insertErr) {
// 						connection?.release();

// 						console.log('Error inserting the tag.');
// 						res.json('Error inserting the tag');
// 					}

// 					console.log('--------Inserting---------');

// 					connection?.release();

// 					console.log(insertResult.insertId);
// 					res.json('Tag created');
// 					// return res.redirect('/login');
// 				});
// 			}
// 		});
// 	});
// };
