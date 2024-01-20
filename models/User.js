const mongoose = require("mongoose");
const { Schema } = mongoose;
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
        ref: 'books', 
        required: true,
      }
    }
  ]
  ,
  donatebooks: []
  ,
  requestedbooks: []
    
});


module.exports = mongoose.model("users", UserSchema);
