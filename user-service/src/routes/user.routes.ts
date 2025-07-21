import express, { RequestHandler, Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { verifyUser, verifyAdmin } from '../middlewares/verifyToken';

const router: Router = express.Router();

// create a new user
router.post('/', verifyUser as RequestHandler, UserController.createUser);
// update user
router.put('/:id', verifyUser as RequestHandler, UserController.updateUser);
// delete user
router.delete('/:id', verifyUser as RequestHandler, UserController.deleteUser);
// get single user
router.get('/:id', verifyUser as RequestHandler, UserController.getSingleUser);
// get all user
router.get('/', verifyAdmin as RequestHandler, UserController.getAllUser);
// register
router.post('/register', UserController.register);
// login
router.post('/login', UserController.login);
// refresh token
router.post('/refresh-token', UserController.refreshToken);
// logout
router.post('/logout', verifyUser as RequestHandler, UserController.logout);

export default router;
