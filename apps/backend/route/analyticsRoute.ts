import { Router } from "express";
import {
  getSummary,
  getBiasReport,
  getCategoryBreakdown,
  getEmotionBreakdown,
} from "../controllers/analyticsController";

const router = Router();

router.get("/summary", getSummary);
router.get("/bias-report", getBiasReport);
router.get("/category", getCategoryBreakdown);
router.get("/emotion", getEmotionBreakdown);

export default router;