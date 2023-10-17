import express, { Request, Response } from "express";
import { Database } from "../database/database.js";

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

export { router as monster_route };
