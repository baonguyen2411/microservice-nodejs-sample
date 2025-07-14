import express, { RequestHandler, Router } from 'express';
import {
  getSingleUser,
  //   getAllUser,
  updateUser,
  deleteUser,
  createUser,
} from '../controllers/userController';
import { verifyToken } from '../middlewares/verifyToken';

const router: Router = express.Router();

// create a new user
router.post('/', verifyToken as RequestHandler, createUser);
// update user
router.put('/:id', verifyToken as RequestHandler, updateUser);
// delete user
router.delete('/:id', verifyToken as RequestHandler, deleteUser);
// get single user
router.get('/:id', verifyToken as RequestHandler, getSingleUser);
// get all user
// router.get('/', verifyAdmin as RequestHandler, getAllUser);

export default router;
