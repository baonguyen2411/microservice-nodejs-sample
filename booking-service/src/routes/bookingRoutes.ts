import express, { Router } from 'express';
import { verifyAdmin, verifyUser } from '../middlewares/verifyToken';
import { createBooking, getAllBooking, getBooking } from '../controllers/bookingController';

const router: Router = express.Router();

router.get('/:bookingId', verifyUser as express.RequestHandler, getBooking);
router.get('/', verifyAdmin as express.RequestHandler, getAllBooking);
router.post('/', verifyUser as express.RequestHandler, createBooking);

export default router;
