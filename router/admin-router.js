import express from "express";
import { biddingData, deleteUser, getAllContact, getAllProducts, getAllUsers, getUserById, updateUser } from "../control/admin-control.js";
import {authMiddleware} from "../middleware/auth-middleware.js"

const router = express.Router();


router.route("/users").get(authMiddleware,getAllUsers);
router.route("/user/id").post(authMiddleware,getUserById);
router.route("/user/update").post(authMiddleware,updateUser);
router.route("/user/delete").post(authMiddleware,deleteUser)
router.route("/contact").get(authMiddleware,getAllContact);
router.route("/order").get(getAllProducts);
router.route("/bidding/data").post(biddingData);

export default router;