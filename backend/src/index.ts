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
import monster_route from './routes/monster.js';
//#endregion

dotenv.config();
// Initialize all singletons.
Scheduler.instance();
Database.instance();

//#region controller zone
import loginAuth from './auth/loginAuth.js';
import storeUser from './auth/storeUser.js';
import { logout } from './auth/tokenController.js';
import adjustHabit from './questFunc/adjustHabit.js';
import adjustQuest from './questFunc/adjustQuest.js';
import adjustTag from './questFunc/adjustTag.js';
import createHabit from './questFunc/createHabit.js';
import createQuest from './questFunc/createQuest.js';
import createTag from './questFunc/createTag.js';
import deleteHabit from './questFunc/deleteHabit.js';
import deleteLabel from './questFunc/deleteLabel.js';
import deleteQuest from './questFunc/deleteQuest.js';
import deleteTag from './questFunc/deleteTag.js';
import filterByDueDateASC from './questFunc/filterByDueDateASC.js';
import filterLabelbyTag from './questFunc/filterLabelbyTag.js';
import labelQuest from './questFunc/labelQuest.js';
import queryContain from './questFunc/queryContain.js';
import queryHabit from './questFunc/queryHabit.js';
import queryQuest from './questFunc/queryQuest.js';
import queryTag from './questFunc/queryTag.js';
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
//questZone
app.post('/createTag', createTag);
app.post('/createQuest', createQuest);
app.get('/getQuest', queryQuest);
app.get('/getTag', queryTag);
app.put('/adjustQuest', adjustQuest);
app.put('/adjustTag', adjustTag);
app.post('/labelQuest', labelQuest);
app.delete('/deleteLabel', deleteLabel);
app.delete('/deleteTag', deleteTag);
app.delete('/deleteQuest', deleteQuest);
app.get('/filterLabelbyTag', filterLabelbyTag);
app.get('/filterByDueDateASC', filterByDueDateASC);
app.get('/queryHabit', queryHabit);
app.post('/createHabit', createHabit);
app.put('/adjustHabit', adjustHabit);
app.delete('/deleteHabit', deleteHabit);
app.get('/queryContain', queryContain);
// app.use(home_route);
app.use(monster_route);

const logger = Logger.instance().logger();

// Start the Express.js server and log the listening message
app.listen(Config.BACKEND_PORT, () => {
	logger.info(`[index]:listen - Listening on port ${Config.BACKEND_PORT}`);
	logger.info(`[index]:listen - Running on http://localhost:${Config.BACKEND_PORT}`);
}).on('error', (error: Error) => {
	logger.error(`[index]:listen - Error: ${error.message}`);
});
