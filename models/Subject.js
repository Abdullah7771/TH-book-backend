const mongoose = require('mongoose');
const { Schema } = mongoose;
const SubjectSchema = new Schema({
    subject:{
        type: String,
        required: true
    },
   
  });



  module.exports = mongoose.model('subjects', SubjectSchema);