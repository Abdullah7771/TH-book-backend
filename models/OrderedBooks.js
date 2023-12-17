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
        ref: 'books', // Reference to your 'Book' model
        required: true,
    }
 
  });

 
  const OrderedBooks = mongoose.model('orderedbooks', BooksSchema);
  module.exports = OrderedBooks;