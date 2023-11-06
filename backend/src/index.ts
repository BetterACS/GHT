//#region Imports
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import { validateTokenMiddleware } from './auth/validateToken.js';
import Config from './config.js';
import Database from './database/database.js';
import Deliver from './routes/deliver.js';
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
app.get('/monster', validateTokenMiddleware, async (request: Request, response: Response) => {
	/**
	 * This route will random json data for a monster.
	 */
	// const headers = {
	// authorization: request.body.headers['authorization'],
	// refreshToken: request.body.headers['refreshToken'],
	// email: request.headers['email'],
	// };
	// console.log('headers: ', request.body);

	// // if (headers.refreshToken === undefined) {
	// // 	console.log('No refresh token in here.');
	// // 	response.send({ status: 'error', message: 'Token not present.', return: 1 });
	// // }
	// const headers = {};
	// try {
	// 	const results = await axios.post('http://localhost:5001/validator', { headers });
	// 	const result = results.data as returnInterface;

	// 	if (result.return == 1) {
	// 	}
	// 	response.send({ status: 'error', message: 'Fuck u bitch' });
	// } catch (error) {
	// 	console.log(error);
	// }

	console.log('pass');
	response.json([Deliver.instance().getCurrentMonster()]);
});

const logger = Logger.instance().logger();

// Start the Express.js server and log the listening message
app.listen(Config.BACKEND_PORT, () => {
	logger.info(`[index]:listen - Listening on port ${Config.BACKEND_PORT}`);
	logger.info(`[index]:listen - Running on http://localhost:${Config.BACKEND_PORT}`);
}).on('error', (error: Error) => {
	logger.error(`[index]:listen - Error: ${error.message}`);
});
