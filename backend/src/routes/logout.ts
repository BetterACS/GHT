import express from 'express';
import { logout } from '../auth/tokenController.js';
import checkAuthorization from '../middleware/checkAuthorization.js';
const router = express.Router();
router.delete('/logout', [checkAuthorization, logout]);
export default router;
