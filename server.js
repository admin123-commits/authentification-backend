require("dotenv").config(); // Charge le fichier .env

const express = require("express");

const mongoose = require("mongoose");
const app = express();
const connectDb = require("./config/dbConn");
const cors = require("cors");
const corsOptions=require("./config/corsOptions")
const cookiesparser =require("cookie-parser");
const path =require("path");
const PORT = process.env.PORT || 5000 ;

connectDb(); // 1 connect data base 
app.use(cors(corsOptions)); // 2 a7aded cors option 
app.use(cookiesparser()); // 3 cookies parser elli hiya route
app.use(express.json());



app.use("/" , express.static(path.join(__dirname , "public")))
app.use("/" , require("./routes/root"));
app.use("/auth" , require("./routes/authRoutes"));
app.use("/gett" , require("./routes/userRoutes"));
app.all("*" , (req,res)=>{
    res.status(404);
    if (req.accepts("html")){
        res.sendFile(path.join(__dirname , "views" , "404.html"))

    }else  if(req.accepts("json")){
        res.json({message  :"404 not Found" })
    }else {
        res.type("txt").send("404 Not Found")
    }
})

// connect data base avec event open et fuinction tetnafedh hiya 
//once function mta3 connection f 7ala awel mara na3ml connection avec data base
mongoose.connection.once("open" , ()=>{
    console.log(" connected");
    app.listen(PORT , ()=>{
        console.log(`Server running on port ${PORT}`);
    });
});


mongoose.connection.on("error", (err)=>
{ 
    console.log(err);

})





