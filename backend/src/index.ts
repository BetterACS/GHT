import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Logger from "./utils/logger.js";

import Config from "./config.js";
import Scheduler from "./utils/scheduler.js";
import Database from "./database/database.js";

//#region Routes imports
import home_route from "./routes/home.js";
import monster_route from "./routes/monster.js";
//#endregion

import bodyParser from 'body-parser';

// app.use(home_route);
// app.use(quest_route);
// app.use(monster_route);


//controller zone
import storeUser from "./controller/storeUser.js"
import loginAuth from "./controller/loginAuth.js"
import { logout } from './controller/tokenController.js';

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
dotenv.config();


//connect
app.post("/register",storeUser)
app.post("/login",loginAuth)
app.delete("logout",logout)


// Initialize all routes.
// app.use(home_route);
// app.use(monster_route);

// Initialize all singletons.
Scheduler.instance();
Database.instance();

dotenv.config();

const logger = Logger.instance().logger();

// Start the Express.js server and log the listening message
app
  .listen(Config.PORT, () => {
    logger.info(`[index]:listen - Listening on port ${Config.PORT}`);
    logger.info(`[index]:listen - Running on http://localhost:${Config.PORT}`);
  })
  .on("error", (error: Error) => {
    logger.error(`[index]:listen - Error: ${error.message}`);
  });
