import express from "express";
const router = express.Router();
import { bid, getBid } from "../control/bid-control.js";

router.route("/create").post(bid);
router.route("/get").post(getBid);

export default router;
