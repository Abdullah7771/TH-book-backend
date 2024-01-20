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
   
  });

  const RequestedBooks = mongoose.model('requestedbooks', BooksSchema);
  module.exports = RequestedBooks;