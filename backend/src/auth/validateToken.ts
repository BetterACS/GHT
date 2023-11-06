import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { generateAccessToken, generateRefreshToken } from './tokenController.js';
dotenv.config();

const access_token: string = process.env.ACCESS_TOKEN!;
let refresh_token: string = process.env.REFRESH_TOKEN!;

// Middleware function to validate the access token in the request
export default async function validateToken(req: Request, res: Response, next: NextFunction = () => {}) {
	// Get the token from the request header
	console.log('rToken: ', req.body);
	const authHeader: string = await req.body.headers['authorization'];
	const rToken: string = await req.body.headers['refreshToken'].split(' ')[1];
	const email: string = await req.body.headers['email'];

	console.log('authHeader: ', authHeader);
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
									user: email,
								});
								const refreshToken = generateRefreshToken({
									user: email,
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
					console.log('Token valid. eiei');
					next();
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

async function validateTokenMiddleware(req: Request, res: Response, next: NextFunction = () => {}) {
	const authHeader = await req.headers['authorization'];
	const rToken = await req.headers['refreshtoken'];
	const email = await req.headers['email'];

	if (typeof authHeader === 'string' && typeof rToken === 'string' && typeof email === 'string') {
		const token = authHeader.split(' ')[1];
		const _rToken = rToken.split(' ')[1];

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
					// Verify the refresh token
					jwt.verify(
						_rToken,
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
									user: email,
								});
								const refreshToken = generateRefreshToken({
									user: email,
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
					console.log('Token valid. eiei');
					next();
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

export { validateTokenMiddleware };
