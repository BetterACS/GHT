import express from 'express';
import { logout } from '../auth/tokenController.js';

const router = express.Router();
router.delete('/logout', logout);
export default router;
