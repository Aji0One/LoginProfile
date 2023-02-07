const mongo = require("../connect");
const jwt= require("jsonwebtoken");


exports.getProfile = async (req, res, next) => {
  try {
    
    //getting email by decoding the jwt;
    const data= jwt.decode(req.headers.accesstoken);
    const email= data.email;
    console.log(email);
    const existUser= await mongo.Db.collection("profile").findOne({
      email: email
    })
    if(!existUser){
      await mongo.Db.collection("profile").insertOne({
        email: data.email,
        img: "https://tse4.mm.bing.net/th?id=OIP.ybB2a0HimX1I-ybBY4pOPwHaHa&pid=Api&P=0",
        userName: data.userName,
      });
    }
    res.send(existUser);
    // const users= await mongo.Db.collection("profile").find({}).toArray();
    
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
};


exports.editProfile= async(req,res,next) => {
  try{
 
    const exist= jwt.decode(req.headers.accesstoken);
    console.log(req.body.profile);
    const update= await mongo.Db.collection("profile").findOneAndUpdate({email : exist.email},{$set: {...req.body.profile}},{returnDocument:"after"});
    
    console.log(update);
    res.send(update);
  }catch (err){
    res.status(500).send(err);
  }
};