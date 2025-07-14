import express, { Router } from 'express';
import { login, logout, register } from '../controllers/authController';

const router: Router = express.Router();

// create new user
router.post('/register', register);
// user login
router.post('/login', login);
// user logout
router.get('/logout', logout);

export default router;
