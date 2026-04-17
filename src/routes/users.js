import { Router } from "express";
// import { verifyToken } from "../middleware/authenticate.js";
import {
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/usersController.js";

const router = Router();

router.get("/", getUser);
router.post("/", createUser);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
