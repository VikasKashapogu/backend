const exp = require("express")
const userApp = exp.Router()
const bcryptjs = require('bcryptjs')
const jwt =require('jsonwebtoken')
const VerifyToken = require("../Middlewares/VerifyToken")
const multer = require("multer")
const cloudinary = require("cloudinary").v2;
const cloudinaryStorage = require('cloudinary-multer')
const path = require('path')
require('dotenv').config() //process.env
const expressasynchandler = require('express-async-handler')
const {getUsers}=require('../Controllers/userController')

const testing =require('../Middlewares/Testing')
const { isDate } = require("util")

//configure
cloudinary.config({
     cloud_name:process.env.CLOUD_NAME,
     api_key:process.env.CLOUD_API_KEY,
     api_secret:process.env.CLOUD_API_SECRET
})

// var storageLocation = multer.diskStorage({
//      destination:function (req, file, cb) {
//           cb(null, "Uploads/");
//      },
//      filename: function(req, file, cb){
//           cb(null, Date.now() + path.extname(file.originalname))
//      },
// });

//configure cloudinary storage
const storageLocation=cloudinaryStorage({
     cloudinary:cloudinary
})
const upload=multer({storage:storageLocation})

let usersCollection;
userApp.use((req,res,next)=>{
     usersCollection = req.app.get('usersCollection')
     next()
})

userApp.get('/users',expressasynchandler(getUsers))

userApp.get('/users/:userId',async(req,res,next)=>{
   //const usersCollection = req.app.get('usersCollection')
   try{
     let userId = Number(req.params.userId)
     console.log(userId)
   let user = await usersCollection.findOne({userId:userId})
   //userObj=>userObj.id===id {userId:userId}
   res.send({message:"user",payload:user})
   }catch(err){
          next(err)
   }
   
})

userApp.post('/user',upload.single('image'),testing,async(req,res)=>{
     let userCreated = req.body
     // let user = await usersCollection.insertOne(userCreated)
     // if(user.acknowledged===true){
     //      res.status(201).send({message:"user created",payload:user})    
     // }else{
     //      res.status(500).send({message:"something went wrong"})
     // }

     //validations
     if(!userCreated.username || !userCreated.password || !userCreated.gmail){
          return res.send({message:"you missed mandatory"})
     }
     if(userCreated.username.length<4){
          return res.send({message:"min length should be 4 characters"})
     }

     let userFromDb = await usersCollection.findOne({username:userCreated.username})
     if(userFromDb===null){
          let hashedPassword =await bcryptjs.hash(userCreated.password,5)
          userCreated.password=hashedPassword
          usersCollection.insertOne(userCreated)
          res.send({message:"user created",payload:userCreated})
     }else{
          res.send({message:"user already exist"})
     }
    
})


userApp.post('/user-login',async(req,res)=>{
     let credObj = req.body
     let usernameCheck = await usersCollection.findOne({username:credObj.username})
     //console.log(usernameCheck)
     if(usernameCheck===null){
          res.send({message:"invalid username"})
     }else{
          let result = await bcryptjs.compare(credObj.password,usernameCheck.password)
          if(result===false){
               res.send({message:"invalid password"})
          }else{
               //res.send({message:"congrats......."})
               let signedToken  = jwt.sign({username:credObj.username},process.env.SECRET_KEY,{expiresIn:"1d"})
               res.send({message:"login success",token:signedToken,user:credObj})
          }
     }
})

userApp.put('/user',async(req,res)=>{
     const user = req.body
     //console.log(user)
     let dbRes = await usersCollection.updateOne({userId:user.userId},{$set:{...user}})
     //console.log("ok")
     res.send({message:"updated",payload:dbRes})
})

userApp.delete('/users:id',(req,res)=>{

})

userApp.get('/protected',(req,res)=>{
     console.log(req)
     res.send({message:"this is protected route"})
})


module.exports=userApp;


// let users1=[{id:1,name:"vikas"},{id:2,name:"raju"}]

// function test1Middleware(req,res,next){
//     console.log("mid1")
//     //res.send({message:"som wrong"})
//     next()
// }

// function test2Middleware(req,res,next){
//     console.log("mid2")
//     //res.send({message:"ome wrong in 2"})
//     next()
// }

// //app.use(test1Middleware)
// //app.use(test2Middleware)

// userApp.get('/users',test1Middleware,(req,res)=>{
//     res.send({message:"hai",payload:users1});
// })

// userApp.get('/users/:id',(req,res)=>{
//     let id = Number(req.params.id)
//     let user = users1.find(userObj=>userObj.id===id)
//     if(user===undefined){
//         res.send({message:"user not found"})
//     }else{
//         res.send({message:"current user",payload:user})
//     }
// })

// userApp.post('/user',(req,res)=>{
//     newUser=req.body
//      users1.push(newUser)

//      res.send({message:"user created"})
// })

// userApp.put('/user',(req,res)=>{
//     modiUser=req.body
//     let index = users1.findIndex(userObj=>userObj.id===modiUser.id)
//     users1.splice(index,1,modiUser)
//     res.send({message:"user updated"})
// })

// userApp.delete('/user/:id',(req,res)=>{
//     let id = Number(req.params.id)
//     let index = users1.findIndex(userObj=>userObj.id===id)
//     users1.splice(index,1)
//     res.send({message:"user deleted"})
// })