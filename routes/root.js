const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/" , (req,res) =>{  //midellware fih req et res pour modifier et valider et anlyser la requete  avant qu'elles atteignent le contrôleur final.
  res.sendFile(path.join(__dirname, ".." , "views" , "index.html"));
});

module.exports = router ;