/**
 * @file index.ts
 * @description The main entry point of the application.
 * This file is responsible for initializing all the singletons and routes.
 * @workflow
 * 1. Initialize all routes from ./routes folder.
 * 2. Initialize all singletons.
 * 3. Start the server. (Listening on port on Config.PORT)
 */

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import Config from "./config.js";
import Scheduler from "./utils/scheduler.js";
import Database from "./database/database.js";

//#region Routes imports
import home_route from "./routes/home.js";
import monster_route from "./routes/monster.js";
//#endregion

const app = express();

app.use(express.json());
app.use(cors());

// Initialize all routes.
app.use(home_route);
app.use(monster_route);

// Initialize all singletons.
Scheduler.instance();
Database.instance();

dotenv.config();

app.listen(Config.PORT, () => {
  console.log(`[Server] Listening on port ${Config.PORT}`);
  console.log(`[Server] Running on http://localhost:${Config.PORT}`);
});
