import express from "express";
import {
  createAppeal,
  takeInProgress,
  completeAppeal,
  cancelAppeal,
  getAppeals,
  cancelAllInProgress,
} from "../controllers/appealController.js";

const router = express.Router();

router.post("/", createAppeal);
router.put("/:id/in-progress", takeInProgress);
router.put("/:id/complete", completeAppeal);
router.put("/:id/cancel", cancelAppeal);
router.get("/", getAppeals);
router.put("/cancel-all/in-progress", cancelAllInProgress);

export default router;
