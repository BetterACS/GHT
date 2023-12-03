import express from 'express';
import loginAuth from '../auth/loginAuth.js';
const router = express.Router();
router.post('/login', loginAuth);

export default router;
