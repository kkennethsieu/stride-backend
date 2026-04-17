import { Router } from "express";
import { verifyToken } from "../middleware/authenticate.js";
import {
  getAllRuns,
  createRun,
  updateRun,
  deleteRun,
} from "../controllers/runsController.js";

const router = Router();

router.get("/", verifyToken, getAllRuns);
router.post("/", verifyToken, createRun);
router.patch("/:id", verifyToken, updateRun);
router.delete("/:id", verifyToken, deleteRun);

export default router;
