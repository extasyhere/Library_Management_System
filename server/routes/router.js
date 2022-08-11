const { Router } = require("express");
const express=require("express");
const Admin = require("../model/userSchemaAdmin");
const route= express.Router();
const Book= require('../model/userSchemaBook');
const Student=require('../model/userSchemaStudent');
const axios = require('axios');
const dotenv = require('dotenv');
const bcrypt= require('bcryptjs');
const jwt=require('jsonwebtoken');
const authenticate=require('../middleware/authenticate');

dotenv.config({path:"./config.env"});
const PORT=process.env.PORT;

route.get("/home",authenticate,(req,res)=>{
    const name= req.rootAdmin.adminName;
    res.render("home",{title:name});
});

route.get("/login",(req,res)=>{
    res.render("login");
});

route.get("/addbook",authenticate,(req,res)=>{
    const name= req.rootAdmin.adminName;
    res.render("addbook",{title:name});
});

route.get("/search",authenticate,(req,res)=>{
    const name= req.rootAdmin.adminName;
    res.render("search",{title:name});
});

/*route.get("/viewbook",(req,res)=>{
    res.render('viewbook');
});*/

route.get("/issuebook",authenticate,(req,res)=>{
    const name= req.rootAdmin.adminName;
    res.render("issuebook",{title:name});
});

route.get("/returnbook",authenticate,(req,res)=>{
    const name= req.rootAdmin.adminName;
    res.render("returnbook",{title:name});
});

route.get("/registaradmin",authenticate,(req,res)=>{
    const name= req.rootAdmin.adminName;
    res.render("registaradmin",{title:name});
});

//route.post('/api/books',controller.create);
route.post('/addbook',async(req,res)=>{
    const{bookName,bookID,authorName}=req.body;

    try{
      const book=new Book(
          {
              bookName,
              bookID,
              authorName
          }
      );

      await book.save();
      res.status(201).json({message:"Book Added to the database"});
    }
    catch(err){
        console.log(err);
    }
});

route.post('/issuebook',async(req,res)=>{
    const{bookID,studentName,issueDate}=req.body;

    try{
      const student=new Student(
          {
              bookID,
              studentName,
              issueDate
          }
      );

      await student.save();
      res.status(201).json({message:`Book Issued to ${studentName}`});
    }
    catch(err){
        console.log(err);
    }
});

route.post('/registaradmin',async(req,res)=>{
    const{adminName,username,password}=req.body;

    if(!adminName || !username || !password ){
        return res.status(422).json({error: " Plz fill the Field properly"});
    }
    try{

        const adminExist= await Admin.findOne({username:username});

        if(adminExist){
            return res.status(422).json({err: "Username already taken"});
        }
        else{
            const admin=new Admin(
                {
                    adminName,
                    username,
                    password
                }
            );
      
            await admin.save();
            res.status(201).json({message:`${adminName} is registared as Admin`});
        }

    }
    catch(err){
        console.log(err);
    }
});

route.post('/login',async(req,res)=>{
    try{
        const {username,password}=req.body;

        if(!username || !password){
            return res.status(202).json({err:"PLz fill the required fields"});
        }

        const adminLogin = await Admin.findOne({username:username});
        
        if(adminLogin){
            const matchPwd= await bcrypt.compare(password,adminLogin.password);

            const token= await adminLogin.generateAuthToken();
            console.log(token);

            //cookie generate
            res.cookie('jwtoken',token,{
                expires:new Date(Date.now()+360000),
                httpOnly:true
            });

            if(!matchPwd){
                res.json({message:"Invalid Credentials"});
            }
            else{
                res.json({message:"User SignIn Successfully"});
            }
        }
    }
    catch(err){
        console.log(err);
    }
});

route.post('/returnbook',(req,res)=>{
    const {bookID,studentName,returnDate}= req.body;
    try{
      var update=Student.findOneAndUpdate(
          {
              bookID
          },
          {
              returnDate
          },{useFindAndModify: false}
      );
      //use exec command for the function to execute
      update.exec(function(err){
          if(err) throw err;
      });
      res.status(401).json({message:`${studentName} has returned the book`});

    }
    catch(err){
        console.log(err);
    }
});

route.post('/search',(req,res)=>{
  try{
     var search=Book.find({
         bookName:req.body.search
     });
     search.exec(function(err,data){
         if(err) throw err;
         if(data.length==0){
             res.status(505).json({message:"The Book is not available in Library"});
         }
         else{
            res.status(505).json({message:"The Book is available in Library"});
         }
    });
  }
  catch(err){
     console.log(err);
  }
});

route.get('/viewbook',authenticate,(req,res)=>{
    //find and update are not async functions
    var book= Book.find();
    
    const name= req.rootAdmin.adminName;
    book.exec(function(err,data){
        if(err) throw err;
        res.render('viewbook',{records:data,title:name});
    });
});



module.exports=route;

//

/*
 <% records.forEach(function(row){%>
            <tr>
                <td><%=row.bookID%></td>
                <td><%=row.bookName%></td>
                <td><%=row.authorName%></td>
            </tr>
            <%}) %>
*/