import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { generateAccessToken, generateRefreshToken } from './auth/tokenController.js';
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

// Middleware function to validate the access token in the request
function validateToken(req: Request, res: Response, next: NextFunction) {
	// Get the token from the request header
	const authHeader = req.body.headers['authorization'];
	if (typeof authHeader === 'string') {
		const token = authHeader.split(' ')[1];

		if (token == 'null') {
			// Token not present or null, return an error
			res.json({
				status: 'error',
				message: 'Token not present.',
				return: 1,
			});
		} else {
			// Verify the access token
			jwt.verify(token, access_token, (err, user) => {
				if (err) {
					const rToken = req.body.headers['refreshToken'].split(' ')[1];
					// Verify the refresh token
					jwt.verify(
						rToken,
						refresh_token,
						(error: jwt.VerifyErrors | null, user: string | jwt.JwtPayload | undefined) => {
							if (error) {
								// Invalid refresh token, return an error
								res.json({
									status: 'error',
									message: 'Token invalid.',
									return: 2,
								});
							} else {
								// Generate new access and refresh tokens
								const accessToken = generateAccessToken({
									user: req.body.headers['email'],
								});
								const refreshToken = generateRefreshToken({
									user: req.body.headers['email'],
								});
								// Respond with success and the new tokens
								res.json({
									status: 'success',
									message: 'Generated new tokens.',
									return: -1,
									data: {
										accessToken: accessToken,
										refreshToken: refreshToken,
									},
								});
							}
						}
					);
				} else {
					// Access token is valid, respond with success
					res.json({
						status: 'success',
						message: 'Token valid.',
						return: 0,
					});
				}
			}); // End of jwt.verify()
		}
	} else {
		// Authorization header is missing or in an invalid format, return an error
		res.json({
			status: 'error',
			message: 'Authorization header is missing or in an invalid format',
			return: 3,
		});
	}
}

app.post('/validator', validateToken); // Handle POST requests to '/validator'
