import express from "express";
import {userProduct , BidWinner, getUser, home, login, registration, updatePassword, user, forgotPassword, changePassword } from "../control/auth-control.js";
const router = express.Router();
import { authMiddleware } from "../middleware/auth-middleware.js";

router.route("/").get(home);
router.route("/registration").post(registration)
router.route("/login").post(login)
router.route("/user").get(authMiddleware,user)
router.route("/userData").post(getUser)
router.route("/user/password").post(updatePassword)  
router.route("/user/bidWinner").post(BidWinner)
router.route("/user/product").post(userProduct)
router.route("/user/forgotPassword").post(forgotPassword)
router.route("/user/changePassword").post(changePassword)

export default router;