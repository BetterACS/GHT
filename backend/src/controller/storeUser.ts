import bcrypt from 'bcrypt'
import db from "../database/sqlDatabase.js"
import mysql, { PoolConnection } from 'mysql'
import { Request, Response } from 'express';

export default async (req: Request, res: Response): Promise<void> => {
    const email: string = req.body.email;
    const username:string = req.body.username
    const hashedPassword: string = await bcrypt.hash(req.body.password, 10);
  
    db.getConnection(async (err: Error, connection: PoolConnection | undefined) => {
      if (err) {
        console.log(err)
      }
  
      const sqlSearch = 'SELECT * FROM user WHERE email = ?';
      const searchQuery = mysql.format(sqlSearch, [email]);
  
      const sqlInsert = 'INSERT INTO user (email, username,password) VALUES (?, ?, ?)';
      const insertQuery = mysql.format(sqlInsert, [email, username,hashedPassword]);
  
      connection?.query(searchQuery, async (searchErr: Error, result: any) => {
        if (searchErr) {
        //   req.flash('error', 'Error searching for the email.'); // Set an error flash message
        //   req.flash('data', req.body);
            connection?.release();
        //   return res.redirect('/register');
            console.log(searchErr)
        }
        console.log('--------Search---------');
        console.log(result.length);
  
        if (result.length !== 0) {
          connection?.release();
          console.log('--------This email has been used---------');
        //   req.flash('error', 'This email has been used.');
        //   return res.redirect('/register');
        } else {
          await connection?.query(insertQuery, async (insertErr: Error, insertResult: any) => {
            if (insertErr) {
            //   req.flash('error', 'Error inserting the user.'); // Set an error flash message
            //   req.flash('data', req.body);
              connection?.release();
              console.log('Error inserting the user.')
            //   return res.redirect('/register');
            }
            console.log('--------Inserting---------');
            connection?.release();
            console.log(insertResult.insertId);
            // return res.redirect('/login');
          });
        }
      });
    });
  };