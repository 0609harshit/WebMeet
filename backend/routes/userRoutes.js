import { Router } from "express";
import { userRegister, userLogin } from "../controllers/userController.js";

const router=Router();

router.post('/register', userRegister);
router.post('/login', userLogin);
export default router;