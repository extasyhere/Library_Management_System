const mongoose= require('mongoose');

const userSchemaBook= new mongoose.Schema(
    {
        bookName:{
            type:String,
            required:true
        },
        bookID:{
            type:String,
            required:true
        },
        authorName:{
            type:String,
            required:true 
        }
    }
);

const Book= mongoose.model('books',userSchemaBook);

module.exports=Book;