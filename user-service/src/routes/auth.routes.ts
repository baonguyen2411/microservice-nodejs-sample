import express, { RequestHandler, Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { verifyUser } from '../middlewares/verifyToken';

const router: Router = express.Router();

// Authentication routes
router.post('/register', UserController.createUser);
router.post('/login', UserController.login);
router.post('/logout', verifyUser as RequestHandler, UserController.logout);
router.post('/refresh-token', verifyUser as RequestHandler, UserController.refreshToken);

export default router;
