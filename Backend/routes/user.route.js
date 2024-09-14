// import express from "express";
// import { login, logout, register, updateProfile } from "../controllers/user.controller.js";
// import isAuthenticated from "../middlewares/isAuthenticated.js";

// const router = express.Router();

// router.post("/register").post( register);
// router.post("/login").post(login);
// router.post("/profile/update").get( isAuthenticated, updateProfile);
// router.post("/logout").post(logout);

// export default router;
import express from "express";
import { login, register } from "../controllers/user.controller.js";

const router = express.Router();

// Correct usage of routes
router.route("/register").post(register); // Define the path as a string
router.route("/login").post(login);

export default router;
