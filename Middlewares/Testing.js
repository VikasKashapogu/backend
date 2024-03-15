function testing(req,res,next){
    console.log("testing",req.body,"ending")
    next()
}
module.exports=testing;