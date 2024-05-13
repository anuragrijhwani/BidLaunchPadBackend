import express from "express";
import { AddProduct } from "../control/auth-control.js";
import multer from "multer";
import {productUpdate } from "../control/product-control.js";
const Storage = multer.diskStorage
({ 
    destination: 'uploads/',
    filename:(req,files,cb)=>{
        cb(null, Date.now()+files.originalname)
    }
})

const upload = multer({
    storage:Storage
})

const router = express.Router();

router.route("/addProduct").post(upload.array('productImages'),AddProduct);
router.route("/editProduct").post(upload.array('productImages'),productUpdate);



export default router;