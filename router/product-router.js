import express from "express";
import { productDelete, productDetails, productEdit, productForm, productStatusUpdate } from "../control/product-control.js";
import { authMiddleware } from "../middleware/auth-middleware.js";
const router = express.Router();

router.route("/product").get(productForm);
router.route("/productDetails").post(authMiddleware,productDetails);
router.route("/product/delete").post(authMiddleware,productDelete);
router.route("/product/edit").post(productEdit);
router.route("/product/bidstatusupdate").post(authMiddleware,productStatusUpdate)


export default router;