import { Router } from "express";
import {
  addField,
  checkSlug,
  createForm,
  deleteForm,
  getForm,
  listForms,
  removeField,
  reorderFields,
  togglePublish,
  updateField,
  updateForm
} from "../controllers/formController";
import {
  exportCsv,
  getSingleResponse,
  listResponses,
  submitResponse
} from "../controllers/responseController";
import { optionalAuth } from "../middleware/optionalAuthMiddleware";
import { requireAuth } from "../middleware/authMiddleware";

const router = Router();

router.use(requireAuth);

router.get("/", listForms);
router.post("/", createForm);
router.get("/slug/check", checkSlug);
router.get("/:id", getForm);
router.patch("/:id", updateForm);
router.delete("/:id", deleteForm);
router.patch("/:id/publish", togglePublish);

router.post("/:id/fields", addField);
router.patch("/:id/fields/:fid", updateField);
router.delete("/:id/fields/:fid", removeField);
router.patch("/:id/fields/reorder", reorderFields);

router.get("/:id/responses", listResponses);
router.get("/:id/responses/:rid", getSingleResponse);
router.get("/:id/responses/export/csv", exportCsv);

export default router;

export const publicSubmitRouter = Router();
publicSubmitRouter.post("/:id/submit", optionalAuth, submitResponse);
