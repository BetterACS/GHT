import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { Config } from "./config.js";

//#region Routes imports
import { home_route } from "./routes/home.js";
import { quest_route } from "./routes/quest.js";
//#endregion

const app = express();

// Initialize all routes.
app.use(home_route);
app.use(quest_route);

dotenv.config();

app.listen(Config.PORT, () => {
  console.log(`[Server] Listening on port ${Config.PORT}`);
  console.log(`[Server] Running on http://localhost:${Config.PORT}`);
});
