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
import contain_table_route from './routes/contain_table.js';
import filter_route from './routes/filter.js';
import habit_route from './routes/habit.js';
import home_route from './routes/home.js';
import login_route from './routes/login.js';
import monster_route from './routes/monster.js';
import quest_route from './routes/quest.js';
import register_route from './routes/register.js';
import tag_route from './routes/tag.js';
//#endregion

dotenv.config();
// Initialize all singletons.
Scheduler.instance();
Database.instance();

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//#region Routes
app.use(home_route);
app.use(monster_route);
app.use(tag_route);
app.use(login_route);
app.use(register_route);
app.use(quest_route);
app.use(habit_route);
app.use(contain_table_route);
app.use(filter_route);
//#endregion

const logger = Logger.instance().logger();

// Start the Express.js server and log the listening message
app.listen(Config.BACKEND_PORT, () => {
	logger.info(`[index]:listen - Listening on port ${Config.BACKEND_PORT}`);
	logger.info(`[index]:listen - Running on http://localhost:${Config.BACKEND_PORT}`);
}).on('error', (error: Error) => {
	logger.error(`[index]:listen - Error: ${error.message}`);
});
