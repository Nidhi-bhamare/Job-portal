
import express from "express";
import { getCompany, registerCompany, updateCompany } from "../controllers/company.controller.js"; // Import all necessary controllers


import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/register").post( isAuthenticated , registerCompany);
router.route("/get").get(isAuthenticated, getCompany);
router.route("/update/:id").put( isAuthenticated, updateCompany);
//router.route("/get/:id").get(isAuthenticated,logout);

export default router;
