import { Router } from "express";
import { getPublicFormBySlug } from "../controllers/publicController";

const router = Router();

router.get("/forms/:slug", getPublicFormBySlug);

export default router;
