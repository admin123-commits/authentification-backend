const User = require("../models/User");
//middelware mta3na 3ibara ala function

const getAllUsers = async (req,res)=>{  
  const users = await User.find().select("-password").lean();
  if(!users.length){
    return res.status(400).json({message : "No Users Found" }) ; 
  }
  res.json(users);
};
module.exports = {
    getAllUsers, 
};
 
