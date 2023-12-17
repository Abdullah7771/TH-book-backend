const mongoose = require('mongoose');
const { Schema } = mongoose;

const BooksSchema = new Schema({
    userid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users', 
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

  const RequestedBooks = mongoose.model('requestedbooks', BooksSchema);
  module.exports = RequestedBooks;