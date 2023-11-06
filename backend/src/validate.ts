import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import validateToken from './auth/validateToken.js';
import Config from './config.js';
dotenv.config();
const app = express();

app.use(cors()); // Enable CORS for the app
app.use(bodyParser.urlencoded({ extended: false })); // Parse URL-encoded request bodies
app.use(bodyParser.json()); // Parse JSON request bodies

app.listen(Config.VALIDATE_PORT, () => {
	console.log(`validator Listening on port ${Config.VALIDATE_PORT}`);
});

const access_token: string = process.env.ACCESS_TOKEN!;
let refresh_token: string = process.env.REFRESH_TOKEN!;

app.post('/validator', validateToken); // Handle POST requests to '/validator'

export { validateToken };
