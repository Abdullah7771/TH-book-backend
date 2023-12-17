const mongoose = require('mongoose');
const { Schema } = mongoose;

const BooksSchema = new Schema({
    userid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', 
        required: true,
    },
    bookid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'books', 
        required: true,
    }
 
  });

  const SoldOutBooks = mongoose.model('soldoutbooks', BooksSchema);
  module.exports = SoldOutBooks;