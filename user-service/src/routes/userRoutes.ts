import express, { RequestHandler, Router } from 'express';
import {
  getSingleUser,
  getAllUser,
  updateUser,
  deleteUser,
  createUser,
} from '../controllers/userController';
import { verifyUser, verifyAdmin } from '../middlewares/verifyToken';

const router: Router = express.Router();

// create a new user
router.post('/', verifyUser as RequestHandler, createUser);
// update user
router.put('/:id', verifyUser as RequestHandler, updateUser);
// delete user
router.delete('/:id', verifyUser as RequestHandler, deleteUser);
// get single user
router.get('/:id', verifyUser as RequestHandler, getSingleUser);
// get all user
router.get('/', verifyAdmin as RequestHandler, getAllUser);

export default router;
