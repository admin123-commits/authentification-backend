const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// ✅ Fonction d'inscription (register)
const register = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const foundUser = await User.findOne({ email }).exec();
    if (foundUser) {
      return res.status(401).json({ message: "User already exists" });
    }

    // Hashage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création de l'utilisateur
    const user = await User.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
    });

    // Génération des tokens
    const accessToken = jwt.sign(
      {
        UserInfo: {
          id: user._id, 
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: 15 }
    );

    const refreshToken = jwt.sign(
      {
        UserInfo: {
          id: user._id, 
        },
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    // Stockage du refreshToken dans un cookie sécurisé
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Réponse au client
    res.status(201).json({
      accessToken,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

// ✅ Fonction de connexion (login)
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const foundUser = await User.findOne({ email }).exec();
    if (!foundUser) {
      return res.status(401).json({ message: "User does not exist" });
    }

    // Vérification du mot de passe
    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) {
      return res.status(401).json({ message: "Wrong password" });
    }

    // Génération des tokens
    const accessToken = jwt.sign(
      {
        UserInfo: {
          id: foundUser._id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: 15 }
    );

    const refreshToken = jwt.sign(
      {
        UserInfo: {
          id: foundUser._id,
        },
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    // Stockage du refreshToken dans un cookie sécurisé
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Réponse au client
    res.status(200).json({
      accessToken,
      email: foundUser.email,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
};
//function refresh pour créer une autre accessToken apres l'expiration
const refresh = async (req, res) =>{
  const cookies = req.cookies ; 
  if(!cookies?.jwt) res.status(401).json({ message : "Unauthorized" });
  const refreshToken = cookies.jwt;
   jwt.verify(refreshToken, 
    process.env.REFRESH_TOKEN_SECRET, 
    async (err, decoded)=>{ 
    if (err)  return res.status(403).json({ message: "Forbidden" }); // refreshToken invalide yaani refreshToken eeli jeni mech betmatchi REFRESH_TOKEN_SECRET elli f server
    const foundUser = await User.findById(decoded.UserInfo.id).exec();
    if(!foundUser) return res.status(401).json({ message: "Unauthorized" });
    const accessToken = jwt.sign(
      {
        UserInfo: {
          id: foundUser._id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: 15 }
    );
    res.json({ accessToken });
   }
  );
};
const logout=  (req,res) =>{
  const cookies = req.cookies ;
  if(!cookies?.jwt) return res.sendStatus(204) ; //no content
  //nheb na7i token men cookies yaani user sajel khourouj
  res.clearCookie("jwt", {
  httpOnly : true , // an tari9 hhhp only tefskhou
  sameSite:  "None", // Assure que le cookie est supprimé uniquement via HTTPS
  secure: true , // ala nafss domaine
});    //jwt ism cookie //on va supp cookies // w fih des option zeda 
res.json({ message : "cookie cleared" });

};

module.exports = { 
  register, 
  login , 
  refresh ,
  logout,
};
