import express, { Router } from 'express';
import { login, logout, refreshToken, register } from '../controllers/authController';

const router: Router = express.Router();

// create new user
router.post('/register', register);
// user login
router.post('/login', login);
// user logout
router.get('/logout', logout);
// refresh token
router.get('/refresh-token', refreshToken);

export default router;
