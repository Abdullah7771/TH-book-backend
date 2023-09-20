const mongoose = require('mongoose');
const { Schema } = mongoose;
//Schema or model created for Team (Works as Table in SQL)
const ClassSchema = new Schema({
    grade:{
        type: String,
        required: true
    },
    category:{
        type: String,
        required: false
    },
    
   
  });


  //first argument must be same of that  existing collection of database which you want
  // otherwise new collection created
  module.exports = mongoose.model('Class', ClassSchema);