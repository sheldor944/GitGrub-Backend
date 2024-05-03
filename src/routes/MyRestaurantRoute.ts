import express from "express";
import multer from "multer";
import MyRestaurantController from "../controllers/MyRestaurantController";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateMyRestaurantRequest } from "../middleware/validation";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, //5mb
  },
});

router.get(
  "/order",
  jwtCheck,
  jwtParse,
  MyRestaurantController.getMyRestaurantOrders
);

router.patch(
  "/order/:orderId/status",
  jwtCheck,
  jwtParse,
  MyRestaurantController.updateOrderStatus
);

router.get("/", jwtCheck, jwtParse, MyRestaurantController.getMyRestaurant);

router.post(
  "/",
  upload.single("imageFile"),
  validateMyRestaurantRequest,
  jwtCheck,
  jwtParse,
  MyRestaurantController.createMyRestaurant
);

router.put(
  "/",
  upload.single("imageFile"),
  validateMyRestaurantRequest,
  jwtCheck,
  jwtParse,
  MyRestaurantController.updateMyRestaurant
);

router.put(
  "/updateInventory",
  jwtCheck,
  jwtParse, 
  MyRestaurantController.updateInventory
)

router.get(
  "/getInventory",
  jwtCheck, 
  jwtParse, 
  MyRestaurantController.getInventory
)
router.post(
  "/addInventory",
  jwtCheck, 
  jwtParse, 
  MyRestaurantController.addInventory
)

router.post(
  "/addEmployee", 
  jwtCheck,
  jwtParse,
  MyRestaurantController.addEmployee
)

router.get(
  "/getEmployee", 
  jwtCheck,
  jwtParse, 
  MyRestaurantController.getEmployee
)

router.put(
  "/updateEmployee",
  jwtCheck,
  jwtParse,
  MyRestaurantController.updateEmployee
)

export default router;
