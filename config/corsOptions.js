const allowedOrigins =require("./allowedOrigins");
const corsOptions = {
    origin : (origin ,  callback)=>{ // callback bech traja3li 9ima mou3ayana 
        if(allowedOrigins.indexOf(origin)!== -1 || !origin){  //origin c'est domaine name mta3na , ! 3aksou w ella m3andich des domaine n ame
          callback(null , true) ;
        }else {
            callback(new Error("not allaowed by CORS"))
        }

    } ,
    credentials : true , // bech serveur ya9belha  w ella ye9bel ay cookies doit faire credentials true 
    optionsSucessStatus : 200,
}
module.exports= corsOptions;