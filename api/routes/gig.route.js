import express from "express";
import {
  createGig,
  getAllGigs,
  getGig,
  deleteGig,
} from "../controllers/gig.controller.js";
import protect from "../middlewares/protect.js";

const router = express.Router();

router.get("/", getAllGigs);
router.get("/:id", getGig);
router.post("/", protect, createGig);
router.delete("/:id", protect, deleteGig);

export default router;
