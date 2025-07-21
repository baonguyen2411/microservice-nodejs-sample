import express, { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const router: Router = express.Router();

// register
router.post('/register', AuthController.register);
// login
router.post('/login', AuthController.login);
// refresh token
router.post('/refresh-token', AuthController.refreshToken);
// logout
router.post('/logout', AuthController.logout);

export default router;
