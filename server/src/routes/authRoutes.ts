import { Router } from "express";
import { body } from "express-validator";
import { login, logout, me, refresh, register } from "../controllers/authController";
import { requireAuth } from "../middleware/authMiddleware";
import { validateRequest } from "../middleware/validationMiddleware";

const router = Router();

router.post(
  "/register",
  [
    body("name").trim().notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 8 })
  ],
  validateRequest,
  register
);

router.post("/login", [body("email").isEmail(), body("password").notEmpty()], validateRequest, login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/me", requireAuth, me);

export default router;
