import express from "express";
const router = express.Router();
import { contactForm } from "../control/contact-control.js";

router.route("/contact").post(contactForm);

export default router;