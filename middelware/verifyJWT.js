const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  // Récupérer le token depuis les headers de la requête
  const authHeader = req.headers.authorization || req.headers.Authorization;
  
  // Vérifier si le header est valide et commence bien par "Bearer "
  if (!authHeader || !authHeader.startsWith("Bearer ")) {     
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  // Extraire le token (ex: "Bearer xyz" -> on prend "xyz")
  const token = authHeader.split(" ")[1];

  // Vérifier et décoder le token
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      // Ajouter plus de détails dans le message d'erreur
      return res.status(403).json({
        message: "Forbidden",
        error: err.message, // Message d'erreur spécifique du token (par exemple, expiré, malformé, etc.)
      });
    }

    // Stocker les infos de l'utilisateur dans la requête
    req.User = decoded.UserInfo.id;

    next(); // Passer au middleware suivant
  });
};

module.exports = verifyJWT;
