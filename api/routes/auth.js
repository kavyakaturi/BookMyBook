import express from 'express';
import { register,login,registerAdmin,sendEmail,resetPassword} from '../controllers/auth.controller.js';

const router = express.Router();

router.post("/register",register);

router.post("/login",login);

router.post('/registerAdmin',registerAdmin);

router.post('/sendEmail', sendEmail);

router.post('/resetPassword', resetPassword);

export default router;