import express from "express";
import { jwtCheck, jwtParse } from "../middleware/auth";
import ReviewController from "../controllers/ReviewController";


const router = express.Router();

console.log("in the reviewRoute");
router.post("/saveReview",
jwtCheck,
jwtParse,
ReviewController.createReview
);

export default router;