import { Router } from 'express';
import { register, login, me, logout, changePassword } from '../controllers/authcontroller.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get("/me", authMiddleware, me);

router.post("/logout", logout);

router.patch("/change-password",authMiddleware,changePassword);
export default router;
