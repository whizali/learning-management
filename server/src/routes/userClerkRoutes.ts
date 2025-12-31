import { Router } from "express";
import { updateUser } from "../controllers/userClerkController.js";

const router = Router();

router.put("/:userId", updateUser);

export default router;