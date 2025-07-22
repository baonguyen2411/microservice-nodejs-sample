import express, { RequestHandler, Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { verifyUser, verifyAdmin, verifyUserOrAdmin } from '../middlewares/verifyToken';

const router: Router = express.Router();

// User profile routes
router.get('/profile', verifyUser as RequestHandler, UserController.getUserProfile);
router.put('/profile', verifyUser as RequestHandler, UserController.updateUserProfile);

// User management routes (require authentication)
router.get('/search', verifyUser as RequestHandler, UserController.searchUsers);
router.get('/role/:role', verifyAdmin as RequestHandler, UserController.getUsersByRole);
router.get('/', verifyAdmin as RequestHandler, UserController.getAllUsers);
router.get('/:id', verifyUserOrAdmin as RequestHandler, UserController.getSingleUser);
router.put('/:id', verifyUserOrAdmin as RequestHandler, UserController.updateUser);
router.delete('/:id', verifyAdmin as RequestHandler, UserController.deleteUser);

// Admin-only routes
router.put('/:id/status', verifyAdmin as RequestHandler, UserController.updateUserStatus);

export default router;
