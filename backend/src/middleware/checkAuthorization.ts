import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import Config from '../config.js';

async function checkAuthorization(req: Request, res: Response, next: NextFunction = () => {}) {
	const headers = {
		authorization: req.headers['authorization'],
		refreshToken: req.headers['refreshtoken'],
		email: req.headers['email'],
	};
	const result = await axios.post(`http://localhost:${Config.VALIDATE_PORT}/validator`, {}, { headers: headers });
	if (result.data.return === 0) {
		// console.log('checkAuthorization: ผ่านด้วยดีไปต่อ');
		next();
	} else if (result.data.return === -1) {
		// console.log('checkAuthorization: มีการสร้าง token ใหม่');
		const newAccessToken = result.data.data.accessToken;
		const newRefreshToken = result.data.data.refreshToken;
		res.setHeader('authorization', newAccessToken);
		res.status(200).send(result.data);
	} else {
		//all error
		// console.log('checkAuthorization: มี error อะไรก็ไม่รู้', result.data);
		res.send(result.data);
	}
}

export default checkAuthorization;
