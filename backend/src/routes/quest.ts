import express, { Request, Response } from "express";
import { Database } from "../database/database.js";

const router = express.Router();

router.get("/quest", (request: Request, response: Response) => {
  /**
   * This route will return all quests from the database.
   */

  // Singleton pattern.
  const database = Database.instance().get_connection();

  const query = "SELECT * FROM quests";
  // Query the database for all quests.
  database.query(query, (error, results) => {
    if (error) {
      response.json({ error: error });
      return;
    }
    response.json({ quests: results });
  });
});

export { router as quest_route };
