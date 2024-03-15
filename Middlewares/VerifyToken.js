const jwt = require('jsonwebtoken')
require('dotenv').config()
function VerifyToken(req,res,next){
    //token verification logic
    //get bearer token from headers of req object
    const bearerToken = req.headers.authorization
    //get token
    if(bearerToken){
        const token = bearerToken.split(' ')[1]
        //verify the token
        let decodedToken = jwt.verify(token,process.env.SECRET_KEY)
        console.log(decodedToken)
        next()
    }else{
        res.send({message:"Person didn't have token"})
    }
}

module.exports=VerifyToken