const mongoose = require('mongoose');
const { Schema } = mongoose;

//Schema or model created for Player (Works as Table in SQL)
const BooksSchema = new Schema({
    userid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', // Reference to your 'Book' model
        required: true,
    },
    bookname:{
        type: String,   
        required: true,
    },
    subject:{
        type: String,   
        required: true,
    },
    grade:{
        type:String,
        required: true,
    }
 
  });

  //first argument must be same of that  existing collection of database which you want
  // otherwise new collection created
  const RequestedBooks = mongoose.model('requestedbooks', BooksSchema);
  module.exports = RequestedBooks;