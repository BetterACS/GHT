import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { Config } from "./config.js";
import cors from "cors";
import bodyParser from 'body-parser';



//#region Routes imports
// import { home_route } from "./routes/home.js";
// import { monster_route } from "./routes/monster.js";
// app.use(home_route);
// app.use(quest_route);
// app.use(monster_route);


//controller zone
import storeUser from "./controller/storeUser.js"
import loginAuth from "./controller/loginAuth.js"
import {
  generateAccessToken,
  generateRefreshToken,
  continueToken,
  logout
} from './controller/tokenController.js';

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
dotenv.config();


//connect
app.post("/register",storeUser)
app.post("/login",loginAuth)
app.delete("logout",logout)



app.listen(Config.PORT, () => {
  console.log(`[Server] Listening on port ${Config.PORT}`);
  console.log(`[Server] Running on http://localhost:${Config.PORT}`);
});
