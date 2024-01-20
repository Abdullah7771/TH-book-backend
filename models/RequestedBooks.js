const mongoose = require('mongoose');
const { Schema } = mongoose;

  const BooksSchema = new Schema({

    bookname:{
        type: String,
        required: true
    },
    subject:{
        type: String,
        required:true
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
    quantity:{
        type: Number,
        required: true
    },
    author:{
        type: String,
        required: false
    },
    description:{
        type:String,
        required:false
    }
   
  });

  const RequestedBooks = mongoose.model('requestedbooks', BooksSchema);
  module.exports = RequestedBooks;