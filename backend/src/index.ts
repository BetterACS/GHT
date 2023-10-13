import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const app: Express = express();
const port: number = 5000;

app.get("/", (request: Request, response: Response) => {
  response.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Backend server is running at http://localhost:${port}`);
});
