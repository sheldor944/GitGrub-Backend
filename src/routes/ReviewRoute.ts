import express from "express";
import { jwtCheck, jwtParse } from "../middleware/auth";
import ReviewController from "../controllers/ReviewController";
import { param } from "express-validator";


const router = express.Router();

console.log("in the reviewRoute");
// router.post("/saveReview",
// jwtCheck,
// jwtParse,
// ReviewController.createReview
// );

router.post(
    "/saveReview/:restaurantId",
    param("restaurantId")
      .isString()
      .trim()
      .notEmpty()
      .withMessage("RestaurantId paramenter must be a valid string"),
    jwtCheck,
    jwtParse,
    ReviewController.createReview
  );
  
router.get(
    "/:restaurantId",
    param("restaurantId")
      .isString()
      .trim()
      .notEmpty()
      .withMessage("RestaurantId paramenter must be a valid string"),
    ReviewController.getReview
  );
  
export default router;