import dotenv from 'dotenv';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { generateAccessToken, generateRefreshToken } from './tokenController.js';

dotenv.config();

const ACCESS_TOKEN_SECRET: string = process.env.ACCESS_TOKEN!;
const REFRESH_TOKEN_SECRET: string = process.env.REFRESH_TOKEN!;

export default async function authenticateRequest(req: Request, res: Response, next: NextFunction = () => {}) {
	const authorizationHeader = await req.headers['authorization'];
	const refreshTokenHeader = await req.headers['refreshtoken'];
	const userEmail = await req.headers['email'];

	if (
		typeof authorizationHeader !== 'string' ||
		typeof refreshTokenHeader !== 'string' ||
		typeof userEmail !== 'string'
	) {
		// Authorization header is missing or in an invalid format, return an error
		res.json({
			status: 'error',
			message: 'Authorization header is missing or in an invalid format',
			return: 3,
		});
		return;
	}

	const authorization: string = authorizationHeader.split(' ')[1];
	const refreshToken: string = refreshTokenHeader.split(' ')[1];
	if (authorization == 'null') {
		// Token not present or null, return an error
		res.json({ status: 'error', message: 'Token not present.', return: 1 });
		return;
	}
	// Verify the access token
	jwt.verify(authorization, ACCESS_TOKEN_SECRET, (jwtError, user) => {
		if (jwtError) {
			jwt.verify(
				refreshToken,
				REFRESH_TOKEN_SECRET,
				(error: jwt.VerifyErrors | null, user: string | jwt.JwtPayload | undefined) => {
					if (error) {
						// Invalid refresh token, return an error
						res.json({ status: 'error', message: 'Token invalid.', return: 2 });
						return;
					}
					// Generate new access and refresh tokens
					const accessToken = generateAccessToken({ user: userEmail });
					const refreshToken = generateRefreshToken({ user: userEmail });
					// Respond with success and the new tokens
					// ตรงนี้อาจจะมีแก้เพิ่ม
					res.json({
						status: 'success',
						message: 'Generated new tokens.',
						return: -1,
						data: {
							accessToken: accessToken,
							refreshToken: refreshToken,
						},
					});
					// next();
				}
			);
		} else {
			// Access token is valid, continue on to the next middleware function
			// next();
			res.json({
				status: 'success',
				message: 'Token valid.',
				return: 0,
			});
		}
	});
}
