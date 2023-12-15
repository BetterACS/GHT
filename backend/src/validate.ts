import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import validateToken from './auth/validateToken.js';
import Config from './config.js';
const app = express();

app.use(cors()); // Enable CORS for the app
app.use(bodyParser.urlencoded({ extended: false })); // Parse URL-encoded request bodies
app.use(bodyParser.json()); // Parse JSON request bodies

app.listen(Config.VALIDATE_PORT, () => {
	console.log(`validator Listening on port ${Config.VALIDATE_PORT}`);
});

// app.post('/validator', validateToken, async (request, response) => {
// 	response.send({ status: 'success', message: 'Token valid.', return: 0 });
// });
app.post('/validator', validateToken);
