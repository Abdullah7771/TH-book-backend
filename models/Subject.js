const mongoose = require('mongoose');
const { Schema } = mongoose;
//Schema or model created for Team (Works as Table in SQL)
const SubjectSchema = new Schema({
    subject:{
        type: String,
        required: true
    },
   
  });


  //first argument must be same of that  existing collection of database which you want
  // otherwise new collection created
  module.exports = mongoose.model('subjects', SubjectSchema);