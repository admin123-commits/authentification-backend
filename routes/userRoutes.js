const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const verifyJWT = require("../middelware/verifyJWT"); // Vérifie ce chemin


// Route pour récupérer tous les utilisateurs
router.use(verifyJWT) ; // router . bech nestakhdem verifyJWT si enti mawjoud bech y3adik lil function next() yaani ena bech njib jami3 users
router.route("/").get(usersController.getAllUsers); //fi halet token madhbout nefssou fi data base donc bch yjiblk toutes les utilisateurs
module.exports = router;


