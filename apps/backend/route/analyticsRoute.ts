import { Router } from "express";
import {
  getSummary,
  getBiasReport,
  getCategoryBreakdown,
  getEmotionBreakdown,
  getTimeline,
  getScatter,
} from "../controllers/analyticscontroller";

const router = Router();

router.get("/summary", getSummary);
router.get("/bias-report", getBiasReport);
router.get("/category", getCategoryBreakdown);
router.get("/emotion", getEmotionBreakdown);
router.get("/timeline", getTimeline);
router.get("/scatter", getScatter);

export default router;