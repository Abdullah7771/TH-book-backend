const mongoose = require('mongoose');
const { Schema } = mongoose;

//Schema or model created for Player (Works as Table in SQL)
const BooksSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    subject:{
        type: String,
        required:false
    },
    // subject:{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref:'Subjects',
    //     required:false
    // },
    status:{
        type: String,
        required: true
    },
    grade:{
        type: String,
        required:true
    },
    // grade:{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref:'Class',
    //     required:false
    // },
    count:{
        type: Number,
        required: true
    },
    author:{
        type: String,
        required: false
    },
    // img:{
    //     data: Buffer,
    //     contentType: String,
    //     required:false
    // }
    img:{
        type: String,
        
    }
  });

  //first argument must be same of that  existing collection of database which you want
  // otherwise new collection created
  const Book = mongoose.model('books', BooksSchema);
  module.exports = Book;