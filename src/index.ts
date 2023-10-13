import express, { Express, Request, Response } from 'express';

const app: Express = express();
const port: number = 8000;

app.get('/', (request: Request, response: Response) => {
    response.send('Express + TypeScript Server');
});

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});