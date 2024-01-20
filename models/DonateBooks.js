const mongoose = require('mongoose');
const { Schema } = mongoose;

const BooksSchema = new Schema({
    quantity:{
        type: Number,   
        required: true,
    },
    contact:{
        type: String,   
        required: true,
    },
    location:{
        type:String,
        required: true,
    }
 
  });


  const DonateBooks = mongoose.model('donatebooks', BooksSchema);
  module.exports = DonateBooks;