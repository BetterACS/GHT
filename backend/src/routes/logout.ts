import express from 'express';
import checkAuthorization from '../middleware/checkAuthorization.js';
const router = express.Router();
router.delete('/logout', [
	checkAuthorization,
	() => {
		'You cannot logout';
	},
]);
export default router;
