import dotenv from 'dotenv';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

dotenv.config();

//this value should use .env to set this up
const access_token: string = process.env.ACCESS_TOKEN!;
let refresh_token: string = process.env.REFRESH_TOKEN!;

export function generateAccessToken(user: { user: string }) {
	return jwt.sign(user, access_token, { expiresIn: '15m' });
}

export function generateRefreshToken(user: { user: string }) {
	const refreshToken = jwt.sign(user, refresh_token, { expiresIn: '20m' });
	refreshTokens.push(refreshToken);
	return refreshToken;
}

let refreshTokens: string[] = [];
//อาจจะไม่ได้ใช้ ถ้าจะใช้ต้องทำ database ของ refresh token ใหม่ด้วย
export function continueToken(req: Request, res: Response) {
	if (!refreshTokens.includes(req.body.token)) res.status(400).send('Refresh Token Invalid');
	refreshTokens = refreshTokens.filter((c) => c != req.body.token);
	//remove the old refreshToken from the refreshTokens list
	const accessToken = generateAccessToken({ user: req.body.email });
	const refreshToken = generateRefreshToken({ user: req.body.email });
	//generate new accessToken and refreshTokens
	res.json({ accessToken: accessToken, refreshToken: refreshToken });
}
//อาจจะเขียนใหม่
export function logout(req: Request, res: Response) {
	refreshTokens = refreshTokens.filter((c) => c != req.body.token);
	//remove the old refreshToken from the refreshTokens list
	res.status(204).send('Logged out!');
}
