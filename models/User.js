const mongoose = require("mongoose");
const { Schema } = mongoose;
//Schema or model created for Round (Works as Table in SQL)
const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  fatherName: {
    type: String,
    required: true,
  },
  familyName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password:{
      type:String,
      required:true,
  },
  address: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  accountType: {
    type: String,
    enum: ["Admin", "User"], // Only 'admin' or 'user' allowed
    required: true,
  },
  books: [
    {
      bookid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'books', // Reference to your 'Book' model
        required: true,
      }
    }
  ]
    
});

//first argument must be same of that  existing collection of database which you want
// otherwise new collection created
module.exports = mongoose.model("users", UserSchema);
