import express from 'express';
import storeUser from '../auth/storeUser.js';
const router = express.Router();

router.post('/register', storeUser);

export default router;
