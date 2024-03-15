const getUsers = async(req,res)=>{
    //get usersCollection obj
    //const usersCollection = req.app.get('usersCollection')
    //read all users
    let usersCollection=req.app.get('usersCollection')
    let users= await usersCollection.find().toArray()
    res.status(200).send({message:"get successful",payload:users})
}

module.exports={getUsers}