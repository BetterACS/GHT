import exp from "constants";
import express, { Request, Response } from "express";

const router = express.Router();

router.get("/", (request: Request, response: Response) => {
  /**
   * This route is the home route.
   */
  response.json({ message: "Hello World" });
});

export { router as home_route };
