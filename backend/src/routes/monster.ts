/**
 * @file monster.ts
 * @description This file contains all the routes for the monster.
 */
import express, { Request, Response } from "express";
import MonsterModel from "../database/model/monster.js";
import Controller from "./deliver.js";

const router = express.Router();

router.get("/monster", (request: Request, response: Response) => {
  /**
   * This route will random json data for a monster.
   */

  response.send([Controller.instance().getCurrentMonster()]);
});

router.post("/monster", async (request: Request, response: Response) => {
  /**
   * This route will random json data for a monster.
   */

  let json = request.body;
  let monster = new MonsterModel(json);
  const results = await monster.save();
  response.json({ count: 1, data: results });
});

export default router;
