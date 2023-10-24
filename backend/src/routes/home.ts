/**
 * @file home.ts
 * @description This file contains all the routes for the home route.
 */
import express, { Request, Response } from "express";

const router = express.Router();

router.get("/", (request: Request, response: Response) => {
  /**
   * This route is the home route.
   */
  response.json({ message: "Hello World" });
});

export default router;
