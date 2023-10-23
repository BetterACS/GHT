import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { Config } from "./config.js";
import cors from "cors";
import { Scheduler } from "./utils/scheduler.js";

//#region Routes imports
import { home_route } from "./routes/home.js";
// import { quest_route } from "./routes/quest.js";
import { monster_route } from "./routes/monster.js";
//#endregion

const app = express();

app.use(express.json());
app.use(cors());
// Initialize all routes.
app.use(home_route);
// app.use(quest_route);
app.use(monster_route);

Scheduler.instance();

dotenv.config();

app.listen(Config.PORT, () => {
  console.log(`[Server] Listening on port ${Config.PORT}`);
  console.log(`[Server] Running on http://localhost:${Config.PORT}`);
});
