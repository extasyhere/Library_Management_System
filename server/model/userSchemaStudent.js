const mongoose= require('mongoose');

const userSchemaStudent= new mongoose.Schema(
    {
        bookID:{
            type:String,
            required:true
        },
        studentName:{
            type:String,
            required:true
        },
        issueDate:{
            type:String,
            required:true 
        },
        returnDate:{
            type:String,
            default:"Issued"
        }
    }
);

const Student= mongoose.model('issuer',userSchemaStudent);

module.exports=Student;
