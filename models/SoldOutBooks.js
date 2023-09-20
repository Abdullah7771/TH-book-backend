const mongoose = require('mongoose');
const { Schema } = mongoose;

//Schema or model created for Player (Works as Table in SQL)
const BooksSchema = new Schema({
    userid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', // Reference to your 'Book' model
        required: true,
    },
    bookid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'books', // Reference to your 'Book' model
        required: true,
    }
 
  });

  //first argument must be same of that  existing collection of database which you want
  // otherwise new collection created
  const SoldOutBooks = mongoose.model('soldoutbooks', BooksSchema);
  module.exports = SoldOutBooks;