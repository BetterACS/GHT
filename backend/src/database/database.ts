import dotenv from 'dotenv';
import mongoose from 'mongoose';
import mysql from 'mysql2';
import Logger from '../utils/logger.js';

dotenv.config();

export default class Database {
	private static INSTANCE: Database;
	private static mySQLConnection: mysql.Connection;
	private static mongoDBConnection: unknown;

	private constructor() {
		this.mySQLConnect();
		this.mongoDBConnect();
	}

	public static instance() {
		if (!Database.INSTANCE) {
			Database.INSTANCE = new Database();
		}
		return Database.INSTANCE;
	}

	private mySQLConnect() {
		const logger = Logger.instance().logger();
		// Create a connection to the database
		Database.mySQLConnection = mysql.createConnection({
			host: process.env.MYSQL_HOST,
			user: process.env.MYSQL_USER,
			password: process.env.MYSQL_PASSWORD,
			database: process.env.MYSQL_DATABASE,
		});
		// Attempt to connect to the database
		Database.mySQLConnection.connect((error: any) => {
			if (error) {
				logger.error('[database]:mySQLConnect - Failed to connect to mysql database');
				logger.error(error);
				return;
			}
			logger.info('[database]:mySQLConnect - Connected to database');
		});
	}

	private mongoDBConnect() {
		const logger = Logger.instance().logger();
		Database.mongoDBConnection = mongoose
			.connect(process.env.MONGODB_URI!)
			.then(() => {
				logger.info('[database]:mongoDBConnect - Connected to MongoDB');
			})
			.catch((error) => {
				logger.error('[database]:mongoDBConnect - Failed to connect to MongoDB');
				logger.error(error);
			});
	}

	public mongoDB() {
		return Database.mongoDBConnection;
	}

	public mySQL() {
		return Database.mySQLConnection;
	}
}
