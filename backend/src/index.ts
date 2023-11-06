//#region Imports
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import Config from './config.js';
import Database from './database/database.js';
import Logger from './utils/logger.js';
import Scheduler from './utils/scheduler.js';
//#endregion

//#region Routes imports
// import home_route from './routes/home.js';
// import monster_route from './routes/monster.js';
//#endregion

dotenv.config();
// Initialize all singletons.
Scheduler.instance();
Database.instance();

//#region controller zone
import loginAuth from './auth/loginAuth.js';
import storeUser from './auth/storeUser.js';
import { logout } from './auth/tokenController.js';
//#endregion

const app = express();
app.use(express.json());
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Initialize all routes.
app.post('/register', storeUser);
app.post('/login', loginAuth);
app.delete('logout', logout);
// app.use(home_route);
// app.use(monster_route);

const logger = Logger.instance().logger();

// Start the Express.js server and log the listening message
app.listen(Config.BACKEND_PORT, () => {
	logger.info(`[index]:listen - Listening on port ${Config.BACKEND_PORT}`);
	logger.info(`[index]:listen - Running on http://localhost:${Config.BACKEND_PORT}`);
}).on('error', (error: Error) => {
	logger.error(`[index]:listen - Error: ${error.message}`);
});
