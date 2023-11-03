import bcrypt from 'bcrypt';
import { Request, Response } from 'express'; // Assuming you are using Express
import db from "../database/sqlDatabase.js"
import mysql, { PoolConnection } from 'mysql';
import {
  generateAccessToken,
  generateRefreshToken,
  continueToken,
  logout
} from './tokenController.js';



export default (req: Request, res: Response): void => {
  const { email, password } = req.body;

  db.getConnection(async (err: Error, connection: PoolConnection | undefined) => {
    if (err) {
    //   req.flash('error', 'Error connecting to the database.');
        console.log("Error connecting to the database")
        res.json("Error connecting to the database")
        // return res.redirect('/login');
    }
    if (!email) {
    //   req.flash('error', 'Please enter the email.');
        res.json("Please enter the email.")
    //   return res.redirect('/login');
    }
    const sqlSearch = 'SELECT * FROM user WHERE email = ?';
    const searchQuery = mysql.format(sqlSearch, [email]);

    connection?.query(searchQuery, async (searchErr: Error, result: any) => {
      if (searchErr) {
        // req.flash('error', 'Error searching for the email.');
        // req.flash('data', req.body);
        connection?.release();
        res.json("Error searching for the email.")
        // return res.redirect('/login');
      }

      if (result.length === 0) {
        connection?.release();
        console.log('--------This email not exist in the database---------');
        // req.flash('error', 'This email does not exist in the database.');
        // return res.redirect('/login');
        res.json('This email does not exist in the database.')
      } else {
        const hashedPassword = result[0].password;
        if (await bcrypt.compare(password, hashedPassword)) {
          console.log('---------> Login Successful');
        //   console.log('---------> Generating accessToken');
          // const token = generateAccessToken({ email });
          // console.log(token);
          // res.json({ accessToken: token });
        //   return res.redirect('/');
        const accessToken = generateAccessToken({ user: req.body.email })
        const refreshToken = generateRefreshToken({ user: req.body.email })
        res.json({ accessToken: accessToken, refreshToken: refreshToken })
        } else {
          connection?.release();
          console.log('--------Incorrect password---------');
        //   req.flash('error', 'Incorrect password');
        //   req.flash('data', email);
        //   return res.redirect('/login');
          res.json("Incorrect password")
        }
      }
    });
  });
};