import dotenv from 'dotenv';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

dotenv.config();

export default class TokenManager {
	private static INSTANCE: TokenManager;
	private static ACCESS_TOKEN: string;
	private static REFRESH_TOKEN: string;

	public constructor() {
		TokenManager.ACCESS_TOKEN = process.env.ACCESS_TOKEN!;
		TokenManager.REFRESH_TOKEN = process.env.REFRESH_TOKEN!;
	}

	public static instance() {
		if (!TokenManager.INSTANCE) {
			TokenManager.INSTANCE = new TokenManager();
		}
		return TokenManager.INSTANCE;
	}

	public generateAccessToken(user: { user: string }) {
		return jwt.sign(user, TokenManager.ACCESS_TOKEN, { expiresIn: '15m' });
	}

	public generateRefreshToken(user: { user: string }) {
		const refreshToken = jwt.sign(user, TokenManager.REFRESH_TOKEN, { expiresIn: '20m' });
		return refreshToken;
	}

	public async authenticateRequest(req: Request, res: Response, next: Function = () => {}) {
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
		jwt.verify(authorization, TokenManager.ACCESS_TOKEN, (jwtError, user) => {
			if (jwtError) {
				jwt.verify(
					refreshToken,
					TokenManager.REFRESH_TOKEN,
					(error: jwt.VerifyErrors | null, user: string | jwt.JwtPayload | undefined) => {
						if (error) {
							// Invalid refresh token, return an error
							res.json({ status: 'error', message: 'Token invalid.', return: 2 });
							return;
						}
						// Generate new access and refresh tokens
						const accessToken = this.generateAccessToken({ user: userEmail });
						const refreshToken = this.generateRefreshToken({ user: userEmail });
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
}
