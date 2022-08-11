const mongoose= require('mongoose');
const bcrypt = require('bcryptjs');
const jwt= require('jsonwebtoken');

const userSchemaAdmin= new mongoose.Schema(
    {
        adminName:{
            type:String,
            required:true
        },
        username:{
            type:String,
            required:true
        },
        password:{
            type:String,
            required:true 
        },
        //token registration
        tokens:[
            {
                token:{
                    type:String,
                    required:true
                }
            }
        ]
    }
);

//password hashing
userSchemaAdmin.pre('save', async function(next){
    try{
        if(this.isModified('password')){
            this.password = await bcrypt.hash(this.password,12);
        }
        next();
    }
    catch(err){
        console.log(err);
    }
});

//for jwt authentication
userSchemaAdmin.methods.generateAuthToken = async function(){
    try{
        //the token is made out of the id and the secret id
        let token =jwt.sign({_id:this._id}, process.env.SECRET_KEY);
        this.tokens=this.tokens.concat({token:token});
        await this.save();
        return token;
    }catch(err){
        console.log(err);
    }
};

const Admin= mongoose.model('admin',userSchemaAdmin);

module.exports=Admin;
