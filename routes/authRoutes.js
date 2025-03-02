const express = require("express");
const router = express.Router();
const authController=require("../controllers/authController");
// /auth/registre
router.route("/register").post(authController.register);
router.route("/login").post(authController.login); // (authController.register) middelware elli khdemneha wa7adha fi authController
router.route("/refresh").get(authController.refresh); 
router.route("/logout").post(authController.logout); 
module.exports= router ;