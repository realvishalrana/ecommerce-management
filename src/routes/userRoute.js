import express from "express";
import {
  getUser,
  createUser,
  loginUser,
} from "../controller/userController.js";
import validate from "../middleware/validate-request.js";
import {
  signupUserSchema,
  loginUserSchema,
} from "../validation/userValidation.js";
import authMiddleWare from '../middleware/auth.js'


const router = express.Router();

router.get("/", authMiddleWare, getUser);

router.post("/", validate(signupUserSchema), createUser);

router.post("/login", validate(loginUserSchema), loginUser);

export default router;
