const exp = require("express")
const productApp = exp.Router()

let product = [{id:5,name:"pro1"}]
productApp.get('/products',(req,res)=>{
    console.log("product working")
    //res.send({message:"it is working",payload:product})
})

module.exports=productApp;