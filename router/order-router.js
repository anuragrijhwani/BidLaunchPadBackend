import express from "express";
import { order, orderData } from "../control/order-control.js";
const router = express.Router();

router.route("/data").post(orderData);
router.route("/create").post(order);

export default router;