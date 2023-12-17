const mongoose = require('mongoose');
const { Schema } = mongoose;

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


  const DonateBooks = mongoose.model('donatebooks', BooksSchema);
  module.exports = DonateBooks;