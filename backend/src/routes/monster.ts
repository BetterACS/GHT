import express, { Request, Response } from "express";
import { Database } from "../database/database.js";
import MonsterModel from "../database/model/monster.js";
const router = express.Router();

router.get("/monster", (request: Request, response: Response) => {
  /**
   * This route will random json data for a monster.
   */

  response.send([
    {
      id: 1,
      name: "Eleflame",
      element: "Fire",
      rarity: "Rare",
      tameable: true,
      tameRate: 0.15,
      favoriteFoods: ["Bamboo", "Bamboo Shoots", "Bamboo Leaves", "Grass"],
      dislikes: ["Water", "Rain", "Snow", "Ice", "Cold"],
    },
  ]);
});

router.post("/monster", async (request: Request, response: Response) => {
  /**
   * This route will random json data for a monster.
   */

  let json = request.body;
  let database = Database.instance().mongoDB();
  let monster = new MonsterModel(json);
  const results = await monster.save();
  response.json({ count: 1, data: results });
});

export { router as monster_route };
