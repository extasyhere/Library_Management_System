const jwt= require('jsonwebtoken');
const Admin= require('../model/userSchemaAdmin');

const authenticate= async(req,res,next)=>{
    try{

        const token=req.cookies.jwtoken;
        const verifyToken=jwt.verify(token,process.env.SECRET_KEY);

        const rootAdmin=await Admin.findOne({_id:verifyToken._id,"tokens.token":token});

        if(!rootAdmin){
            throw new Error('User NOt Found');
        }
        else{
            req.token=token;
            req.rootAdmin=rootAdmin;
            req.adminID=rootAdmin._id;

            next();
        }
    }
    catch(err){
        res.status(401).send('Admin has LOGGED OUT. Kindly login Again');
        console.log(err);
    }
};

module.exports=authenticate;