const exp = require('express')
const app = exp()

//get mongodb client
const mc = require('mongodb').MongoClient
//connect to mongodb server
mc.connect('mongodb://127.0.0.1:27017')
.then((client)=>{
    //get db object
    const dbObj = client.db('mydb')
    //get collection obj
    const usersCollection = dbObj.collection('users')
    //add user collection to express obj
    app.set('usersCollection',usersCollection)
    console.log("connected to database server")
})
.catch(err=>{
    console.log("err in DB connect",err)
})

app.use(exp.json())

//imports
const userApp = require('./APIS/userApi')
const productApp = require('./APIS/productApi')

//paths
app.use('/user-api',userApp)
app.use('/product-api',productApp)


function errorhandling(err,req,res,next){
    res.send({message:"error occured",payload:err.message})
}
app.use(errorhandling)

const PORT = process.env.PORT || 4000
app.listen(PORT,()=>console.log("worked"))