import crypto from 'crypto';
export default function generateUniqueToken() {
	return crypto.randomBytes(20).toString('hex');
}
